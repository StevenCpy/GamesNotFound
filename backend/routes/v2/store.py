from fastapi import APIRouter

from utils.logging import dev_log, dev_error_database

from ..supabase_client import supabase_client
from ..supabase_client import GAMES_TABLE
from ..status_message import status_success, status_fail

router = APIRouter()

# ----------------------------------------------------------------- #
#                             /store                                #
# ----------------------------------------------------------------- #
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
        return status_success({"data": response.data})
    except Exception as e:
        dev_error_database(endpoint, e)
        return status_fail("Database error")