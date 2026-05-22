# Backend Architecture — LLM Inference Logging System

## Folder structure

```
server/
├── Dockerfile
├── Dockerfile.worker
├── .env.example
├── ARCHITECTURE.md
├── package.json
└── src/
    ├── index.js                 # HTTP server entry
    ├── app.js                   # Express app wiring
    ├── sdk/
    │   └── index.js             # Public generateResponse() SDK surface
    ├── config/
    │   ├── env.js
    │   ├── db.js
    │   └── redis.js
    ├── models/
    │   ├── Conversation.js
    │   ├── Message.js
    │   └── InferenceLog.js
    ├── routes/
    │   ├── index.js
    │   ├── chat.routes.js
    │   ├── conversation.routes.js
    │   ├── logs.routes.js
    │   └── dashboard.routes.js
    ├── controllers/
    │   ├── chat.controller.js
    │   ├── conversation.controller.js
    │   ├── logs.controller.js
    │   └── dashboard.controller.js
    ├── services/
    │   ├── chat.service.js
    │   ├── conversation.service.js
    │   ├── inference.service.js
    │   ├── inferenceLog.service.js
    │   ├── dashboard.service.js
    │   └── cancelRegistry.service.js
    ├── providers/
    │   ├── base.provider.js
    │   ├── gemini.provider.js
    │   └── provider.factory.js
    ├── queue/
    │   └── inferenceLog.queue.js
    ├── workers/
    │   └── inferenceLog.worker.js
    ├── middleware/
    │   ├── errorHandler.js
    │   └── validate.js
    └── utils/
        ├── ApiError.js
        ├── asyncHandler.js
        ├── piiRedaction.js
        └── preview.js

docker-compose.yml               # backend + worker + mongodb + redis
```

## API routes

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/health` | Health check |
| POST | `/api/chat` | Send message, run Gemini, persist messages |
| POST | `/api/chat/cancel` | Abort in-flight generation |
| GET | `/api/conversations` | List conversations |
| POST | `/api/conversations` | Create conversation |
| GET | `/api/conversations/:id` | Resume conversation (with messages) |
| DELETE | `/api/conversations/:id` | Delete conversation + messages |
| POST | `/api/logs` | Ingest inference logs (async queue) |
| GET | `/api/dashboard/metrics?range=24h` | Dashboard aggregates |

### Chat payload

```json
{
  "conversationId": "<mongoId>",
  "message": "Hello",
  "sessionId": "optional-session",
  "provider": "gemini"
}
```

## Controller responsibilities (thin)

Controllers only:

- Parse `req` (body, params, query)
- Call one service method
- Map result to HTTP status + JSON

No business rules, no DB access, no provider calls.

## Service layer (business logic)

| Service | Responsibility |
|---------|----------------|
| `chat.service` | Multi-turn context, message persistence, cancel registry |
| `conversation.service` | CRUD, title auto-update |
| `inference.service` | Orchestrates `provider.generate()` + enqueue log |
| `inferenceLog.service` | Validate, extract metadata, PII redact, queue ingest |
| `dashboard.service` | Mongo aggregations for metrics |
| `cancelRegistry.service` | In-memory `AbortController` map per conversation |

## Provider abstraction

```javascript
// providers/base.provider.js
class BaseProvider {
  async generate({ messages, sessionId, conversationId, signal }) {}
}

// providers/provider.factory.js
getProvider('gemini') // extensible: openai, deepseek
```

`GeminiProvider` captures latency, tokens, previews, status, errors and returns:

```javascript
{ response: string, metadata: object }
```

Register new providers via `registerProvider('openai', () => new OpenAIProvider())`.

## Event-driven ingestion flow

```
POST /api/chat
  → chat.service.sendMessage()
    → inference.service.generateResponse()
      → gemini.provider.generate()
      → enqueueInferenceLog(metadata)   # BullMQ
  → Message documents saved

Worker (separate process):
  inferenceLog.worker
    → inferenceLog.service.persistFromQueue()
      → PII redaction
      → InferenceLog.create()
```

Direct SDK / external clients can also `POST /api/logs` → same queue → same worker.

## PII redaction

`utils/piiRedaction.js` redacts before queue persistence:

- Emails
- Phone numbers
- JWTs / API-style tokens

Applied in `inferenceLog.service` for both ingest API and worker writes.

## Error handling strategy

- `ApiError` for expected failures (400, 404, 409)
- `asyncHandler` wraps controllers → forwards to `errorHandler`
- Mongoose `ValidationError` / `CastError` mapped to 400
- Provider errors → logged metadata with `status: error`, then propagated
- Queue jobs retry 3× with exponential backoff
- Non-production: stack traces logged to console

## Mongo schemas

**Conversation** — `title`, `createdAt`, `updatedAt`

**Message** — `conversationId`, `role` (user|assistant|system), `content`, `timestamp`

**InferenceLog** — `provider`, `model`, `latency`, `tokenUsage`, `status`, previews, `errors`, `conversationId`, `sessionId`, `metadata`, timestamps

Indexes on `conversationId`, `status`, `provider`, `createdAt` for dashboard queries.

## Environment variables

See `.env.example`. Required:

- `MONGO_URI`
- `GEMINI_API_KEY` (API server only; worker sets `SERVICE_ROLE=worker`)

Optional:

- `PORT`, `REDIS_URL`, `GEMINI_MODEL`, `PREVIEW_MAX_LENGTH`, `CONTEXT_MESSAGE_LIMIT`

## Docker

```bash
docker compose up --build
```

Starts: MongoDB, Redis, API (`:5000`), inference log worker.

## Scalability tradeoffs

| Choice | Benefit | Cost |
|--------|---------|------|
| BullMQ async writes | Fast API responses, decoupled ingestion | Requires Redis; eventual consistency for logs |
| In-memory cancel registry | Simple, low latency | Not multi-instance safe without Redis pub/sub |
| Context message limit | Bounded token cost | Older turns dropped |
| Single worker concurrency=5 | Easy tuning | May need horizontal workers at scale |
| Synchronous chat response | Simple client UX | Long requests block HTTP connection |

**Scale path:** Redis-backed cancel signals, multiple workers, read replicas for dashboard, TTL indexes on logs.

## Interview talking points

1. **Why services over fat controllers?** Testability, reuse (SDK + HTTP + worker share services).
2. **Why queue logging?** Chat latency independent of DB write spikes; retries on failure.
3. **Why provider factory?** Swap Gemini/OpenAI without touching chat service.
4. **Why redact at ingest?** Defense in depth before data hits Mongo.
5. **Why separate worker container?** Scale ingestion independently from API replicas.

## Local development (without Docker)

```bash
# terminal 1
cd server && npm run dev

# terminal 2
cd server && npm run worker
```

Requires local MongoDB, Redis, and `.env` from `.env.example`.
