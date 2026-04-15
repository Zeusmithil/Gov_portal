from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from backend import model
from backend.database import users_collection, admins_collection, suggestions_collection, steps_collection, services_collection, subservices_collection
from bson import ObjectId

# Add for JWT and email
import jwt
import os
import smtplib
import ssl
from email.message import EmailMessage
from datetime import datetime, timedelta
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI()

# 1. SETUP CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# 2. AUTHENTICATION & SECURITY ROUTES
SECRET_KEY = "unavoidable_super_secret_key"
ALGORITHM = "HS256"
security = HTTPBearer()

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def send_email(to_email: str, subject: str, content: str):
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    from_email = os.getenv("FROM_EMAIL", "no-reply@unavoidable.app")

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = from_email
    message["To"] = to_email
    message.set_content(content)

    if smtp_host and smtp_user and smtp_password:
        context = ssl.create_default_context()
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls(context=context)
            server.login(smtp_user, smtp_password)
            server.send_message(message)
    else:
        print(f"Email preview (SMTP not configured) to {to_email}:\nSubject: {subject}\n{content}")

@app.post("/api/register", response_model=model.TokenResponse)
async def register(user: model.UserRegister):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_dict = user.dict()
    user_dict["password"] = pwd_context.hash(user.password)
    result = await users_collection.insert_one(user_dict)
    
    token = create_access_token({"sub": str(result.inserted_id)})
    return {"token": token, "user": {"name": user.name, "email": user.email}}

@app.post("/api/login", response_model=model.TokenResponse)
async def login(credentials: model.UserLogin):
    user = await users_collection.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    db_password = user.get("password", "")
    is_valid = False
    
    if db_password.startswith("$2"):
        try:
            is_valid = pwd_context.verify(credentials.password, db_password)
        except Exception:
            pass
    else:
        is_valid = (credentials.password == db_password)
        
    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": str(user["_id"])})
    return {"token": token, "user": {"name": user.get("name"), "email": credentials.email}}

