from pydantic import BaseModel

class EventCreate(BaseModel):
    title: str
    description: str

class EventResponse(BaseModel):
    id: int
    title: str
    description: str
    created_by: int

    class Config:
        from_attributes = True