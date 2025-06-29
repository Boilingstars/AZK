from fastapi import FastAPI
from pydantic import BaseModel
from chat import get_response_text_only

app = FastAPI(title="Real Estate ChatBot")

class Query(BaseModel):
    message: str

@app.post("/chat/")
async def chat(query: Query):
    response = get_response_text_only(query.message)
    return {"response": response}

