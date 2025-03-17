from fastapi import APIRouter, Depends

from cobot.auth.deps import validate_token

from cobot.api.v1.svg import router as svg_router
from cobot.api.v1.robot import router as robo_router
from cobot.api.v1.gpt import router as gpt_router

router = APIRouter(dependencies=[Depends(validate_token)])

v1_router = APIRouter(prefix="/api/v1")

v1_router.include_router(router=svg_router, prefix="/svg", tags=["svg"])

v1_router.include_router(router=robo_router, prefix="/robot", tags=["robot"])

v1_router.include_router(router=gpt_router, prefix="/gpt", tags=["gpt"])

router.include_router(v1_router)
