# fastAPI
from fastapi import APIRouter, Header
from pydantic import BaseModel
from typing import Annotated

# supabase
from ..supabase_client import supabase_client, SCORE_TABLE

# other libraries
from datetime import datetime, timezone

# utils
from utils.logging import dev_log, dev_error, dev_error_database
from ..status_message import status_success, status_fail
from .utils import decode_payload_HS256

router = APIRouter(
    prefix="/score"
)

# ----------------------------------------------------------------- #
#                            BASE MODELS                            #
# ----------------------------------------------------------------- #
class Score(BaseModel):
    gameID: int
    score: int

# ----------------------------------------------------------------- #
#                           /highscores                             #
# ----------------------------------------------------------------- #
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

# ----------------------------------------------------------------- #
#                         /updateHighscore                          #
# ----------------------------------------------------------------- #
# API to update game high score
@router.post("/")
async def updateHighscore(score: Score, Authorization: Annotated[str|None, Header()] = None):
    endpoint = "updateHighscore"
    dev_log(endpoint, "Endpoint called")

    # authenticate user using JWT token
    try:
        username = decode_payload_HS256(Authorization)["username"].upper()
        dev_log(endpoint, f"'{username}' was extracted from token")
    except Exception as e:
        dev_error(endpoint, e)
        return status_fail("Token could not be decoded")
    
    # query database for game high score
    try:
        response = (
            supabase_client.table(SCORE_TABLE)
            .select("high_score")
            .match({
                "username": username,
                "gameID": score.gameID
            })
            .execute()
        )
        dev_log(endpoint, f"High score for username: '{username}' and gameID: '{score.gameID}' fetched from database")
    except Exception as e:
        dev_error_database(endpoint, e)
        return status_fail("Database error")
    
    last_played = datetime.now(timezone.utc).isoformat()

    # high score does not exist
    if (len(response.data) == 0):
        # add high score to database
        try:
            response = (
                supabase_client.table(SCORE_TABLE)
                .insert({
                    "username": username,
                    "gameID": score.gameID,
                    "high_score": score.score,
                    "last_played": last_played
                })
                .select("high_score,last_played")
                .execute()
            )
            dev_log(endpoint, f"High score added for username: '{username}', gameID: '{score.gameID}'")
            return status_success({"details": "Updated first high score for game", "data": response.data[0]})
        except Exception as e:
            dev_error_database(endpoint, e)
            return status_fail("Database error")
    # high score exists
    else:
        highscore = response.data[0]["high_score"]

        # score <= highscore
        if score.score <= highscore:
            try:
                # update last_played on database
                response = (
                    supabase_client.table(SCORE_TABLE)
                    .update({
                        "last_played": last_played
                    })
                    .match({
                        "username": username,
                        "gameID": score.gameID
                    })
                    .select("high_score,last_played")
                    .execute()
                )
                dev_log(endpoint, f"Score for username: '{username}', gameID: '{score.gameID}' was less than high score")
                return status_success({"details": "Score was less than high score", "data": response.data[0]})
            except Exception as e:
                dev_error_database(endpoint, e)
                return status_fail("Database error")
            
        # score > highscore
        else:
            # update high score, last_played on database
            try:
                response = (
                    supabase_client.table(SCORE_TABLE)
                    .update({
                        "high_score": score.score,
                        "last_played": last_played
                    })
                    .match({
                        "username": username,
                        "gameID": score.gameID
                    })
                    .select("high_score,last_played")
                    .execute()
                )
                dev_log(endpoint, f"High score updated for username: '{username}', gameID: '{score.gameID}'")
                return status_success({"details": "High score was updated", "data": response.data[0]})
            except Exception as e:
                dev_error_database(endpoint, e)
                return status_fail("Database error")