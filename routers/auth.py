from fastapi import APIRouter, Depends, HTTPException
from auth import hash_password, verify_password, create_access_token, verify_access_token
from sqlalchemy.orm import Session
from database import get_db
from models import UserInput, UserResponse
from database_models import User

router = APIRouter(tags=["auth"])

@router.post("/auth/signup")
def sign_up(user : UserInput, db : Session = Depends(get_db)):
    dbquery = db.query(User).filter(User.email == user.email).first()
    if dbquery:
        raise HTTPException(status_code=400, detail="email already exists")
    new_hashed_password = hash_password(user.password)
    new_user = User(email = user.email, hashed_password = new_hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    token = create_access_token(new_user.id)
    return {"access_token":token, "token_type":"bearer"}

@router.post("/auth/login")
def log_in(user : UserInput, db : Session = Depends(get_db)):
    login_email = user.email
    dbquery = db.query(User).filter(User.email == login_email).first()
    if dbquery is None:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    stored_hashed_password = dbquery.hashed_password
    verification = verify_password(user.password, stored_hashed_password)
    if verification:
        token = create_access_token(dbquery.id)
        return {"access_token":token, "token_type":"bearer"}
    else:
        raise HTTPException(status_code=400, detail="Invalid credentials")