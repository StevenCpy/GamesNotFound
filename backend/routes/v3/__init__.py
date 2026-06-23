from fastapi import APIRouter

from .root import router as router_root
from .auth import router as router_auth
from .store import router as router_store
from .library import router as router_library
from .score import router as router_score

from .config import API_VERSION

router = APIRouter()

router.include_router(router_root, tags=[f"{API_VERSION} - root"])
router.include_router(router_auth, tags=[f"{API_VERSION} - auth"])
router.include_router(router_store, tags=[f"{API_VERSION} - store"])
router.include_router(router_library, tags=[f"{API_VERSION} - library"])
router.include_router(router_score, tags=[f"{API_VERSION} - score"])