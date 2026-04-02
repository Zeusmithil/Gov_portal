# backend/models.py
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any

# --- Authentication Models ---
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRegister(BaseModel): #React sends login/register data to your backend. We create blueprints for those specific network requests.
    name: str
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    token: str
    user: dict

# --- Service Models ---
#Service Models (Replicating your MOCK_SERVICES)
#In your api.js, a Service has nested arrays. For example, it has an array of docs and an array of steps. Pydantic handles this by putting "Models inside of Models".
class DocumentReq(BaseModel):
    name: str
    format: str
    size: str

class ServiceStep(BaseModel):
    title: str
    desc: str

#Once the smaller pieces are defined, we assemble them into the main Service Model.
class ServiceBase(BaseModel):
    id: str           # e.g., 'aadhaar'
    icon: str
    title: str
    subtitle: str
    time: str
    fee: str
    portalLink: str
    portalName: str
    docs: List[DocumentReq]
    steps: List[ServiceStep] = []

class SubServiceBase(BaseModel):
    title: str
    steps: List[ServiceStep]
    docs: List[DocumentReq]
    portalLink: str
    portalName: str
