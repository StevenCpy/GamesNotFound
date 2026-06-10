# fastAPI
from fastapi import APIRouter

# utils
from utils.logging import dev_log
from ..status_message import status_success

router = APIRouter()

# ----------------------------------------------------------------- #
#                               root                                #
# ----------------------------------------------------------------- #
# Allow pinging server
@router.api_route("/", methods=["GET", "HEAD"])
async def root():
    endpoint = "root"
    dev_log(endpoint, "Endpoint called")

    return status_success()