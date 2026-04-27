import base64
import binascii
from pathlib import Path
import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.event import Event
from app.core.security import get_current_admin
from app.models.user import User
from app.schemas.event import EventCreate, EventResponse

router = APIRouter(prefix="/events", tags=["Events"])
UPLOADS_DIR = Path(__file__).resolve().parents[2] / "uploads" / "events"
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
ALLOWED_MIME_EXTENSIONS = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
}
MAX_IMAGE_BYTES = 5 * 1024 * 1024


def save_event_image(image_data: str, image_name: str | None) -> str:
    encoded_data = image_data
    file_extension = None

    if image_data.startswith("data:") and ";base64," in image_data:
        header, encoded_data = image_data.split(",", 1)
        mime_type = header[5:].split(";")[0].lower()
        file_extension = ALLOWED_MIME_EXTENSIONS.get(mime_type)

    if not file_extension and image_name:
        file_extension = Path(image_name).suffix.lower()

    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported image format")

    try:
        file_bytes = base64.b64decode(encoded_data, validate=True)
    except (binascii.Error, ValueError) as exc:
        raise HTTPException(status_code=400, detail="Invalid image data") from exc

    if len(file_bytes) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=400, detail="Image must be 5MB or smaller")

    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid.uuid4().hex}{file_extension}"
    file_path = UPLOADS_DIR / filename
    file_path.write_bytes(file_bytes)

    return f"/uploads/events/{filename}"


def delete_event_image(image_url: str | None):
    if not image_url or not image_url.startswith("/uploads/events/"):
        return

    file_path = UPLOADS_DIR / Path(image_url).name

    if file_path.exists():
        file_path.unlink()


# GET ALL EVENTS
@router.get("/", response_model=list[EventResponse])
def get_events(db: Session = Depends(get_db)):
    return db.query(Event).all()


# DELETE EVENT
@router.delete("/{id}")
def delete_event(
    id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    event = db.query(Event).filter(Event.id == id).first()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    delete_event_image(event.image_url)
    db.delete(event)
    db.commit()

    return {"message": "Deleted"}


# CREATE EVENT ADMIN ONLY
@router.post("/", response_model=EventResponse)
def create_event(
    event: EventCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    image_url = (
        save_event_image(event.image_data, event.image_name)
        if event.image_data
        else None
    )

    new_event = Event(
        title=event.title,
        description=event.description,
        price=event.price,
        image_url=image_url,
        created_by=admin.id
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event
