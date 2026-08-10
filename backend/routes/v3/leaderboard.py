# fastAPI
from fastapi import APIRouter

# supabase
from ..supabase_client import supabase_client, SCORE_TABLE

# utils
from ..status_message import status_success, status_fail
from utils.logging import dev_log, dev_error, dev_error_database

router = APIRouter(
    prefix="/leaderboard"
)

# ----------------------------------------------------------------- #
#                      /leaderboard/{gameID}                        #
# ----------------------------------------------------------------- #
# API to return games high scores
@router.get("/{gameID}")
async def show_leaderboard(gameID: int):
    endpoint = "leaderboard"
    dev_log(endpoint, "Endpoint called")

    # query database for TOP 5 high scores
    try:
        response = (
            supabase_client.table(SCORE_TABLE)
            .select("username,gameID,high_score")
            .eq("gameID", gameID)
            .order("high_score", desc=True)
            .limit(5)
            .execute()
        )
        dev_log(endpoint, f"Top 5 High scores for '{gameID}' fetched from database")
        return status_success(response.data)
    except Exception as e:
        dev_error_database(endpoint, e)
        return status_fail("Database error")