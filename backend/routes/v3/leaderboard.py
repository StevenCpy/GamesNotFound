# fastAPI
from fastapi import APIRouter, Depends

# supabase
from ..supabase_client import supabase_client, SCORE_TABLE

# utils
from ..status_message import status_success, status_fail
from utils.logging import dev_log, dev_error, dev_error_database

import redis.asyncio as redis
from ..redis_client import get_redis_client
import json

router = APIRouter(
    prefix="/leaderboard"
)

# ----------------------------------------------------------------- #
#                      /leaderboard/{gameID}                        #
# ----------------------------------------------------------------- #
# API to return leaderboard for gameID
@router.get("/{gameID}")
async def show_leaderboard(gameID: int, redis_client: redis.Redis = Depends(get_redis_client)):
    endpoint = "leaderboard"
    dev_log(endpoint, "Endpoint called")

    # check Redis cache
    cache_key = f"/leaderboard/{gameID}"
    cache_value = await redis_client.get(cache_key)

    if cache_value:
        return status_success(json.loads(cache_value))

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
        exp_time_s = 60*60
        await redis_client.setex(cache_key, exp_time_s, json.dumps(response.data)) # set leaderboard in cache with TTL of 1 hour
        return status_success(response.data)
    except Exception as e:
        dev_error_database(endpoint, e)
        return status_fail("Database error")