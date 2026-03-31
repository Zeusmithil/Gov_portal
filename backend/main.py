from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Hello World"}

import uvicorn

if __name__ == "__main__":
    uvicorn.run("main:app", host="[IP_ADDRESS]", port=8000, reload=True)