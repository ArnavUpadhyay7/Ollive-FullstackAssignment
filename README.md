# Ollive.ai – LLM Inference Logging System

Production-inspired **LLM inference logging + ingestion pipeline** built around a multi-turn chatbot architecture. The system captures inference metadata, processes logs asynchronously, and stores structured analytics for monitoring and observability.

## Features

### Chat System
- Multi-turn conversations
- Conversation persistence
- Resume conversations
- Cancel generation support
- Context-aware chats

### Inference Logging
Captures:

- Provider
- Model
- Latency
- Token usage
- Errors
- Timestamps
- Request/response previews
- Conversation IDs

### Architecture
- Express + Node.js
- MongoDB + Mongoose
- Redis + BullMQ
- MVC + Service Layer
- Provider abstraction (`Gemini → extensible`)
- Async queue-based ingestion
- PII redaction
- Docker support

---

## Architecture Flow

```txt
User
 ↓
Chat API
 ↓
Provider (Gemini)
 ↓
Metadata Extraction
 ↓
BullMQ Queue
 ↓
Worker
 ↓
MongoDB
```

---

## API Endpoints

### Chat

```http
POST /api/chat
POST /api/chat/cancel
```

### Conversations

```http
GET /api/conversations
POST /api/conversations
GET /api/conversations/:id
DELETE /api/conversations/:id
```

### Logs & Dashboard

```http
POST /api/logs
GET /api/dashboard/metrics
```

---

## Database Schemas

### Conversation

```txt
title
timestamps
```

### Message

```txt
conversationId
role
content
timestamp
```

### InferenceLog

```txt
provider
model
latency
tokenUsage
status
errors
metadata
conversationId
timestamps
```

---

## Local Setup

Install dependencies:

```bash
cd server
npm install
```

Create `.env`

```env
MONGO_URI=
GEMINI_API_KEY=
```

Run:

```bash
npm run dev
npm run worker
```

---

## Docker Setup

Start everything:

```bash
docker compose up --build
```

Starts:

- MongoDB
- Redis
- API
- Worker

---

## Design Decisions

### Why queues?
Inference logs are stored asynchronously so chat latency is not blocked by database writes.

### Why services?
Business logic stays outside controllers for better maintainability and reuse.

### Why provider abstraction?
Allows swapping:

```txt
Gemini
OpenAI
Claude
DeepSeek
```

without changing core logic.

---

## Security

Implemented:

- Environment variables
- PII redaction
- Secret isolation

---

## Scalability Considerations

Future improvements:

- Streaming responses
- Distributed workers
- Kubernetes deployment
- Authentication
- Dashboard UI
- OpenTelemetry tracing

---

## Assignment Coverage

| Requirement | Status |
|-------------|---------|
| Multi-turn chatbot | ✅ |
| LLM wrapper / SDK | ✅ |
| Ingestion API | ✅ |
| DB storage | ✅ |
| Event-driven architecture | ✅ |
| Docker setup | ✅ |
| PII redaction | ✅ |
| Dashboard APIs | ✅ |
| Cancel / Resume chat | ✅ |
| Multi-provider support | ✅ (architecture ready) |

---

Built for **Ollive.ai Fullstack Assignment** 🚀