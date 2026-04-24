from fastapi import FastAPI
from app.database import engine, Base
from app.models import user
from app.routes import user as user_routes, event, booking
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["*"],
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(user_routes.router)
app.include_router(event.router)
app.include_router(booking.router)

@app.get("/")
def root():
    return{"status":"connected"}