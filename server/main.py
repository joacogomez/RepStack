from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, seed_tipos_ejercicio, SessionLocal
from routers import auth
from routers import auth, sesiones, tipos_ejercicio
import models

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