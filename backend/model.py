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

class TokenResponse(BaseModel):
    token: str
    user: dict

# --- Service Models ---
class DocumentReq(BaseModel):
    name: str
    format: str
    size: str

