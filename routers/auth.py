from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from jwt import encode, decode
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from dotenv import load_dotenv
import os
from datetime import datetime, timezone, timedelta

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
    try:
        payload = decode(
            token,
            secret_key,
            algorithms=["HS256"]
        )
        return payload

    except ExpiredSignatureError:
        return "Token expired"

    except InvalidTokenError:
        return "Invalid token"