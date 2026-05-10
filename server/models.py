from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    nombre = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    foto_url = Column(String, nullable=True)

    sesiones = relationship("Sesion", back_populates="usuario")


class Sesion(Base):
    __tablename__ = "sesiones"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    fecha = Column(Date, nullable=False)
    notas = Column(String, nullable=True)

    usuario = relationship("Usuario", back_populates="sesiones")
    ejercicios = relationship("Ejercicio", back_populates="sesion")


class Ejercicio(Base):
    __tablename__ = "ejercicios"

    id = Column(Integer, primary_key=True, index=True)
    sesion_id = Column(Integer, ForeignKey("sesiones.id"), nullable=False)
    nombre = Column(String, nullable=False)
    series = Column(Integer, nullable=True)
    repeticiones = Column(Integer, nullable=True)
    peso_kg = Column(Float, nullable=True)

    sesion = relationship("Sesion", back_populates="ejercicios")