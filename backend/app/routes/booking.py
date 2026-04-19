from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.event import Event

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.post("/")
def book_event(data: dict, db: Session = Depends(get_db)):
    event_id = data.get("event_id")

    event = db.query(Event).filter(Event.id == event_id).first()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    return {
        "message": "Booked successfully",
        "event_id": event_id
    }