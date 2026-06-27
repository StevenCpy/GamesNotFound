# fastAPI
from fastapi import APIRouter, Response, Cookie
from pydantic import BaseModel
from typing import Annotated

import time
from datetime import datetime, timezone

# supabase
from ..supabase_client import supabase_client, USERS_TABLE

# utils
from ..status_message import status_success, status_fail
from utils.logging import dev_log, dev_error, dev_error_database
from utils.encryption.jwt_encryption import encode_HS256, decode_payload_HS256
from utils.encryption.password_encryption import hash_password, check_password

from .config import API_VERSION

router = APIRouter(
    prefix="/auth"
)

COOKIE_SETTINGS = {
    "path": f"/api/{API_VERSION}",
    "secure": True,
    "httponly": True,
    "samesite": "none"
}

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

    username = auth.username.lower()
    try:
        if usernameAlreadyExists(username):
            # return username already exists
            dev_log(endpoint, f"Sign up unsuccessful.  User '{username}' already exists")
            return status_fail("Username already exists")
        else:
            # insert username and password into table
            supabase_client.table(USERS_TABLE).insert({
                "username": username,
                "password_hash_str": hash_password(auth.password).decode('utf-8')
            }).execute()

            dev_log(endpoint, f"User '{username}' signed up")
            return status_success(None)
    except Exception as e:
        dev_error_database(endpoint, e)
        return status_fail("Database error")

# ----------------------------------------------------------------- #
#                              /login                               #
# ----------------------------------------------------------------- #
# API to authenticate user, returns "Success" or "Fail" with details if unsuccessful
@router.post("/login")
async def login(auth: Auth, response: Response):
    endpoint = "login"
    dev_log(endpoint, "Endpoint called")

    username = auth.username.lower()
    try:
        # query database for user's actual password
        db_response = (
            supabase_client.table(USERS_TABLE)
            .select("password_hash_str,profile_pic_url,created_at")
            .eq("username",username)
            .execute()
        )
        # if user exists in database
        if len(db_response.data):
            db_password_hash = db_response.data[0]["password_hash_str"].encode('utf-8')
            # if password matches the one in database
            if check_password(db_password_hash, auth.password):
                dev_log(endpoint, f"User '{username}' logged in")

                # encode payload
                payload = {"username": username,
                           "profile_pic_url": db_response.data[0]["profile_pic_url"],
                           "created_at": db_response.data[0]["created_at"],
                           "temp": False}
                token = encode_HS256(payload)

                response.set_cookie(
                    key="auth_token",
                    value=token,
                    max_age=60*60*24*7, # in seconds
                    **COOKIE_SETTINGS
                )

                return status_success({"user_info": payload})
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
async def auth(auth_token: Annotated[str|None, Cookie()] = None):
    endpoint = "me"
    dev_log(endpoint, "Endpoint called")

    try:
        # decode payload
        payload = decode_payload_HS256(auth_token)
        return status_success({"user_info": payload})
    except Exception as e:
        dev_error(endpoint, e)
        return status_fail("Token could not be decoded")
    
# ----------------------------------------------------------------- #
#                             /logout                               #
# ----------------------------------------------------------------- #
# API to log out user
@router.post("/logout")
async def logout(response: Response, auth_token: Annotated[str|None, Cookie()] = None):
    endpoint = "logout"
    dev_log(endpoint, "Endpoint called")

    try:
        if auth_token:
            # decode payload
            payload = decode_payload_HS256(auth_token)
            random_username = payload["username"]
    except Exception as e:
        dev_error(endpoint, e)
        return status_fail("Token could not be decoded")
    
    # if temporary account, delete user
    try:
        if (auth_token and payload["temp"]):
            supabase_client.table(USERS_TABLE).delete().eq(
                "username", random_username
            ).execute()
    except Exception as e:
        dev_error_database(endpoint, e)
        return status_fail("Database error")
        
    response.delete_cookie(
        key="auth_token",
        **COOKIE_SETTINGS
    )

    return status_success(None)
    
# ----------------------------------------------------------------- #
#                           /quicksignup                            #
# ----------------------------------------------------------------- #
# API to sign up user temporarily, account is deleted on log out
@router.post("/quick-signup")
async def quick_signup(response: Response):
    endpoint = "quick-signup"
    dev_log(endpoint, "Endpoint called")

    random_username = f"user#{int(time.time()*1000)}"
    random_password = ""

    try:
        # insert username and password into table
        supabase_client.table(USERS_TABLE).insert({
            "username": random_username,
            "password_hash_str": hash_password(random_password).decode('utf-8')
        }).execute()

        dev_log(endpoint, f"User '{random_username}' signed up")
    except Exception as e:
        dev_error_database(endpoint, e)
        return status_fail("Database error")
    
    dev_log(endpoint, f"User '{random_username}' logged in")

    # encode payload
    payload = {"username": random_username,
                "profile_pic_url": None,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "temp": True} # account should be deleted on log out
    token = encode_HS256(payload)

    response.set_cookie(
        key="auth_token",
        value=token,
        max_age=60*60*24*7, # in seconds
        **COOKIE_SETTINGS
    )

    return status_success({"user_info": payload})