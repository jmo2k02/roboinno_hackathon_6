from contextlib import asynccontextmanager
from loguru import logger
from fastapi import FastAPI

from cobot.api.router import router

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        # Startup code
        logger.info("Starting app")
        yield
    except Exception as e:
        # Root error handling
        msg = f"Unhandled exception: {e}"
        logger.warning(msg)
    finally:
        # Cleanup code
        logger.info("Shutting down application")

def create_app():

    app = FastAPI(
        lifespan=lifespan,
        docs_url="/api/docs",
        openapi_url="/api/openapi.json"
    )
    app.include_router(router)
    
    return app
    
app = create_app()

