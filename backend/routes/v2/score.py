from fastapi import APIRouter, Header
from typing import Annotated

from utils.logging import dev_log, dev_error, dev_error_database

from ..supabase_client import supabase_client
from ..supabase_client import SCORE_TABLE
from ..status_message import status_success, status_fail
from .utils import decode_payload_HS256

router = APIRouter(
    prefix="/score"
)

# API to return games high scores
@router.get("/highscores")
async def highscores(Authorization: Annotated[str|None, Header()] = None):
    endpoint = "highscores"
    dev_log(endpoint, "Endpoint called")

    # authenticate user using JWT token
    try:
        username = decode_payload_HS256(Authorization)["username"].upper()
        dev_log(endpoint, f"'{username}' was extracted from token")
    except Exception as e:
        dev_error(endpoint, e)
        return status_fail("Token could not be decoded")

    # query database for games high scores
    try:
        response = (
            supabase_client.table(SCORE_TABLE)
            .select("gameID,high_score,last_played")
            .eq("username", username)
            .execute()
        )
        dev_log(endpoint, f"High scores for '{username}' fetched from database")
        return status_success({"data": response.data})
    except Exception as e:
        dev_error_database(endpoint, e)
        return status_fail("Database error")