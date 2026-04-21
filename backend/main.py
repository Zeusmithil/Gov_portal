from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from backend import model
from backend.database import (
    users_collection, admins_collection, suggestions_collection, 
    steps_collection, services_collection, subservices_collection,
    reset_tokens_collection, admin_logs_collection
)
from backend import email_templates
from bson import ObjectId
import secrets


# Add for JWT and email
import jwt
import os
import smtplib
import ssl
from email.message import EmailMessage
from datetime import datetime, timedelta
from passlib.context import CryptContext
import logging

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
 #put this in the config.py

# 2. AUTHENTICATION & SECURITY ROUTES
SECRET_KEY = "unavoidable_super_secret_key"
ALGORITHM = "HS256"
security = HTTPBearer()#put this in the env file

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
            raise HTTPException(status_code=401, detail="Invalid token: Missing user ID")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired: Please log in again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token: Unable to decode.")

async def send_email(to_email: str, subject: str, content: str, html_content: str = None):
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
    
    if html_content:
        message.add_alternative(html_content, subtype='html')
    else:
        # Fallback to simple HTML if not provided
        message.add_alternative(f"""
        <!DOCTYPE html>
        <html>
            <body>
                <p>{content.replace('\n', '<br>')}</p>
            </body>
        </html>
        """, subtype='html')

    try:
        # Use unverified context to avoid [SSL: CERTIFICATE_VERIFY_FAILED] on macOS/local dev
        context = ssl._create_unverified_context()
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls(context=context)
            server.login(smtp_user, smtp_password)
            server.send_message(message)
            print(f"✅ Email sent successfully to {to_email}!") 
    except Exception as e:
        print(f"❌ Email sending failed for {to_email}:", e)
        raise e # Re-raise to handle in calling functions
        
@app.post("/api/register", response_model=model.TokenResponse)
async def register(user: model.UserRegister):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered. Please use a different email or log in.")
    
    user_dict = user.dict()
    user_dict["password"] = pwd_context.hash(user.password)
    result = await users_collection.insert_one(user_dict)
    
    token = create_access_token({"sub": str(result.inserted_id)})
    return {"token": token, "user": {"name": user.name, "email": user.email}}

@app.post("/api/login", response_model=model.TokenResponse)
async def login(credentials: model.UserLogin):
    user = await users_collection.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials. Please check your email and password.")
    
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
        raise HTTPException(status_code=401, detail="Invalid credentials. Please try again.")
    
    token = create_access_token({"sub": str(user["_id"])})
    return {"token": token, "user": {"name": user.get("name"), "email": credentials.email}}

@app.post("/api/request-password-reset")
async def request_password_reset(request: model.PasswordResetRequest):
    user = await users_collection.find_one({"email": request.email})
    if not user:
        # Return success to prevent email probing, but don't send anything
        return {"success": True, "message": "If this email exists, a reset link has been sent."}
    
    # Generate a random secure token
    token = secrets.token_urlsafe(32)
    expiry = datetime.utcnow() + timedelta(minutes=30)
    
    # Store token in database
    await reset_tokens_collection.delete_many({"email": request.email}) # Clear old tokens
    await reset_tokens_collection.insert_one({
        "email": request.email,
        "token": token,
        "expiry": expiry,
        "used": False
    })

    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    reset_link = f"{frontend_url}/reset-password?token={token}"

    html_content = email_templates.get_password_reset_template(reset_link)
    text_content = f"You requested a password reset. Click the link below to reset your password:\n\n{reset_link}\n\nThis link is valid for 30 minutes."

    try:
        await send_email(request.email, "Password Reset Request", text_content, html_content)
        print(f"✅ Password reset email sent to {request.email}")
    except Exception as e:
        print(f"❌ Failed to send password reset email to {request.email}: {e}")
        # Even if email fails, we return success to prevent probing, but maybe log it internally
        
    return {"success": True, "message": "If this email exists, a reset link has been sent."}

