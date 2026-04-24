from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.booking import Booking
from app.models.event import Event
from app.models.user import User
from app.core.security import get_current_user, get_current_admin

router = APIRouter(prefix="/book", tags=["Booking"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/{event_id}")
def book_event(
    event_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # check event exists
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # prevent duplicate booking
    existing = db.query(Booking).filter(
        Booking.user_id == current_user.id,
        Booking.event_id == event_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Already booked")

    booking = Booking(
        user_id=current_user.id,
        event_id=event_id
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)

    return booking


@router.get("/my")
def get_my_bookings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Booking).filter(
        Booking.user_id == current_user.id
    ).all()



@router.get("/event/{event_id}")
def get_event_bookings(
    event_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    bookings = db.query(Booking).filter(
        Booking.event_id == event_id
    ).all()

    result = []

    for booking in bookings:
        user = db.query(User).filter(User.id == booking.user_id).first()

        result.append({
            "booking_id": booking.id,
            "user_id": user.id,
            "email": user.email
        })

    return result