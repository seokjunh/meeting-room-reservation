from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import database
from app.model import Reservation

app = FastAPI()

origins = [
  "http://127.0.0.1:5173",
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)


@app.get("/")
async def read_root():
  return {"hello : world"}


@app.post("/create")
async def create_reservation(req: Reservation):
  req_dict = dict(req)

  result = await database["reservations"].insert_one(req_dict)

  return {"message": "Reservation created", "id": str(result.inserted_id)}
