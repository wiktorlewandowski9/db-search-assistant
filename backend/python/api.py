import os
import requests
import json
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from context import load_context

LLM_NAME = os.environ.get("LLM_NAME")

context = load_context("context.txt")

app = FastAPI()


class Query(BaseModel):
    prompt: str
    model: str = ""


@app.post("/generate_sql")
async def generate_sql(query: Query):
    """Endpoint to generate text based on user prompt and model."""
    try:
        print(f"Loaded context: {context}")
        combined_prompt = f"{context} User prompt: {query.prompt}"

        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": LLM_NAME,
                "prompt": combined_prompt
            },
            stream=True
        )
        response.raise_for_status()

        generated_sql_query = ""
        for line in response.iter_lines():
            if line:
                json_line = line.decode('utf-8')
                line_data = json.loads(json_line)
                generated_sql_query += line_data.get("response")

        return generated_sql_query

    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error communicating with LLM: {str(e)}")
    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"Error parsing JSON: {str(e)}")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
