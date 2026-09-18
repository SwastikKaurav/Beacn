from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from jwt import encode, decode
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from dotenv import load_dotenv
import os
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from database import get_db
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException
from database_models import User

ph = PasswordHasher()

def hash_password(password:str):
    hash = ph.hash(password)
    return hash

def verify_password(password:str,hashed_password:str):
    try:
        ph.verify(hashed_password, password)
        return True
    except VerifyMismatchError:
        return False

load_dotenv()    
secret_key = os.getenv("SECRET_KEY")

def create_access_token(user_id : int):
    payload = {"user_id" : user_id,
               "exp" : datetime.now(timezone.utc) + timedelta(minutes = 60)}

    token = encode(payload, secret_key, algorithm="HS256")
    return token

def verify_access_token(token: str):
        payload = decode(
            token,
            secret_key,
            algorithms=["HS256"]
        )
        return payload

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token : str = Depends(oauth2_scheme), db : Session = Depends(get_db)):
    try:
        payload = verify_access_token(token)

    except ExpiredSignatureError :
        raise HTTPException(status_code=401, detail="Token expired")
    except InvalidTokenError :
         raise HTTPException(status_code=401, detail="Invalid Token")

    user_id = payload["user_id"]
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="No user found")
    return user
     