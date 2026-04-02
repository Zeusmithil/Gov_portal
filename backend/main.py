# backend/main.py
import os
import shutil
from fastapi import FastAPI, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import model #importing the file u just created
from database import users_collection, services_collection, subservices_collection, documents_collection
# importing the database connection
app = FastAPI()

# 1. SETUP CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # Whitelists your React App
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

# 3. SERVICES ROUTES
@app.get("/api/services")
async def get_services():
    
    # 1. Reach into MongoDB and grab up to 100 services
    services = await services_collection.find().to_list(100)
    
    # 2. MongoDB assigns a unique, weirdly-formatted ID called ObjectId("_id") to everything.
    #    React doesn't understand ObjectId. So we loop through the data and convert 
    #    those ObjectIds into standard Strings before returning them.
    for s in services:
        s["_id"] = str(s["_id"])
    return services

@app.get("/api/services/{service_id}")
async def get_service(service_id: str):
    service = await services_collection.find_one({"id": service_id})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    service["_id"] = str(service["_id"])
    return service

@app.get("/api/services/{service_id}/subservices/{sub_id}")
async def get_subservice(service_id: str, sub_id: str):
    sub = await subservices_collection.find_one({"serviceId": service_id, "subServiceId": sub_id})
    if not sub:
        raise HTTPException(status_code=404, detail="Subservice not found")
    sub["_id"] = str(sub["_id"])
    return sub

@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
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
