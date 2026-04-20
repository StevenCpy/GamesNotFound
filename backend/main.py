from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# only allow React dev server to send API requests to server
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],    # allow GET, POST, PUT, DELETE methods
    allow_headers=["*"]
)

class User(BaseModel):
    username: str
    password: str

@app.post("/signup")
async def signup(user: User):
    return {"message": "testing signup API", "username": user.username, "password": user.password}