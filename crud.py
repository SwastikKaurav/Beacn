from database_models import Endpoint, PingResult
from database import SessionLocal
from sqlalchemy.orm import Session
from models import EndpointInput, EndpointResponse, PingResultResponse
from fastapi import HTTPException, APIRouter
from datetime import datetime
from sqlalchemy import func, and_
from email_utils import send_email

def get_all_endpoints_worker(db : Session):
    db_endpoints = db.query(Endpoint).all()
    return db_endpoints

def get_endpoint(db : Session, id : int, user_id : int):
    db_endpoint_response = db.query(Endpoint).filter(Endpoint.id == id, Endpoint.user_id == user_id).first()
    if db_endpoint_response is None:
        raise HTTPException(status_code=404, detail="Id not found")
    return db_endpoint_response

def get_all_endpoints(db : Session, user_id : int):
    db_endpoints = db.query(Endpoint).filter(Endpoint.user_id == user_id).all()
    return db_endpoints

def create_endpoint(db : Session, endpointInput : EndpointInput, user_id : int):
    new_endpoint = Endpoint(name = endpointInput.name, url = endpointInput.url, ping_interval = endpointInput.ping_interval, user_id = user_id)
    db.add(new_endpoint)
    db.commit()
    db.refresh(new_endpoint)
    return new_endpoint

def update_endpoint(db : Session, endpointInput : EndpointInput, id : int, user_id : int):
    db_endpoint = db.query(Endpoint).filter(Endpoint.id == id, Endpoint.user_id == user_id).first()
    if db_endpoint is None:
        raise HTTPException(status_code=404, detail="Endpoint not found")
    db_endpoint.name = endpointInput.name
    db_endpoint.url = endpointInput.url
    db_endpoint.ping_interval = endpointInput.ping_interval
    db.add(db_endpoint)
    db.commit()
    db.refresh(db_endpoint)
    return db_endpoint

def delete_endpoint(db : Session, endpoint_id : int, user_id : int):
    db_endpoint = db.query(Endpoint).filter(Endpoint.id == endpoint_id, Endpoint.user_id == user_id).first()
    if db_endpoint is None:
        raise HTTPException(status_code=404, detail="Endpoint not found")
    db.delete(db_endpoint)
    db.commit()
    return {"status_code" : 204, "detail" : "No Content"}

def create_ping_result(db: Session, id: int, status_code: int, response_time: float, checked_at: datetime):
    db_ping_result = PingResult(endpoint_id = id, status_code = status_code, response_time = response_time, checked_at = checked_at)
    db.add(db_ping_result)
    db.commit()
    db.refresh(db_ping_result)
    return db_ping_result

def get_pings_of_endpoint(db : Session, endpoint_id : int, user_id : int):
    db_ping_result =  db.query(PingResult).join(Endpoint).filter(PingResult.endpoint_id == endpoint_id, Endpoint.user_id == user_id).order_by(PingResult.checked_at).all()
    return db_ping_result

def get_latest_ping_per_endpoints(db : Session, user_id : int):
    subquery = db.query(PingResult.endpoint_id, func.max(PingResult.checked_at).label("latest_time")).join(Endpoint, PingResult.endpoint_id == Endpoint.id).filter(Endpoint.user_id == user_id).group_by(PingResult.endpoint_id).subquery()
    latest_pings = db.query(PingResult).join(subquery, and_(PingResult.endpoint_id == subquery.c.endpoint_id, PingResult.checked_at == subquery.c.latest_time)).all()
    return latest_pings

def get_incidents_count(db : Session, user_id : int):
    pings = get_latest_ping_per_endpoints(db, user_id)
    count = 0
    for i in pings:
        if(i.status_code > 299 or i.status_code <200):
            count = count + 1
    return count

def get_uptime_percentage(db : Session, user_id : int):
    total_count = db.query(func.count(PingResult.id)).join(Endpoint, PingResult.endpoint_id == Endpoint.id).filter(Endpoint.user_id == user_id).scalar()
    successful_pings_count = db.query(func.count(PingResult.id)).join(Endpoint, PingResult.endpoint_id == Endpoint.id).filter(PingResult.status_code.between(200,299), Endpoint.user_id == user_id).scalar()
    if total_count == 0:
        return 0
    uptime_percent = (successful_pings_count / total_count) * 100
    return uptime_percent

def get_avg_response_time(db : Session, user_id : int):
    avg_response_time = db.query(func.avg(PingResult.response_time)).join(Endpoint, PingResult.endpoint_id == Endpoint.id).filter(Endpoint.user_id == user_id).scalar()
    if avg_response_time is None:
        return 0
    return avg_response_time

def get_kpi_stats(db : Session, user_id : int):
    incidents = get_incidents_count(db, user_id)
    uptime_percentage = get_uptime_percentage(db, user_id)
    avg_response_time = get_avg_response_time(db, user_id)
    return {
        "incidents" : incidents,
        "uptime_percentage" : uptime_percentage,
        "avg_response_time" : avg_response_time
    }

def failed(ping : PingResult): 
    return ping.status_code > 299 or ping.status_code < 200

def send_email_alerts(db: Session, endpoint: Endpoint):
    latest_pings = db.query(PingResult).filter(PingResult.endpoint_id == endpoint.id).order_by(PingResult.checked_at.desc()).limit(3).all()

    down_subject = f"Beacn Alert: {endpoint.name} is DOWN"
    up_subject = f"Beacn Alert: {endpoint.name} is back UP"

    if len(latest_pings) == 2:
        p0, p1 = latest_pings[0], latest_pings[1]
        down_email = f"""URL: {endpoint.url}
                    Last status code: {p0.status_code}
                    Response time: {p0.response_time}
                    Detected at: {p0.checked_at}"""
        if failed(p0) and failed(p1):
            send_email(endpoint.user.email, down_subject, down_email)
        return

    if len(latest_pings) < 2:
        return

    p0, p1, p2 = latest_pings[0], latest_pings[1], latest_pings[2]

    down_subject = f"Beacn Alert: {endpoint.name} is DOWN"

    down_email = f"""URL: {endpoint.url}
                Last status code: {p0.status_code}
                Response time: {p0.response_time}
                Detected at: {p0.checked_at}"""

    up_subject = f"Beacn Alert: {endpoint.name} is back UP"

    up_email = f"Detected at: {p0.checked_at}"

    if (failed(p0) and failed(p1)):
        if(not failed(p2)):
            send_email(endpoint.user.email, down_subject, down_email)

    elif (not failed(p0)):
        if(failed(p1) and failed(p2)):
                send_email(endpoint.user.email, up_subject, up_email)



