from fastapi import APIRouter, Header
from pydantic import BaseModel
from typing import Annotated

import os
import jwt
from datetime import datetime, timezone
from utils.logging import dev_log, dev_error, dev_error_database

from ..supabase_client import supabase_client

# database tables
USERS_TABLE = "users"
GAMES_TABLE = "games"
LIBRARY_TABLE = "library"

# Other constants
STATUS_SUCCESS_MESSAGE = "Success"
STATUS_FAIL_MESSAGE = "Fail"

router = APIRouter()

# ----------------------------------------------------------------- #
#                            BASE MODELS                            #
# ----------------------------------------------------------------- #
class User(BaseModel):
    username: str
    password: str

# queries database to check if username already exists
def usernameAlreadyExists(username):
    response = (
        supabase_client.table(USERS_TABLE)
        .select("*")
        .eq("username", username)
        .execute()
    )
    return len(response.data) > 0

# ----------------------------------------------------------------- #
#                            ENDPOINTS                              #
# ----------------------------------------------------------------- #
# Allow pinging server
@router.api_route("/", methods=["GET", "HEAD"])
async def root():
    endpoint = "root"

    dev_log(endpoint, "Endpoint called")
    return {"status": STATUS_SUCCESS_MESSAGE}

# API to sign up user, returns "Success" or "Fail" with details if unsuccessful
@router.post("/signup")
async def signup(user: User):
    endpoint = "signup"

    dev_log(endpoint, "Endpoint called")
    try:
        user.username = user.username.upper()
        if usernameAlreadyExists(user.username):
            # return username already exists
            dev_log(endpoint, f"Sign up unsuccessful.  User '{user.username}' already exists")
            return {"status": STATUS_FAIL_MESSAGE, "details": "Username already exists"}
        else:
            # insert username and password into table, return successful sign up
            response = (
                supabase_client.table(USERS_TABLE)
                .insert({"username": user.username, "password": user.password})
                .execute()
            )
            dev_log(endpoint, f"User '{user.username}' signed up")
            return {"status": STATUS_SUCCESS_MESSAGE}
    except Exception as e:
        dev_error_database(endpoint, e)
        return {"status": STATUS_FAIL_MESSAGE, "details": e}
    
# API to authenticate user, returns "Success" or "Fail" with details if unsuccessful
@router.post("/login")
async def login(user: User):
    endpoint = "login"

    dev_log(endpoint, "Endpoint called")
    try:
        user.username = user.username.upper()
        response = (
            supabase_client.table(USERS_TABLE)
            .select("password")
            .eq("username",user.username)
            .execute()
        )
        # if user exists in database
        if len(response.data):
            db_password = response.data[0]["password"]
            # if password matches the one in database
            if db_password == user.password:
                dev_log(endpoint, f"User '{user.username}' logged in")

                # create JWT token
                key = os.environ.get("JWT_SECRET_KEY")
                payload_encoded = jwt.encode({"username": user.username}, key=key, algorithm="HS256")

                return {"status": STATUS_SUCCESS_MESSAGE, "token": payload_encoded}
            else:
                dev_log(endpoint, f"Password for '{user.username}' is incorrect")
                return {"status": STATUS_FAIL_MESSAGE, "details": "Incorrect password"}
        # user does not exist
        else:
            dev_log(endpoint, f"User '{user.username}' does not exist")
            return {"status": STATUS_FAIL_MESSAGE, "details": "User does not exist"}
    except Exception as e:
        dev_error_database(endpoint, e)
        return {"status": STATUS_FAIL_MESSAGE, "details": e}

# API to authenticate user using JWT token
@router.get("/auth")
async def auth(Authorization_header: Annotated[str | None, Header(alias="Authorization", convert_underscores=False)] = None):
    endpoint = "auth"

    dev_log(endpoint, "Endpoint called")

    # decode JWT token
    key = os.environ.get("JWT_SECRET_KEY")
    try:
        token = Authorization_header.replace("Bearer ", "")
        payload_decoded = jwt.decode(token, key=key, algorithms="HS256")
        username = payload_decoded["username"]
        return {"status": STATUS_SUCCESS_MESSAGE, "username": username}
    except Exception as e:
        dev_error(endpoint, e)
        return {"status": STATUS_FAIL_MESSAGE, "details": e}

# API to return all games in the store
@router.get("/store")
async def store():
    endpoint = "store"

    dev_log(endpoint, "Endpoint called")
    try:
        response = (
            supabase_client.table(GAMES_TABLE)
            .select("gameID,name,description,author,version,is_playable,library_adds")
            .order("gameID", desc=False)
            .execute()
        )
        dev_log(endpoint, "Store fetched from database")
        return {"status": STATUS_SUCCESS_MESSAGE, "data": response.data}
    except Exception as e:
        dev_error_database(endpoint, e)
        return {"status": STATUS_FAIL_MESSAGE, "details": e}

# API to return user's list of library games
@router.get("/library/{username}")
async def library(username: str):
    endpoint = "library"

    dev_log(endpoint, "Endpoint called")
    try:
        username = username.upper()
        response = (
            supabase_client.table(LIBRARY_TABLE)
            .select("gameID,added_at")
            .eq("username", username)
            .order("added_at", desc=False)
            .execute()
        )
        dev_log(endpoint, f"Library for '{username}' fetched from database")
        return {"status": STATUS_SUCCESS_MESSAGE, "data": response.data}
    except Exception as e:
        dev_error_database(endpoint, e)
        return {"status": STATUS_FAIL_MESSAGE, "details": e}
    
# API to add game to user's library
@router.post("/addToLibrary/{username}/{gameID}")
async def addToLibrary(username: str, gameID: int):
    endpoint = "addToLibrary"

    dev_log(endpoint, "Endpoint called")
    try:
        username = username.upper()
        added_at = datetime.now(timezone.utc).isoformat()
        response = (
            supabase_client.table(LIBRARY_TABLE)
            .insert({"username": username, "gameID": gameID, "added_at": added_at})
            .execute()
        )
        game_added = {k:v for k,v in response.data[0].items() if k != "username"} # remove username field from response
        dev_log(endpoint, f"Game ID {gameID} added to {username}'s library")
        return {"status": STATUS_SUCCESS_MESSAGE, "data": [game_added]}
    except Exception as e:
        dev_error_database(endpoint, e)
        return {"status": STATUS_FAIL_MESSAGE, "details": e}
    
# API to remove game from user's library
@router.delete("/removeFromLibrary/{username}/{gameID}")
async def removeFromLibrary(username: str, gameID: int):
    endpoint = "removeFromLibrary"

    dev_log(endpoint, "Endpoint called")
    try:
        username = username.upper()
        response = (
            supabase_client.table(LIBRARY_TABLE)
            .delete()
            .match({"username": username, "gameID": gameID})
            .execute()
        )
        dev_log(endpoint, f"Game ID {gameID} removed from {username}'s library")
        return {"status": STATUS_SUCCESS_MESSAGE}
    except Exception as e:
        dev_error_database(endpoint, e)
        return {"status": STATUS_FAIL_MESSAGE, "details": e}