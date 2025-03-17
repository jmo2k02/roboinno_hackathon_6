from contextlib import asynccontextmanager
from loguru import logger
import uvicorn
from fastapi import FastAPI

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

    app = FastAPI()
    
    return app
    
app = create_app()

def run_app():
    uvicorn.run(
        "cobot.main:app",
        reload=True
    )
    
    
