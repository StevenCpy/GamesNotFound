from fastapi import APIRouter, Header
from pydantic import BaseModel
from typing import Annotated

import jwt
from utils.logging import dev_log, dev_error, dev_error_database

from ..supabase_client import supabase_client
from ..supabase_client import USERS_TABLE
from ..status_message import status_success, status_fail
from .utils import encode_HS256, decode_payload_HS256

router = APIRouter(
    prefix="/auth"
)

# ----------------------------------------------------------------- #
#                            BASE MODELS                            #
# ----------------------------------------------------------------- #
class Auth(BaseModel):
    username: str
    password: str

# ----------------------------------------------------------------- #
#                             /signup                               #
# ----------------------------------------------------------------- #
# queries database to check if username already exists
def usernameAlreadyExists(username):
    response = supabase_client.table(USERS_TABLE).select("*").eq("username", username).execute()
    return len(response.data) > 0

# API to sign up user, returns "Success" or "Fail" with details if unsuccessful
@router.post("/signup")
async def signup(auth: Auth):
    endpoint = "signup"
    dev_log(endpoint, "Endpoint called")

    username = auth.username.upper()
    try:
        if usernameAlreadyExists(username):
            # return username already exists
            dev_log(endpoint, f"Sign up unsuccessful.  User '{username}' already exists")
            return status_fail({"details": "Username already exists"})
        else:
            # insert username and password into table
            supabase_client.table(USERS_TABLE).insert({
                "username": username,
                "password": auth.password
            }).execute()

            dev_log(endpoint, f"User '{username}' signed up")
            return status_success()
    except Exception as e:
        dev_error_database(endpoint, e)
        return status_fail("Database error")

# ----------------------------------------------------------------- #
#                              /login                               #
# ----------------------------------------------------------------- #
# API to authenticate user, returns "Success" or "Fail" with details if unsuccessful
@router.post("/login")
async def login(auth: Auth):
    endpoint = "login"
    dev_log(endpoint, "Endpoint called")

    username = auth.username.upper()
    try:
        # query database for user's actual password
        response = (
            supabase_client.table(USERS_TABLE)
            .select("password")
            .eq("username",username)
            .execute()
        )
        # if user exists in database
        if len(response.data):
            db_password = response.data[0]["password"]
            # if password matches the one in database
            if db_password == auth.password:
                dev_log(endpoint, f"User '{username}' logged in")

                # encode payload
                payload = {"username": username}
                token = encode_HS256(payload)
                return status_success({"token": token})
            else:
                dev_log(endpoint, f"Password for '{username}' is incorrect")
                return status_fail("Incorrect password")
        # user does not exist
        else:
            dev_log(endpoint, f"User '{username}' does not exist")
            return status_fail("User does not exist")
    except Exception as e:
        dev_error_database(endpoint, e)
        return status_fail("Database error")

# ----------------------------------------------------------------- #
#                               /me                                 #
# ----------------------------------------------------------------- #
# API to authenticate user using JWT token
@router.get("/me")
async def auth(Authorization: Annotated[str|None, Header()] = None):
    endpoint = "me"
    dev_log(endpoint, "Endpoint called")

    try:
        # decode payload
        username = decode_payload_HS256(Authorization)["username"]
        return status_success({"username": username})
    except Exception as e:
        dev_error(endpoint, e)
        return status_fail("Token could not be decoded")