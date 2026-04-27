from pydantic import BaseModel, Field

class EventCreate(BaseModel):
    title: str
    description: str
    price: float = Field(default=0, ge=0)
    image_data: str | None = None
    image_name: str | None = None

class EventResponse(BaseModel):
    id: int
    title: str
    description: str
    price: float = 0
    image_url: str | None = None
    created_by: int | None = None

    class Config:
        from_attributes = True
