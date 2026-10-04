import asyncio
import requests
from datetime import datetime
from database import SessionLocal
from crud import get_all_endpoints_worker, create_ping_result, send_email_alerts
from database_models import Endpoint

async def ping_single_endpoint_forever(endpoint_id : int):
    while True:
        db = SessionLocal()
        endpoint = db.query(Endpoint).filter(Endpoint.id == endpoint_id).first()
        if endpoint is None: 
            db.close()
            return
        try:
            response = requests.get(endpoint.url, timeout=10)
            status_code = response.status_code
            response_time = response.elapsed.total_seconds()   
            checked_at = datetime.now()
            create_ping_result(db, endpoint.id, status_code, response_time, checked_at)
            send_email_alerts(db, endpoint)
                
        except requests.exceptions.RequestException as e:
            status_code = 0
            response_time = None
            checked_at = datetime.now()
            create_ping_result(db, endpoint.id, status_code, response_time, checked_at)
            send_email_alerts(db, endpoint)

        db.close()    
        await asyncio.sleep(endpoint.ping_interval)

async def start_worker():
    db = SessionLocal()
    endpoints = get_all_endpoints_worker(db)
    for endpoint in endpoints:
        asyncio.create_task(ping_single_endpoint_forever(endpoint.id))
    db.close()