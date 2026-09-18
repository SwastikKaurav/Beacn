from fastapi import APIRouter, Depends
from crud import get_endpoint, get_all_endpoints, create_endpoint, update_endpoint, delete_endpoint, get_kpi_stats
from database import get_db
from sqlalchemy.orm import Session
from models import EndpointInput, EndpointResponse, PingResultResponse
from database_models import Endpoint, PingResult
from auth import get_current_user
from database_models import User

router = APIRouter(prefix="/endpoints", tags=["endpoints"])

@router.get("/kpi")
def get_kpi_data(db : Session = Depends(get_db), current_user : User = Depends(get_current_user)):
    return get_kpi_stats(db, current_user.id)

@router.get("/", response_model = list[EndpointResponse])
def getAllEndpoint(db : Session = Depends(get_db), current_user : User = Depends(get_current_user)):
    return get_all_endpoints(db, current_user.id)

@router.get("/{endpoint_id}", response_model = EndpointResponse)
def getEndpoint(endpoint_id : int, db : Session = Depends(get_db), current_user : User = Depends(get_current_user)):
    return get_endpoint(db, endpoint_id, current_user.id)

@router.post("/", response_model = EndpointResponse)
def createEndpoint(endpoint_input : EndpointInput, db : Session = Depends(get_db), current_user : User = Depends(get_current_user)):
    return create_endpoint(db, endpoint_input, current_user.id)

@router.put("/{endpoint_id}", response_model = EndpointResponse)
def updateEndpoint(endpoint_input : EndpointInput, endpoint_id : int ,db : Session = Depends(get_db), current_user : User = Depends(get_current_user)):
    return update_endpoint(db, endpoint_input, endpoint_id, current_user.id)

@router.delete("/{endpoint_id}")
def deleteEndpoint(endpoint_id : int, db : Session = Depends(get_db), current_user : User = Depends(get_current_user)):
    return delete_endpoint(db, endpoint_id, current_user.id)
