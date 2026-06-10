from fastapi import APIRouter

from .root import router as router_root
from .auth import router as router_auth
from .store import router as router_store
from .library import router as router_library
from .score import router as router_score

router = APIRouter()

router.include_router(router_root, tags=["v2 - root"])
router.include_router(router_auth, tags=["v2 - auth"])
router.include_router(router_store, tags=["v2 - store"])
router.include_router(router_library, tags=["v2 - library"])
router.include_router(router_score, tags=["v2 - score"])