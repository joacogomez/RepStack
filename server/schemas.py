from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional

# ── Auth ──────────────────────────────────────────
class UsuarioRegistro(BaseModel):
    email: EmailStr
    password: str
    nombre: str

class UsuarioLogin(BaseModel):
    email: EmailStr
    password: str

class UsuarioRespuesta(BaseModel):
    id: int
    email: str
    nombre: str
    foto_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# ── Ejercicios ────────────────────────────────────
class EjercicioCrear(BaseModel):
    nombre: str
    series: Optional[int] = None
    repeticiones: Optional[int] = None
    peso_kg: Optional[float] = None

class EjercicioRespuesta(EjercicioCrear):
    id: int

    class Config:
        from_attributes = True

# ── Sesiones ──────────────────────────────────────
class SesionCrear(BaseModel):
    fecha: date
    notas: Optional[str] = None

class SesionRespuesta(BaseModel):
    id: int
    fecha: date
    notas: Optional[str] = None
    ejercicios: list[EjercicioRespuesta] = []

    class Config:
        from_attributes = True