from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Usuario, Sesion, Ejercicio
from schemas import SesionCrear, SesionRespuesta, EjercicioCrear, EjercicioRespuesta
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY: str = os.getenv("SECRET_KEY", "")
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
router = APIRouter(prefix="/sesiones", tags=["sesiones"])


def get_usuario_actual(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Usuario:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        usuario_id = payload.get("sub")
        if usuario_id is None:
            raise HTTPException(status_code=401, detail="Token inválido")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")

    usuario = db.query(Usuario).filter(Usuario.id == int(usuario_id)).first()
    if not usuario:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")
    return usuario


@router.get("/", response_model=list[SesionRespuesta])
def get_sesiones(db: Session = Depends(get_db), usuario: Usuario = Depends(get_usuario_actual)):
    return db.query(Sesion).filter(Sesion.usuario_id == usuario.id).all()


@router.post("/", response_model=SesionRespuesta)
def crear_sesion(datos: SesionCrear, db: Session = Depends(get_db), usuario: Usuario = Depends(get_usuario_actual)):
    sesion_existente = db.query(Sesion).filter(
        Sesion.usuario_id == usuario.id,
        Sesion.fecha == datos.fecha
    ).first()
    if sesion_existente:
        raise HTTPException(status_code=400, detail="Ya existe una sesión para esta fecha")

    sesion = Sesion(usuario_id=usuario.id, fecha=datos.fecha, notas=datos.notas)
    db.add(sesion)
    db.commit()
    db.refresh(sesion)
    return sesion


@router.get("/{fecha}", response_model=SesionRespuesta)
def get_sesion_por_fecha(fecha: str, db: Session = Depends(get_db), usuario: Usuario = Depends(get_usuario_actual)):
    sesion = db.query(Sesion).filter(
        Sesion.usuario_id == usuario.id,
        Sesion.fecha == fecha
    ).first()
    if not sesion:
        raise HTTPException(status_code=404, detail="No hay sesión para esta fecha")
    return sesion


@router.post("/{sesion_id}/ejercicios", response_model=EjercicioRespuesta)
def agregar_ejercicio(sesion_id: int, datos: EjercicioCrear, db: Session = Depends(get_db), usuario: Usuario = Depends(get_usuario_actual)):
    sesion = db.query(Sesion).filter(
        Sesion.id == sesion_id,
        Sesion.usuario_id == usuario.id
    ).first()
    if not sesion:
        raise HTTPException(status_code=404, detail="Sesión no encontrada")

    ejercicio = Ejercicio(sesion_id=sesion_id, **datos.model_dump())
    db.add(ejercicio)
    db.commit()
    db.refresh(ejercicio)
    return ejercicio


@router.delete("/ejercicios/{ejercicio_id}", status_code=204)
def eliminar_ejercicio(ejercicio_id: int, db: Session = Depends(get_db), usuario: Usuario = Depends(get_usuario_actual)):
    ejercicio = db.query(Ejercicio).join(Sesion).filter(
        Ejercicio.id == ejercicio_id,
        Sesion.usuario_id == usuario.id
    ).first()
    if not ejercicio:
        raise HTTPException(status_code=404, detail="Ejercicio no encontrado")

    db.delete(ejercicio)
    db.commit()