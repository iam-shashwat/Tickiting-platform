from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.event import Event

router = APIRouter(prefix="/events", tags=["Events"])


# GET ALL EVENTS
@router.get("/")
def get_events(db: Session = Depends(get_db)):
    return db.query(Event).all()


# CREATE EVENT
@router.post("/")
def create_event(data: dict, db: Session = Depends(get_db)):
    new_event = Event(
        title=data.get("title"),
        description=data.get("description")
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return new_event


# DELETE EVENT
@router.delete("/{id}")
def delete_event(id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == id).first()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    db.delete(event)
    db.commit()

    return {"message": "Deleted"}