# AgroCaixa

SaaS de gestão financeira para micro e pequeno produtor rural, com foco em simplicidade, uso mobile e automação com inteligência artificial.

---

## Sobre o projeto

O AgroCaixa é uma plataforma que permite que produtores rurais controlem:

- entradas e saídas financeiras
- custos por atividade (ex: morango, leite, café)
- contas a pagar e receber
- comprovantes e documentos
- relatórios financeiros simples

Além disso, utiliza IA para:

- leitura automática de recibos (OCR)
- categorização de despesas
- geração de insights financeiros

---

## Objetivo

Ajudar produtores a responder uma pergunta simples:

> **“Eu estou lucrando ou perdendo dinheiro?”**

De forma prática, no celular e sem complexidade.

---

## Arquitetura

Este workspace contém o **starter** (backend + IA) em `agrocaixa-starter/`, organizado em serviços e executado via Docker Compose.

```text
agrocaixa-starter/
├─ docker-compose.yml
├─ services/
│  ├─ api/             # Backend principal (FastAPI + SQLAlchemy + Alembic)
│  └─ ai/              # Serviço de IA (OCR, classificação, etc)
```

---

## Stack

### Backend
- FastAPI
- PostgreSQL
- SQLAlchemy / SQLModel

### Frontend
- React Native (Expo)
- Next.js

### IA / Machine Learning
- Python
- OCR (Tesseract ou APIs externas)
- Regras + ML leve (classificação de despesas)

### Infraestrutura
- Docker
- Docker Compose

---

## Como rodar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/agrocaixa.git
cd agrocaixa
```

### 2. Criar arquivo `.env`

```bash
cp .env.example .env
```

### 3. Subir containers

```bash
cd agrocaixa-starter
docker compose up --build
```

### 4. Rodar migrações (Alembic)

As tabelas do Postgres são criadas via Alembic. Após subir os containers, aplique as migrations:

```bash
docker compose exec api alembic -c alembic.ini upgrade head
```

### 5. Acessos

- API: http://localhost:8000
- Docs (Swagger): http://localhost:8000/docs
- AI Service: http://localhost:8001
- AI Service Docs: http://localhost:8001/docs

---

## Autenticação

Rotas disponíveis:

- `POST /auth/register` — cria usuário
- `POST /auth/login` — retorna `access_token` (JWT)
- `GET /auth/me` — retorna o usuário autenticado (Bearer token)

Exemplo de registro:

```bash
curl -X POST http://localhost:8000/auth/register \
    -H "Content-Type: application/json" \
    -d '{"name":"Alvaro","email":"alvaro@email.com","password":"123456"}'
```

Exemplo de login:

```bash
curl -X POST http://localhost:8000/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"alvaro@email.com","password":"123456"}'
```

Depois, use o token:

```bash
curl http://localhost:8000/auth/me \
    -H "Authorization: Bearer SEU_TOKEN"
```

---

## Testes

Para rodar os testes do serviço de IA:

```bash
cd agrocaixa-starter/services/ai
pytest -q
```

---

## Algoritmos implementados (AI Service)

### Financeiro
- cálculo de saldo
- resumo mensal
- resultado por atividade

### Classificação
- categorização por regras (palavras-chave)

### OCR (parcial)
- limpeza de texto
- extração de valor monetário
- extração de data

---

## Estrutura do serviço de IA

```text
services/ai/app/algorithms/
├── finance/
│   ├── balance.py
│   ├── monthly_summary.py
│   └── activity_profit.py
├── classification/
│   └── rules.py
└── ocr/
    ├── clean_text.py
    ├── extract_amount.py
    └── extract_date.py
```

---

## Roadmap técnico

### MVP
- [x] Estrutura do projeto
- [x] Algoritmos financeiros básicos
- [x] Classificação por regras
- [x] Extração de valor e data (OCR)
- [x] API base FastAPI
- [ ] App mobile funcional
- [ ] App web funcional

### Próximas etapas
- [ ] OCR completo com imagem
- [ ] Extração de fornecedor
- [ ] Categorização com ML
- [ ] Alertas financeiros inteligentes
- [ ] Previsão de fluxo de caixa
- [ ] Copiloto financeiro com LLM

---

## Funcionalidades principais

- Controle financeiro via mobile
- Livro caixa simples
- Custos por atividade rural
- Contas a pagar e receber
- Upload de comprovantes
- Automação com IA

---

## Status do projeto

Em desenvolvimento (MVP)

---

## Licença

MIT
