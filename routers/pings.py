from fastapi import APIRouter, Depends
from database_models import PingResult, User
from crud import get_pings_of_endpoint
from sqlalchemy.orm import Session
from database import get_db
from models import PingResultResponse
from auth import get_current_user

router = APIRouter(prefix="/endpoints", tags=["pings"])

@router.get("/{endpoint_id}/pings", response_model=list[PingResultResponse])
def get_all_the_ping_results(endpoint_id : int, db : Session = Depends(get_db), current_user : User = Depends(get_current_user)):
    return get_pings_of_endpoint(db, endpoint_id, current_user.id)



