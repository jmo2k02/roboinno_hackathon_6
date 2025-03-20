from typing import Annotated
import uvicorn
import asyncio
from fastapi import FastAPI, UploadFile, File
import os
from swift import Swift

from getPreview import getPreview, getPreviewIn2DPlain

app = FastAPI(
    docs_url="/api/docs"
)

# Define the directory where you want to save files
UPLOAD_FOLDER = "uploads"

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.post("/get_preview", response_model=dict)
async def get_preview(svg_file: Annotated[UploadFile, File(description="SVG file to upload for execution by robo simulation")]):
    file_path = os.path.join(UPLOAD_FOLDER, svg_file.filename)
    
    # Read and save the uploaded file
    with open(file_path, "wb") as f:
        f.write(await svg_file.read())

    msg = f"Using file at {file_path}"
    print(msg)

    # Call the preview function (assuming it takes the file path)
    # await asyncio.to_thread(getPreview, file_path)
    await asyncio.to_thread(getPreviewIn2DPlain, file_path, 'panda')

    return {"message": "File uploaded successfully", "file_path": file_path}


if __name__ == "__main__":
    # Use swift for visualistion 

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001
    )