@app.post("/api/reset-password")
async def reset_password(payload: model.PasswordResetExecute):
    # Find token in database
    token_record = await reset_tokens_collection.find_one({"token": payload.token})
    
    if not token_record:
        raise HTTPException(status_code=401, detail="Invalid reset link")
    
    if token_record.get("used"):
        raise HTTPException(status_code=401, detail="This reset link has already been used")
        
    if datetime.utcnow() > token_record["expiry"]:
        raise HTTPException(status_code=401, detail="Reset link has expired")

    email = token_record["email"]
    hashed_password = pwd_context.hash(payload.new_password)
    
    result = await users_collection.update_one(
        {"email": email},
        {"$set": {"password": hashed_password}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    # Invalidate token
    await reset_tokens_collection.update_one(
        {"token": payload.token},
        {"$set": {"used": True}}
    )

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
async def update_suggestion_status(suggestion_id: str, update: model.SuggestionUpdateStatus, admin_user=Depends(get_current_user)):
    try:
        obj_id = ObjectId(suggestion_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid suggestion ID")
        
    suggestion = await suggestions_collection.find_one({"_id": obj_id})
    if not suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")

    await suggestions_collection.update_one(
        {"_id": obj_id},
        {"$set": {"status": update.status}}
    )
    
    await log_admin_action(f"update_suggestion_{update.status}", {"suggestion_id": suggestion_id})

    name = suggestion.get("name", "User")
    email = suggestion.get("email")
    s_list = suggestion.get("suggestions", [])
    s_text = "".join([f"<li>{s}</li>" for s in s_list])
    s_text_plain = "\n- ".join(s_list)

    if update.status == "approved":
        subject = "Your Suggestion Has Been Accepted!"
        html_content = email_templates.get_suggestion_approved_template(name, f"<ul>{s_text}</ul>")
        text_content = f"Hello {name},\n\nYour suggestion has been approved!\n\nSuggestions:\n{s_text_plain}\n\nBest regards, Team Unavoidable"
    elif update.status == "rejected":
        subject = "Update on Your Suggestion"
        reason = update.reason or "No specific reason provided."
        html_content = email_templates.get_suggestion_rejected_template(name, f"<ul>{s_text}</ul>", reason)
        text_content = f"Hello {name},\n\nYour suggestion was not approved at this time.\n\nReason: {reason}\n\nSuggestions:\n{s_text_plain}\n\nBest regards, Team Unavoidable"
    else:
        return {"success": True, "status": update.status}

    try:
        if email:
            await send_email(email, subject, text_content, html_content)
        else:
            print(f"No email provided for suggestion {suggestion_id}.")
    except Exception as e:
        print(f"Failed to send email to {email} for suggestion {suggestion_id}: {e}")

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

@app.get("/api/steps/{service_id}/{subservice_id}")
async def get_steps(service_id: str, subservice_id: str):
    record = await subservices_collection.find_one({"service_id": service_id, "subservice_id": subservice_id})
    if not record:
        return {"success": True, "steps": None}
    return {"success": True, "steps": record.get("steps", [])}

@app.put("/api/admin/steps")
async def update_steps(data: model.ServiceSteps, current_user=Depends(get_current_user)):
    data_dict = data.dict()
    await subservices_collection.update_one(
        {"service_id": data.service_id, "subservice_id": data.subservice_id},
        {"$set": {"steps": data_dict["steps"]}}
    )
    return {"success": True, "message": "Steps successfully updated"}

# Admin action logging
logging.basicConfig(
    filename="admin_actions.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

async def log_admin_action(action: str, details: dict):
    log_entry = {
        "action": action,
        "details": details,
        "timestamp": datetime.utcnow()
    }
    # Log to file
    logging.info(f"Action: {action}, Details: {details}")
    # Log to MongoDB
    await admin_logs_collection.insert_one(log_entry)

@app.post("/api/admin/approve-suggestion")
async def approve_suggestion(suggestion_id: str, admin_user=Depends(get_current_user)):
    try:
        obj_id = ObjectId(suggestion_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid suggestion ID")

    suggestion = await suggestions_collection.find_one({"_id": obj_id})
    if not suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")

    # Delegate to update_suggestion_status for consistency and email sending
    update = model.SuggestionUpdateStatus(status="approved")
    return await update_suggestion_status(suggestion_id, update, admin_user)
