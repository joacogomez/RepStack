from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth
from routers import auth, sesiones
import models

Base.metadata.create_all(bind=engine)

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

@app.get("/")
def root():
    return {"message": "RepStack API funcionando"}