from fastapi import APIRouter

from .root import router as router_root
from .auth import router as router_auth
from .store import router as router_store
from .library import router as router_library

router = APIRouter()

router.include_router(router_root)
router.include_router(router_auth)
router.include_router(router_store)
router.include_router(router_library)