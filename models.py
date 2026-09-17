from pydantic import BaseModel
from datetime import datetime

class EndpointInput(BaseModel):
    name:str
    url:str
    ping_interval:int = 300

class EndpointResponse(BaseModel):
    model_config = {"from_attributes": True}
    id:int
    name:str
    url:str
    ping_interval:int

class PingResultResponse(BaseModel):
    model_config = {"from_attributes": True}
    id:int
    endpoint_id:int
    status_code:int | None
    response_time:float | None
    checked_at:datetime

class UserInput(BaseModel):
    email:str
    password:str

class UserResponse(BaseModel):
    model_config = {"from_attributes": True}
    id:int
    email:str
    created_at:datetime
