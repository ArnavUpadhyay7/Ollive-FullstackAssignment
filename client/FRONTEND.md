# Frontend Architecture

## Folder structure

```
client/src/
├── lib/
│   ├── api.js              # Axios instance + error normalization
│   └── streamReveal.js     # Incremental text reveal (SSE-ready)
├── services/
│   ├── chatService.js
│   ├── conversationService.js
│   └── dashboardService.js
├── store/
│   ├── conversationStore.js
│   └── dashboardStore.js
├── hooks/
│   └── useStreamedText.js
├── pages/
│   ├── ChatPage.jsx
│   └── DashboardPage.jsx
├── features/
│   ├── chat/components/
│   └── dashboard/components/
└── components/
    ├── layout/AppLayout.jsx
    └── ui/
```

## State flow (chat)

1. `ChatPage` mounts → `fetchConversations()`
2. User creates/selects conversation → `createConversation()` / `loadConversation(id)`
3. User sends message → `sendMessage(content)`:
   - Optimistic user + empty assistant messages
   - `POST /api/chat` with `AbortSignal`
   - Replace temps with server messages
   - `streamReveal` animates assistant text incrementally
4. Cancel → abort HTTP + `POST /api/chat/cancel` + cleanup stream timer

## Streaming strategy

Backend returns full JSON responses. Frontend uses `streamReveal` to simulate streaming without backend changes. When SSE is added, only `chatService` + store producer need updating; UI already handles `isStreaming` on messages.

## Backend integration

| Store action | API |
|--------------|-----|
| `createConversation` | `POST /api/conversations` |
| `fetchConversations` | `GET /api/conversations` |
| `loadConversation` | `GET /api/conversations/:id` |
| `deleteConversation` | `DELETE /api/conversations/:id` |
| `sendMessage` | `POST /api/chat` |
| `cancelGeneration` | `POST /api/chat/cancel` |
| `fetchMetrics` | `GET /api/dashboard/metrics?range=` |

## Run locally

```bash
# Backend on :5000, worker + redis + mongo running
cd client && npm run dev
```

Vite proxies `/api` → `http://localhost:5000`.
