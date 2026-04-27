from pydantic import BaseModel

class EventCreate(BaseModel):
    title: str
    description: str
    image_data: str | None = None
    image_name: str | None = None

class EventResponse(BaseModel):
    id: int
    title: str
    description: str
    image_url: str | None = None
    created_by: int | None = None

    class Config:
        from_attributes = True
