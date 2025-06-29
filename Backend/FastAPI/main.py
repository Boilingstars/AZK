from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from cassandra.cluster import Cluster

app = FastAPI()

# Подключение к базе данных Scylla
cluster = Cluster(['127.0.0.1'])  # Укажите адрес вашего Scylla кластера
session = cluster.connect('chat_keyspace')  # Укажите имя вашей базы данных

# Модель данных для сообщения
class Message(BaseModel):
    user_id: str
    content: str

@app.post("/messages/")
async def create_message(message: Message):
    try:
        # Сохранение сообщения в базе данных
        session.execute(
            "INSERT INTO messages (user_id, content) VALUES (%s, %s)",
            (message.user_id, message.content)
        )
        return {"status": "success", "message": "Message saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/messages/{user_id}")
async def get_messages(user_id: str):
    try:
        # Получение сообщений из базы данных
        rows = session.execute(
            "SELECT content FROM messages WHERE user_id=%s",
            (user_id,)
        )
        messages = [row.content for row in rows]
        return {"user_id": user_id, "messages": messages}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
