from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.database import engine, Base, ensure_event_schema
from app.models import user
from app.routes import user as user_routes, event, booking
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()
uploads_dir = Path(__file__).resolve().parents[1] / "uploads"
uploads_dir.mkdir(parents=True, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["*"],
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
ensure_event_schema()
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

app.include_router(user_routes.router)
app.include_router(event.router)
app.include_router(booking.router)

@app.get("/")
def root():
    return{"status":"connected"}
