# backend/main.py
import os
import shutil
from fastapi import FastAPI, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from backend import model
from backend.database import users_collection, documents_collection
# importing the database connection
app = FastAPI()
# 1. SETUP CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"], # Whitelists your React App
    allow_credentials=True,
    allow_methods=["*"], # Allows GET, POST, PUT, DELETE
    allow_headers=["*"], # Allows any kind of headers
)

# 2. AUTHENTICATION ROUTES
@app.post("/api/register", response_model=model.TokenResponse)
async def register(user: model.UserRegister):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_dict = user.dict()
    await users_collection.insert_one(user_dict)
    
    return {"token": "mock-jwt-token-here", "user": {"name": user.name, "email": user.email}}

@app.post("/api/login", response_model=model.TokenResponse)
async def login(credentials: model.UserLogin):
    user = await users_collection.find_one({"email": credentials.email, "password": credentials.password})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {"token": "mock-jwt-token-here", "user": {"name": user.get("name"), "email": credentials.email}}



@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    # Create the uploads directory if it doesn't exist
    os.makedirs("uploads", exist_ok=True)
    
    # Save the file physically
    file_location = f"uploads/{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
    
    # Store its metadata in MongoDB
    doc = {
        "filename": file.filename,
        "path": file_location,
        "size_bytes": os.path.getsize(file_location),
        "content_type": file.content_type
    }
    await documents_collection.insert_one(doc)
    doc["_id"] = str(doc["_id"])
    return {"message": "Successfully uploaded", "document": doc}

@app.post("/api/validate")
async def validate_document(file: UploadFile = File(...)):
    # Create the uploads directory if it doesn't exist
    os.makedirs("uploads", exist_ok=True)
    
    # Simulating validation based on file extension and size
    file_location = f"uploads/temp_{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
    
    size_bytes = os.path.getsize(file_location)
    os.remove(file_location)  # clean up temp file
    
    size_kb = size_bytes / 1024
    ext = file.filename.split('.')[-1].upper()
    
    return {
        "sizeValid": size_bytes <= 2 * 1024 * 1024, # 2MB limit
        "formatValid": ext in ['PDF', 'JPG', 'JPEG', 'PNG'],
        "sizeKB": f"{size_kb:.1f}",
        "format": ext
    }
