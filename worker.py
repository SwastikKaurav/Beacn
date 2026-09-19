import asyncio
import requests
from datetime import datetime
from database import SessionLocal
from crud import get_all_endpoints_worker, create_ping_result

async def ping_all_endpoints_infinitely():
    while True:
        db = SessionLocal()
        endpoints = get_all_endpoints_worker(db)
        for endpoint in endpoints:
            try:
                response = requests.get(endpoint.url, timeout=10)
                status_code = response.status_code
                response_time = response.elapsed.total_seconds()   
                checked_at = datetime.now()
                create_ping_result(db, endpoint.id, status_code, response_time, checked_at)
                
            except requests.exceptions.RequestException as e:
                status_code = 0
                response_time = None
                checked_at = datetime.now()
                create_ping_result(db, endpoint.id, status_code, response_time, checked_at)
            
        db.close()    
        await asyncio.sleep(300)

async def start_worker():
    asyncio.create_task(ping_all_endpoints_infinitely())
