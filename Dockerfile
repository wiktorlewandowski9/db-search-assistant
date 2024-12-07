FROM ollama/ollama

# Skopiuj model do odpowiedniego katalogu w obrazie
COPY models /root/.ollama/models

# Uruchom serwer Ollama
CMD ["serve"]