from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Usuario, TipoEjercicio, OpcionAtributo
from schemas import TipoEjercicioRespuesta, TipoEjercicioCrear, OpcionAtributoCrear
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY: str = os.getenv("SECRET_KEY", "")
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
router = APIRouter(prefix="/tipos-ejercicio", tags=["tipos-ejercicio"])


def get_usuario_actual(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Usuario:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        usuario_id = payload.get("sub")
        if usuario_id is None:
            raise Exception("Token inválido")
    except JWTError:
        raise Exception("Token inválido")

    usuario = db.query(Usuario).filter(Usuario.id == int(usuario_id)).first()
    if not usuario:
        raise Exception("Usuario no encontrado")
    return usuario


def get_admin_current(usuario: Usuario = Depends(get_usuario_actual)) -> Usuario:
    if not usuario.is_admin:
        raise Exception("Acceso denegado")
    return usuario


@router.get("/", response_model=list[TipoEjercicioRespuesta])
def get_tipos_ejercicio(db: Session = Depends(get_db)):
    return db.query(TipoEjercicio).all()


@router.post("/", response_model=TipoEjercicioRespuesta)
def crear_tipo_ejercicio(datos: TipoEjercicioCrear, db: Session = Depends(get_db), usuario: Usuario = Depends(get_admin_current)):
    tipo = TipoEjercicio(
        nombre=datos.nombre,
        slug=datos.slug,
        tiene_kg=datos.tiene_kg,
        tiene_agarre=datos.tiene_agarre,
        tiene_posicion_manos=datos.tiene_posicion_manos
    )
    db.add(tipo)
    db.flush()

    for opcion in datos.opciones:
        nueva_opcion = OpcionAtributo(
            tipo_ejercicio_id=tipo.id,
            tipo=opcion.tipo,
            valor=opcion.valor
        )
        db.add(nueva_opcion)

    db.commit()
    db.refresh(tipo)
    return tipo


@router.put("/{tipo_id}", response_model=TipoEjercicioRespuesta)
def actualizar_tipo_ejercicio(tipo_id: int, datos: TipoEjercicioCrear, db: Session = Depends(get_db), usuario: Usuario = Depends(get_admin_current)):
    tipo = db.query(TipoEjercicio).filter(TipoEjercicio.id == tipo_id).first()
    if not tipo:
        raise Exception("Tipo de ejercicio no encontrado")

    tipo.nombre = datos.nombre
    tipo.slug = datos.slug
    tipo.tiene_kg = datos.tiene_kg
    tipo.tiene_agarre = datos.tiene_agarre
    tipo.tiene_posicion_manos = datos.tiene_posicion_manos

    db.query(OpcionAtributo).filter(OpcionAtributo.tipo_ejercicio_id == tipo_id).delete()

    for opcion in datos.opciones:
        nueva_opcion = OpcionAtributo(
            tipo_ejercicio_id=tipo.id,
            tipo=opcion.tipo,
            valor=opcion.valor
        )
        db.add(nueva_opcion)

    db.commit()
    db.refresh(tipo)
    return tipo


@router.delete("/{tipo_id}", status_code=204)
def eliminar_tipo_ejercicio(tipo_id: int, db: Session = Depends(get_db), usuario: Usuario = Depends(get_admin_current)):
    tipo = db.query(TipoEjercicio).filter(TipoEjercicio.id == tipo_id).first()
    if not tipo:
        raise Exception("Tipo de ejercicio no encontrado")

    db.query(OpcionAtributo).filter(OpcionAtributo.tipo_ejercicio_id == tipo_id).delete()
    db.delete(tipo)
    db.commit()
    return None