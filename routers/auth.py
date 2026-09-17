from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

ph = PasswordHasher()

def hash_password(password:str):
    hash = ph.hash(password)
    return hash

def verify_password(password:str,hashed_password:str):
    try:
        is_verified = ph.verify(hashed_password, password)
        return True
    except VerifyMismatchError:
        return False