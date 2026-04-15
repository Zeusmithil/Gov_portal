from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any

# --- Authentication Models ---
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetExecute(BaseModel):
    token: str
    new_password: str

class TokenResponse(BaseModel):
    token: str
    user: dict

class AdminLogin(BaseModel):
    username: str
    password: str

# --- Suggestion Models ---
class SuggestionCreate(BaseModel):
    name: str
    email: EmailStr
    suggestions: List[str]

class SuggestionUpdateStatus(BaseModel):
    status: str
    reason: Optional[str] = None

# --- Platform Steps Models ---
class StepItem(BaseModel):
    title: str
    desc: str

class ServiceSteps(BaseModel):
    service_id: str
    subservice_id: str
    steps: List[StepItem]

class DocItem(BaseModel):
    name: str
    format: str
    size: str

class ServiceModel(BaseModel):
    id: str
    title: str
    subtitle: str
    icon: str
    time: str
    fee: str
    portalName: str
    portalLink: str
    steps: List[StepItem]
    docs: List[DocItem]

class SubServiceModel(BaseModel):
    service_id: str
    subservice_id: str
    title: str
    portalName: str
    portalLink: str
    steps: List[StepItem]
    docs: List[DocItem]
