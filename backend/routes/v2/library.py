from fastapi import APIRouter

from datetime import datetime, timezone
from utils.logging import dev_log, dev_error_database

from ..supabase_client import supabase_client
from ..supabase_client import LIBRARY_TABLE
from ..status_message import status_success, status_fail

router = APIRouter(
    prefix="/library"
)

# ----------------------------------------------------------------- #
#                             /library                              #
# ----------------------------------------------------------------- #
# API to return user's list of library games
@router.get("/{username}")
async def library(username: str):
    endpoint = "library"

    dev_log(endpoint, "Endpoint called")
    username = username.upper()
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
@router.post("/{username}/{gameID}")
async def addToLibrary(username: str, gameID: int):
    endpoint = "addToLibrary"

    dev_log(endpoint, "Endpoint called")
    username = username.upper()
    added_at = datetime.now(timezone.utc).isoformat()
    try:
        response = supabase_client.table(LIBRARY_TABLE).insert({
            "username": username,
            "gameID": gameID,
            "added_at": added_at
        }).execute()
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
@router.delete("/{username}/{gameID}")
async def removeFromLibrary(username: str, gameID: int):
    endpoint = "removeFromLibrary"

    dev_log(endpoint, "Endpoint called")
    username = username.upper()
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