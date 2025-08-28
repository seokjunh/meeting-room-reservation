from pydantic import BaseModel

class Reservation(BaseModel):
  roomName: str
  topic: str
  attendees: list[str]
  selectedTime: list[str]
  date: str
