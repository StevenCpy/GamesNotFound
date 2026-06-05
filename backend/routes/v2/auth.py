from fastapi import APIRouter, Header
from typing import Annotated

import os
import jwt
from utils.logging import dev_log, dev_error, dev_error_database

from ..supabase_client import supabase_client
from ..supabase_client import USERS_TABLE
from ..status_message import status_success, status_fail
from .base_models import User

router = APIRouter(
    prefix="/auth"
)

# ----------------------------------------------------------------- #
#                             /signup                               #
# ----------------------------------------------------------------- #
# queries database to check if username already exists
def usernameAlreadyExists(username):
    response = supabase_client.table(USERS_TABLE).select("*").eq("username", username).execute()
    return len(response.data) > 0

# API to sign up user, returns "Success" or "Fail" with details if unsuccessful
@router.post("/signup")
async def signup(user: User):
    endpoint = "signup"

    dev_log(endpoint, "Endpoint called")
    username = user.username.upper()
    try:
        if usernameAlreadyExists(username):
            # return username already exists
            dev_log(endpoint, f"Sign up unsuccessful.  User '{username}' already exists")
            return status_fail({"details": "Username already exists"})
        else:
            # insert username and password into table, return successful sign up
            supabase_client.table(USERS_TABLE).insert({
                "username": username,
                "password": user.password
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
async def login(user: User):
    endpoint = "login"

    dev_log(endpoint, "Endpoint called")
    username = user.username.upper()
    try:
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
            if db_password == user.password:
                dev_log(endpoint, f"User '{username}' logged in")

                # create JWT token
                key = os.environ.get("JWT_SECRET_KEY")
                payload_encoded = jwt.encode({"username": username}, key, algorithm="HS256")

                return status_success({"token": payload_encoded})
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
async def auth(Authorization_header: Annotated[str | None, Header(alias="Authorization", convert_underscores=False)] = None):
    endpoint = "me"

    dev_log(endpoint, "Endpoint called")

    # decode JWT token
    key = os.environ.get("JWT_SECRET_KEY")
    try:
        token = Authorization_header.replace("Bearer ", "")
        payload_decoded = jwt.decode(token, key, algorithms="HS256")
        username = payload_decoded["username"]
        return status_success({"username": username})
    except Exception as e:
        dev_error(endpoint, e)
        return status_fail("Token could not be decoded")