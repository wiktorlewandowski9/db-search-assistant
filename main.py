import requests
import json
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

context = ''

app = FastAPI()

class Query(BaseModel):
    prompt: str
    model: str = ""

@app.post("/generate")
async def generate_text(query: Query):
    try:
        # Łączenie promptu użytkownika z kontekstem
        combined_prompt = f"{context} User prompt: {query.prompt}"
        
        # Wysłanie zapytania do serwera Ollama
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": query.model,
                "prompt": combined_prompt
            },
            stream=True
        )
        response.raise_for_status()

        # Zbieranie odpowiedzi
        generated_text = ""
        for line in response.iter_lines():
            if line:
                json_line = line.decode('utf-8')
                line_data = json.loads(json_line)
                generated_text += line_data.get("response", "")

        return {generated_text}

    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error communicating with Ollama: {str(e)}")
    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"Error parsing JSON: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
