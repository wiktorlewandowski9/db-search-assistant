FROM ollama/ollama
RUN ollama serve & sleep 5 && ollama pull hf.co/bartowski/Meta-Llama-3.1-8B-Instruct-GGUF
CMD ["serve"]