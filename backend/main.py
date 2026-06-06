from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv

# load .env variables
load_dotenv()

from routes.v1.endpoints import router as router_v1
from routes.v2 import router as router_v2

app = FastAPI()

# ------------------- DEFINE fastAPI CORS POLICIES ----------------
# only allow React dev server and deployed site to send API requests to server
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://www.gamesnotfound.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],    # allow GET, POST, PUT, DELETE methods
    allow_headers=["*"]
)

app.include_router(router_v1, prefix="/api/v1", tags=["v1"])
app.include_router(router_v2, prefix="/api/v2")