from sqlalchemy import Column, Float, ForeignKey, Integer, String
from app.database import Base

class Event(Base):
    __tablename__="events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    image_url = Column(String, nullable=True)
    price = Column(Float, nullable=False, default=0)

    created_by = Column(Integer, ForeignKey("users.id"))