@app.post("/api/request-password-reset")
async def request_password_reset(request: model.PasswordResetRequest):
    # Always return success so no one can probe if an email exists.
    user = await users_collection.find_one({"email": request.email})
    if not user:
        return {"success": True, "message": "If this email exists, a reset link has been sent."}

    token_data = {
        "sub": request.email,
        "type": "password_reset",
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    reset_link = f"{frontend_url}/reset-password?token={token}"
    
    content = f"You requested a password reset. Click the link below to reset your password:\n\n{reset_link}\n\nIf you did not request this, please ignore this email."
    await send_email(request.email, "Password reset request", content)

    return {"success": True, "message": "If this email exists, a reset link has been sent."}

@app.post("/api/reset-password")
async def reset_password(payload: model.PasswordResetExecute):
    try:
        decoded = jwt.decode(payload.token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Reset token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid reset token")

    if decoded.get("type") != "password_reset":
        raise HTTPException(status_code=400, detail="Invalid reset token type")

    email = decoded.get("sub")
    if not email:
        raise HTTPException(status_code=400, detail="Invalid token payload")

    hashed_password = pwd_context.hash(payload.new_password)
    result = await users_collection.update_one(
        {"email": email},
        {"$set": {"password": hashed_password}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"success": True, "message": "Password has been reset successfully."}

@app.post("/api/admin/login")
async def admin_login(credentials: model.AdminLogin):
    admin = await admins_collection.find_one({"username": credentials.username})
    if not admin or admin.get("password") != credentials.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": credentials.username, "type": "admin"})
    return {"token": token, "user": {"username": admin["username"], "role": "admin"}}


# 3. SUGGESTIONS ROUTES
@app.post("/api/suggestions")
async def submit_suggestion(suggestion: model.SuggestionCreate):
    suggestion_dict = suggestion.dict()
    suggestion_dict["status"] = "pending"
    suggestion_dict["created_at"] = datetime.utcnow()
    
    result = await suggestions_collection.insert_one(suggestion_dict)
    return {"success": True, "id": str(result.inserted_id)}

@app.get("/api/admin/suggestions")
async def get_all_suggestions():
    # Retrieve all suggestions ordered by newest first
    cursor = suggestions_collection.find().sort("created_at", -1)
    suggestions = await cursor.to_list(length=1000)
    
    formatted = []
    for s in suggestions:
        formatted.append({
            "id": str(s["_id"]),
            "name": s.get("name"),
            "email": s.get("email"),
            "suggestions": s.get("suggestions", []),
            "status": s.get("status", "pending"),
            "created_at": s.get("created_at")
        })
    return formatted

@app.patch("/api/admin/suggestions/{suggestion_id}/status")
async def update_suggestion_status(suggestion_id: str, update: model.SuggestionUpdateStatus):
    try:
        obj_id = ObjectId(suggestion_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid suggestion ID")
        
    suggestion = await suggestions_collection.find_one({"_id": obj_id})
    if not suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")

    result = await suggestions_collection.update_one(
        {"_id": obj_id},
        {"$set": {"status": update.status}}
    )
    
    name = suggestion.get("name", "User")
    email = suggestion.get("email")
    s_list = suggestion.get("suggestions", [])
    s_text = "\\n - ".join(s_list)

    if update.status == "approved":
        email_content = f"Hello {name},\\n\\nYour suggestion has been approved and will be implemented soon!\\n\\nYour suggestion(s):\\n - {s_text}\\n\\nThank you for contributing!"
        if email:
            await send_email(email, "Your Suggestion has been Approved!", email_content)
    elif update.status == "rejected":
        reason = update.reason if update.reason else "No specific reason provided."
        email_content = f"Hello {name},\\n\\nWe appreciate your contribution, but unfortunately, your suggestion has been rejected.\\n\\nReason:\\n{reason}\\n\\nYour suggestion(s):\\n - {s_text}\\n\\nThank you for your understanding!"
        if email:
            await send_email(email, "Update on Your Suggestion", email_content)

    return {"success": True, "status": update.status}

@app.get("/api/services")
async def get_all_services():
    cursor = services_collection.find()
    services = await cursor.to_list(length=100)
    for s in services:
        s["_id"] = str(s["_id"])
    return {"success": True, "services": services}

@app.get("/api/services/{service_id}")
async def get_service(service_id: str):
    service = await services_collection.find_one({"id": service_id})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    service["_id"] = str(service["_id"])
    return {"success": True, "service": service}

@app.get("/api/subservices/{service_id}")
async def get_subservices(service_id: str):
    cursor = subservices_collection.find({"service_id": service_id})
    subservices = await cursor.to_list(length=100)
    for s in subservices:
        s["_id"] = str(s["_id"])
    return {"success": True, "subservices": subservices}

@app.get("/api/subservices/{service_id}/{subservice_id}")
async def get_subservice(service_id: str, subservice_id: str):
    subservice = await subservices_collection.find_one({
        "service_id": service_id, "subservice_id": subservice_id
    })
    if not subservice:
        raise HTTPException(status_code=404, detail="Subservice not found")
    subservice["_id"] = str(subservice["_id"])
    return {"success": True, "subservice": subservice}

@app.put("/api/admin/services")
async def update_service(data: model.ServiceModel, current_user=Depends(get_current_user)):
    data_dict = data.dict()
    await services_collection.update_one(
        {"id": data.id},
        {"$set": data_dict},
        upsert=True
    )
    return {"success": True, "message": "Service successfully updated"}

@app.put("/api/admin/subservices")
async def update_subservice(data: model.SubServiceModel, current_user=Depends(get_current_user)):
    data_dict = data.dict()
    await subservices_collection.update_one(
        {"service_id": data.service_id, "subservice_id": data.subservice_id},
        {"$set": data_dict},
        upsert=True
    )
    return {"success": True, "message": "Subservice successfully updated"}
