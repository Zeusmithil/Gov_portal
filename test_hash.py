import sys
from pydantic import BaseModel
class UserRegister(BaseModel):
    name: str
    password: str

user = UserRegister(name="Test", password="pwd")
user_dict = user.dict()

try:
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    user_dict["password"] = pwd_context.hash(user.password)
    print("Hash successful:", user_dict["password"])
except Exception as e:
    print("Error:", e)
