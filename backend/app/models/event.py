from sqlalchemy import Column, Integer, String
from app.database import Base

class Event(Base):
    __tablename__="events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)