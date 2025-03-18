from contextlib import asynccontextmanager
from loguru import logger
from fastapi import FastAPI
from cobot.api.v1.svg import router as svg_router

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
        lifespan=lifespan
    )
    app.include_router(svg_router)
    
    return app
    
app = create_app()

