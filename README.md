# Vita Dashboard

Painel admin do sistema Vita — cotação de medicamentos via WhatsApp.

## Features
- **Overview** — KPIs em tempo real (usuários, cotações, fila, erros)
- **Logs** — Stream SSE ao vivo com filtros e expand de JSON
- **Workflow** — Diagrama interativo dos agentes com editor de prompts Monaco
- **Usuários** — Tabela paginada com perfil e histórico de cotações
- **Cotações** — Timeline por farmácia com preços e status
- **Roadmap** — Progresso do projeto e próximos passos

## Stack
Vite · React 19 · TailwindCSS 3 · TanStack Query · React Flow v11 · Zustand · Recharts · Monaco Editor

## Setup (desenvolvimento)

```bash
npm install
npm run dev   # http://localhost:5173
```

> Requer vita-core rodando em localhost:3000

## Deploy (Vercel)

1. Faça deploy do backend `vita-core` no Railway
2. Copie a URL pública do Railway
3. No painel da Vercel, adicione a variável de ambiente:
   - `VITE_API_BASE` = `https://sua-url.railway.app`
4. Faça o deploy — cada push em `main` redeploy automaticamente

## Variáveis de ambiente

| Variável | Descrição | Exemplo |
|---|---|---|
| `VITE_API_BASE` | URL do backend vita-core | `https://vita-core.railway.app` |

> Em desenvolvimento, deixe vazio — o proxy Vite cuida do redirecionamento.
