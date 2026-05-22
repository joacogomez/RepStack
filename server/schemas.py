from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional, List

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
    is_admin: int = 0
    foto_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# ── Tipos de Ejercicio ────────────────────────────
class OpcionAtributoCrear(BaseModel):
    tipo: str
    valor: str

class OpcionAtributoRespuesta(OpcionAtributoCrear):
    id: int

    class Config:
        from_attributes = True

class TipoEjercicioCrear(BaseModel):
    nombre: str
    slug: str
    tiene_kg: int = 0
    tiene_agarre: int = 0
    tiene_posicion_manos: int = 0
    opciones: List[OpcionAtributoCrear] = []

class TipoEjercicioRespuesta(BaseModel):
    id: int
    nombre: str
    slug: str
    tiene_kg: int
    tiene_agarre: int
    tiene_posicion_manos: int
    opciones: List[OpcionAtributoRespuesta] = []

    class Config:
        from_attributes = True

# ── Ejercicios ────────────────────────────────────
class EjercicioCrear(BaseModel):
    tipo_ejercicio_id: Optional[int] = None
    tipo_agarre: Optional[str] = None
    posicion_manos: Optional[str] = None
    series: Optional[int] = None
    repeticiones: Optional[int] = None
    peso_kg: Optional[float] = None

class EjercicioRespuesta(BaseModel):
    id: int
    tipo_ejercicio_id: Optional[int] = None
    tipo_agarre: Optional[str] = None
    posicion_manos: Optional[str] = None
    series: Optional[int] = None
    repeticiones: Optional[int] = None
    peso_kg: Optional[float] = None
    tipo_ejercicio: Optional[TipoEjercicioRespuesta] = None

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