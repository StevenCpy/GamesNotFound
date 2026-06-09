# fastAPI
from fastapi import APIRouter, Header
from typing import Annotated

# supabase
from ..supabase_client import supabase_client, LIBRARY_TABLE

# other libraries
from datetime import datetime, timezone

# utils
from utils.logging import dev_log, dev_error, dev_error_database
from ..status_message import status_success, status_fail
from .utils import decode_payload_HS256

router = APIRouter(
    prefix="/library"
)

# ----------------------------------------------------------------- #
#                             /library                              #
# ----------------------------------------------------------------- #
# API to return user's list of library games
@router.get("/")
async def library(Authorization: Annotated[str|None, Header()] = None):
    endpoint = "library"
    dev_log(endpoint, "Endpoint called")

    # authenticate user using JWT token
    try:
        username = decode_payload_HS256(Authorization)["username"].upper()
        dev_log(endpoint, f"'{username}' was extracted from token")
    except Exception as e:
        dev_error(endpoint, e)
        return status_fail("Token could not be decoded")
    
    # query database for user's library games
    try:
        response = (
            supabase_client.table(LIBRARY_TABLE)
            .select("gameID,added_at")
            .eq("username", username)
            .order("added_at", desc=False)
            .execute()
        )
        dev_log(endpoint, f"Library for '{username}' fetched from database")
        return status_success({"data": response.data})
    except Exception as e:
        dev_error_database(endpoint, e)
        return status_fail("Database error")

# ----------------------------------------------------------------- #
#                          /addToLibrary                            #
# ----------------------------------------------------------------- #
# API to add game to user's library
@router.post("/{gameID}")
async def addToLibrary(gameID: int, Authorization: Annotated[str|None, Header()] = None):
    endpoint = "addToLibrary"
    dev_log(endpoint, "Endpoint called")

    # authenticate user using JWT token
    try:
        username = decode_payload_HS256(Authorization)["username"].upper()
        dev_log(endpoint, f"'{username}' was extracted from token")
    except Exception as e:
        dev_error(endpoint, e)
        return status_fail("Token could not be decoded")
    
    # add game to user's library
    added_at = datetime.now(timezone.utc).isoformat()
    try:
        response = (
            supabase_client.table(LIBRARY_TABLE)
            .insert({
                "username": username,
                "gameID": gameID,
                "added_at": added_at
            })
            .select("gameID,added_at")
            .execute()
        )
        game_added = {k:v for k,v in response.data[0].items() if k != "username"} # remove username field from response
        dev_log(endpoint, f"Game ID {gameID} added to {username}'s library")
        return status_success({"data": game_added})
    except Exception as e:
        dev_error_database(endpoint, e)
        return status_fail("Database error")

# ----------------------------------------------------------------- #
#                        /removeFromLibrary                         #
# ----------------------------------------------------------------- #
# API to remove game from user's library
@router.delete("/{gameID}")
async def removeFromLibrary(gameID: int, Authorization: Annotated[str|None, Header()] = None):
    endpoint = "removeFromLibrary"
    dev_log(endpoint, "Endpoint called")

    # authenticate user using JWT token
    try:
        username = decode_payload_HS256(Authorization)["username"].upper()
        dev_log(endpoint, f"'{username}' was extracted from token")
    except Exception as e:
        dev_error(endpoint, e)
        return status_fail("Token could not be decoded")

    # remove game from user's library
    try:
        supabase_client.table(LIBRARY_TABLE).delete().match({
            "username": username,
            "gameID": gameID
        }).execute()
        dev_log(endpoint, f"Game ID {gameID} removed from {username}'s library")
        return status_success()
    except Exception as e:
        dev_error_database(endpoint, e)
        return status_fail("Database error")