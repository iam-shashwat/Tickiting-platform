from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base

DATABASE_URL = "postgresql://shashwat@localhost:5432/ticketing_db"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

def ensure_event_schema():
    inspector = inspect(engine)

    if "events" not in inspector.get_table_names():
        return

    event_columns = {column["name"] for column in inspector.get_columns("events")}

    if "image_url" not in event_columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE events ADD COLUMN image_url VARCHAR"))

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
