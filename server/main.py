from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, seed_tipos_ejercicio, SessionLocal
from routers import auth
from routers import auth, sesiones, tipos_ejercicio
from sqlalchemy import text
import models

def run_migrations():
    db = SessionLocal()
    try:
        db.execute(text("ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS is_admin INTEGER DEFAULT 0"))
        
        db.execute(text("ALTER TABLE ejercicios ADD COLUMN IF NOT EXISTS tipo_ejercicio_id INTEGER"))
        db.execute(text("ALTER TABLE ejercicios ADD COLUMN IF NOT EXISTS tipo_agarre VARCHAR"))
        db.execute(text("ALTER TABLE ejercicios ADD COLUMN IF NOT EXISTS posicion_manos VARCHAR"))
        db.execute(text("ALTER TABLE ejercicios DROP COLUMN IF EXISTS nombre"))
        
        db.execute(text("""
            CREATE TABLE IF NOT EXISTS tipos_ejercicio (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR NOT NULL,
                slug VARCHAR UNIQUE NOT NULL,
                tiene_kg INTEGER DEFAULT 0,
                tiene_agarre INTEGER DEFAULT 0,
                tiene_posicion_manos INTEGER DEFAULT 0
            )
        """))
        
        db.execute(text("""
            CREATE TABLE IF NOT EXISTS opciones_atributo (
                id SERIAL PRIMARY KEY,
                tipo_ejercicio_id INTEGER REFERENCES tipos_ejercicio(id),
                tipo VARCHAR NOT NULL,
                valor VARCHAR NOT NULL
            )
        """))
        
        db.commit()
    except Exception as e:
        print(f"Error en migraciones: {e}")
        db.rollback()
    finally:
        db.close()

run_migrations()

Base.metadata.create_all(bind=engine)

db = SessionLocal()
try:
    seed_tipos_ejercicio(db)
finally:
    db.close()

app = FastAPI(title="RepStack API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(sesiones.router)
app.include_router(tipos_ejercicio.router)

@app.get("/")
def root():
    return {"message": "RepStack API funcionando"}