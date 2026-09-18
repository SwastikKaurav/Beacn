from fastapi import FastAPI
from routers import endpoints, pings, auth
from fastapi.middleware.cors import CORSMiddleware
from worker import start_worker

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(endpoints.router)
app.include_router(pings.router)
app.include_router(auth.router)

@app.on_event("startup")
async def on_start():
    await start_worker()