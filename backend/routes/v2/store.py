# fastAPI
from fastapi import APIRouter

# supabase
from ..supabase_client import supabase_client, GAMES_TABLE

# utils
from utils.logging import dev_log, dev_error_database
from ..status_message import status_success, status_fail

router = APIRouter(
    prefix="/store"
)

# ----------------------------------------------------------------- #
#                             /store                                #
# ----------------------------------------------------------------- #
# API to return all games in the store
@router.get("/")
async def store():
    endpoint = "store"
    dev_log(endpoint, "Endpoint called")

    # query database for store games
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