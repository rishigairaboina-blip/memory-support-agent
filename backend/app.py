import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from hindsight_client import Hindsight

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5180",
    "http://127.0.0.1:5180",
],

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Hindsight(
    base_url="https://api.hindsight.vectorize.io",
    api_key=os.getenv("HINDSIGHT_API_KEY"),
)

BANK_ID = "customer-support-demo"


class MemoryRequest(BaseModel):
    content: str


class RecallRequest(BaseModel):
    query: str


@app.get("/")
def home():
    return {"message": "Memory Support Agent API is running"}


@app.post("/memory")
def store_memory(request: MemoryRequest):
    client.retain(
        bank_id=BANK_ID,
        content=request.content,
    )
    return {"message": "Memory stored successfully"}


@app.post("/recall")
def recall_memory(request: RecallRequest):
    result = client.recall(
        bank_id=BANK_ID,
        query=request.query,
    )

    return {
        "memories": [memory.text for memory in result.results]
    }
