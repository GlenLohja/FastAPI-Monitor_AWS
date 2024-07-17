
from fastapi import FastAPI
from api.endpoints import instance, cloudwatch, s3
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(instance.router, prefix="/api/v1")
app.include_router(cloudwatch.router, prefix="/api/v1")
app.include_router(s3.router, prefix="/api/v1")