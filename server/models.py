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
    is_admin = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())
    foto_url = Column(String, nullable=True)

    sesiones = relationship("Sesion", back_populates="usuario")


class TipoEjercicio(Base):
    __tablename__ = "tipos_ejercicio"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    tiene_kg = Column(Integer, default=0)
    tiene_agarre = Column(Integer, default=0)
    tiene_posicion_manos = Column(Integer, default=0)

    opciones = relationship("OpcionAtributo", back_populates="tipo_ejercicio")


class OpcionAtributo(Base):
    __tablename__ = "opciones_atributo"

    id = Column(Integer, primary_key=True, index=True)
    tipo_ejercicio_id = Column(Integer, ForeignKey("tipos_ejercicio.id"), nullable=False)
    tipo = Column(String, nullable=False)
    valor = Column(String, nullable=False)

    tipo_ejercicio = relationship("TipoEjercicio", back_populates="opciones")


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
    tipo_ejercicio_id = Column(Integer, ForeignKey("tipos_ejercicio.id"), nullable=True)
    tipo_agarre = Column(String, nullable=True)
    posicion_manos = Column(String, nullable=True)
    series = Column(Integer, nullable=True)
    repeticiones = Column(Integer, nullable=True)
    peso_kg = Column(Float, nullable=True)

    sesion = relationship("Sesion", back_populates="ejercicios")
    tipo_ejercicio = relationship("TipoEjercicio")