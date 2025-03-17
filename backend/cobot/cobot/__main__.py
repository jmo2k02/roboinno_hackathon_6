import uvicorn

def run_app():
    uvicorn.run(
        "cobot.main:app",
        reload=True,
        host="0.0.0.0",
    )
    
    
if __name__ == "__main__":
    run_app()