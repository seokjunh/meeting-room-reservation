from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import database
from app.model import Reservation

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
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


@app.get("/get")
async def get_reservation(roomName: str, date: str):
  query = {"roomName": roomName, "date": date}
  result = await database["reservations"].find(query).to_list()

  for reservation in result:
    reservation["_id"] = str(reservation["_id"])
    
  return result
