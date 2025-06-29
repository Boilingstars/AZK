from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta
import jwt
from jwt.exceptions import InvalidSignatureError, DecodeError, ExpiredSignatureError
from pydantic import BaseModel
from typing import Optional
import secrets

app = FastAPI()

SECRET_KEY = secrets.token_urlsafe(32)  
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class UserAuth(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

security = HTTPBearer()

def create_jws_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def verify_jws_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except InvalidSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token signature",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except DecodeError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Эндпоинт для получения токена
@app.post("/token", response_model=Token)
async def login_for_access_token(auth_data: UserAuth):
    if auth_data.username != "admin" or auth_data.password != "secret":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_jws_token(
        data={"sub": auth_data.username},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/protected/")
async def read_protected_data(payload: dict = Depends(verify_jws_token)):
    return {
        "message": "You have accessed protected data!",
        "user": payload.get("sub"),
        "expires": datetime.fromtimestamp(payload.get("exp")).isoformat()
    }

# Проверка токена через Middleware для всех запросов
@app.middleware("http")
async def check_jws_middleware(request: Request, call_next):
    if request.url.path in ["/token", "/docs", "/openapi.json"]:
        return await call_next(request)
    
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = auth_header.split("Bearer ")[1]
    try:
        jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token verification failed: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return await call_next(request)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
