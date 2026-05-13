from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
from models import Usuario
from schemas import UsuarioRegistro, UsuarioLogin, UsuarioRespuesta, Token

from jose import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
import bcrypt

load_dotenv()

SECRET_KEY: str = os.getenv("SECRET_KEY", "")

if not SECRET_KEY:
    raise ValueError("SECRET_KEY no está definida en el .env")


ALGORITHM = "HS256"
EXPIRACION_MINUTOS = 60 * 24


router = APIRouter(prefix="/auth", tags=["auth"])

def hashear_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verificar_password(password: str, hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hash.encode("utf-8"))

def crear_token(data: dict) -> str:
    payload = data.copy()
    expiracion = datetime.utcnow() + timedelta(minutes=EXPIRACION_MINUTOS)
    payload.update({"exp": expiracion})
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/register", response_model=UsuarioRespuesta)
def register(datos: UsuarioRegistro, db: Session = Depends(get_db)):
    usuario_existente = db.query(Usuario).filter(Usuario.email == datos.email).first()
    if usuario_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado"
        )

    nuevo_usuario = Usuario(
        email=datos.email,
        password_hash=hashear_password(datos.password),
        nombre=datos.nombre
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario


@router.post("/login", response_model=Token)
def login(datos: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == datos.username).first()
    if not usuario or not verificar_password(datos.password, str(usuario.password_hash)):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos"
        )

    token = crear_token({"sub": str(usuario.id), "is_admin": usuario.is_admin})
    return {"access_token": token, "token_type": "bearer"}