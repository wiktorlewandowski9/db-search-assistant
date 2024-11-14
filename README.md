<h1 align="center">DB Search Assistant 🔍</h1>

<p align="center">An intuitive tool that helps users extract data from a database without needing SQL knowledge. Built to simplify data access through natural language and powered by an LLM for generating SQL queries.</p>

---

DB Search Assistant is designed to assist users in retrieving data from a PostgreSQL database by translating natural language queries into SQL. By providing contextual information about the database structure, the application can guide the language model to produce accurate SQL queries as responses to user input.

Our implementation leverages an LLM, specifically Llama 3.1 8B Instruct, for natural language understanding to translate user queries into SQL. While our setup currently uses Llama, this architecture is flexible and could be adapted to use other models based on project needs. Ideally, a fine-tuned text-to-SQL model would optimize accuracy and relevance, but due to limited resources, we achieved reliable results by enriching prompts with contextual information about the database schema.

## 🌟 Core Features

- **📝 Text-to-SQL**: Translates simple, plain text requests into SQL queries to retrieve the desired data.
- **📚 Contextual Prompting**: Incorporates information about the database structure into each query, guiding the model to output SQL.
- **🔧 Adaptable Stack**: Although we chose Spring Boot, FastAPI, and React for this project, the modular architecture supports diverse technologies.

## 💻 Tech Stack

### Backend:
[![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=fff)](#)
[![FastAPI](https://img.shields.io/badge/FastAPI-009485.svg?logo=fastapi&logoColor=white)](#)
[![Java](https://img.shields.io/badge/Java-%23ED8B00.svg?logo=openjdk&logoColor=white)](#)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?logo=springboot&logoColor=fff)](#)
[![Postgres](https://img.shields.io/badge/Postgres-%23316192.svg?logo=postgresql&logoColor=white)](#)
[![LLaMA](https://img.shields.io/badge/Llama-3.1-black?logo=ai&logoColor=white)](#)

### Frontend:
[![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)
[![NodeJS](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)](#)
