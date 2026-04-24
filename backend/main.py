from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import os
from supabase import create_client, Client
from supabase.client import ClientOptions
from dotenv import load_dotenv

USER_TABLE = "users"
STATUS_SUCCESS_MESSAGE = "Success"
STATUS_FAIL_MESSAGE = "Fail"
TIMEOUT_SECONDS = 10

# load .env variables
load_dotenv()

app = FastAPI()

# ---------------- DEFINE SUPABASE CLIENT -------------------
# SUPABASE_URL and SUPABASE_KEY stored in .env
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(
    url,
    key,
    options=ClientOptions(
        postgrest_client_timeout=TIMEOUT_SECONDS,
        storage_client_timeout=TIMEOUT_SECONDS,
        schema="public",
    )
)

# ------------------- DEFINE fastAPI CORS POLICIES ----------------
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

# -----------------------------------------------------------------

class User(BaseModel):
    username: str
    password: str

# queries database to check if username already exists
def usernameAlreadyExists(username):
    response = (
        supabase.table(USER_TABLE)
        .select("*")
        .eq("username", username)
        .execute()
    )
    return len(response.data) > 0

# Allow pinging server
@app.api_route("/", methods=["GET", "HEAD"])
async def root():
    return {"status": STATUS_SUCCESS_MESSAGE}

# API to sign up user, returns "Success" or "Fail" with details if unsuccessful
@app.post("/signup")
async def signup(user: User):
    try:
        if usernameAlreadyExists(user.username):
            # return username already exists
            return {"status": STATUS_FAIL_MESSAGE, "details": "Username already exists"}
        else:
            # insert username and password into table, return successful sign up
            response = (
                supabase.table(USER_TABLE)
                .insert({"username": user.username, "password": user.password})
                .execute()
            )
            return {"status": STATUS_SUCCESS_MESSAGE}
    except:
        # return database timeout error message
        return {"status": STATUS_FAIL_MESSAGE, "details": "Database timeout"}
    
# API to authenticate user, returns "Success" or "Fail" with details if unsuccessful
@app.post("/login")
async def login(user: User):
    try:
        response = (
            supabase.table(USER_TABLE)
            .select("password")
            .eq("username",user.username)
            .execute()
        )
        # if user exists in database
        if len(response.data):
            db_password = response.data[0]["password"]
            # if password matches the one in database
            if db_password == user.password:
                return {"status": STATUS_SUCCESS_MESSAGE}
            else:
                return {"status": STATUS_FAIL_MESSAGE, "details": "Incorrect password"}
        # user does not exist
        else:
            return {"status": STATUS_FAIL_MESSAGE, "details": "User does not exist"}
    except:
        # return database timeout error message
        return {"status": STATUS_FAIL_MESSAGE, "details": "Database timeout"}