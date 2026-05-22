from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL no está definida en el .env")


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def seed_tipos_ejercicio(db):
    from models import TipoEjercicio, OpcionAtributo

    existentes = db.query(TipoEjercicio).first()
    if existentes:
        return

    tipos_data = [
        {
            "nombre": "Dominada",
            "slug": "dominada",
            "tiene_kg": 1,
            "tiene_agarre": 1,
            "tiene_posicion_manos": 0,
            "opciones_agarre": ["neutro", "supino", "prono"]
        },
        {
            "nombre": "Dominada con salto",
            "slug": "dominada-salto",
            "tiene_kg": 1,
            "tiene_agarre": 1,
            "tiene_posicion_manos": 0,
            "opciones_agarre": ["neutro", "supino", "prono"]
        },
        {
            "nombre": "Flexiones de brazo",
            "slug": "flexiones",
            "tiene_kg": 1,
            "tiene_agarre": 0,
            "tiene_posicion_manos": 1,
            "opciones_posicion": ["amplia", "media", "cerrada"]
        },
        {
            "nombre": "Fondos con barra",
            "slug": "fondos-barra",
            "tiene_kg": 1,
            "tiene_agarre": 0,
            "tiene_posicion_manos": 0,
            "opciones_agarre": []
        }
    ]

    for data in tipos_data:
        tipo = TipoEjercicio(
            nombre=data["nombre"],
            slug=data["slug"],
            tiene_kg=data["tiene_kg"],
            tiene_agarre=data["tiene_agarre"],
            tiene_posicion_manos=data["tiene_posicion_manos"]
        )
        db.add(tipo)
        db.flush()

        if "opciones_agarre" in data and data["opciones_agarre"]:
            for valor in data["opciones_agarre"]:
                opcion = OpcionAtributo(tipo_ejercicio_id=tipo.id, tipo="agarre", valor=valor)
                db.add(opcion)

        if "opciones_posicion" in data and data["opciones_posicion"]:
            for valor in data["opciones_posicion"]:
                opcion = OpcionAtributo(tipo_ejercicio_id=tipo.id, tipo="posicion", valor=valor)
                db.add(opcion)

    db.commit()