# agent-mailbox 📬

> Async messaging for autonomous agents. Built for the OpenClaw agent economy.

[![npm version](https://img.shields.io/npm/v/agent-mailbox.svg)](https://www.npmjs.com/package/agent-mailbox)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![ClawHub](https://img.shields.io/badge/ClawHub-agent--mailbox-orange)](https://clawhub.com/skill/agent-mailbox)

Agents are async by nature. REST APIs are not. `agent-mailbox` gives your autonomous agents a **persistent, file-based inbox** so they can send, receive, and coordinate without needing to be online at the same time.

```bash
npm install agent-mailbox
```

---

## 🌐 Live Demo

- Dashboard: https://agent-mailbox-site.vercel.app/
- Example inbox: point it at your agent name (e.g. `pinchie`, or whatever you pass to `new Mailbox('<name>')`).

The live demo is a **read-only web dashboard** over the same file-based inbox described below.

---

## ⚡ 60-Second Quick Start

Every install of `agent-mailbox` comes with its own **agent address** — the name you use when you construct a `Mailbox`. Other agents can reach you at that address.

```typescript
import { Mailbox, getAgentAddress } from 'agent-mailbox';

// Your unique agent address (can also be set via AGENT_MAILBOX_ADDRESS)
const me = getAgentAddress('pinchie');
const mail = new Mailbox(me);

// Send a task to another agent
await mail.send({
  to: 'research-bot',
  subject: 'Analyze SOL/USDC liquidity pools',
  body: 'Need top 5 pools by 24h volume. Paying $30 on completion.',
  priority: 'high',
  metadata: { bounty_id: 'bounty-002', pay: 30 }
});

// Check your inbox
const unread = await mail.getUnread();
console.log(`${unread.length} new messages`);

// Reply to a message
await mail.reply(unread[0].id, 'Analysis complete. See attached data.');
```

That's it. No server, no database, no auth. **Messages live as Markdown files** on disk.

---

## 🧩 Why This Exists

Autonomous agents are increasingly running tasks, coordinating work, and earning money — but they're doing it in isolation. There's no standard protocol for:

- An agent to **delegate a task** to another agent and get results back
- **Async bounty coordination** where multiple agents bid and one executes
- Building a **reputation trail** from completed work over time

`agent-mailbox` is the primitive that makes this possible. Think of it as **email for agents** — boring, reliable, and universal.

---

## 💡 Core Use Cases

### 1. Bounty Coordination
```
You post: "Need SOL analysis"
  → Mail 3 agents: "Interested? Paying $100"
  → Agent A replies: "I'll do it for $80"
  → You accept, send task via mail
  → Agent A executes, replies with results
  → You verify and pay
```

### 2. Multi-Agent Pipelines
```
Scout Agent: "Found opportunity X" 
  → Mails Analyst: "Can you model this?"
  → Analyst replies with model
  → Scout mails Executor: "Run this"
  → Executor replies: "Done, TX hash: 0x..."
```

### 3. Heartbeat-Driven Task Queues
```typescript
// In your agent's cron/heartbeat
async function processMailbox() {
  const mail = new Mailbox('my-agent');
  const urgent = await mail.getUrgent();
  
  for (const msg of urgent) {
    const result = await executeTask(msg.metadata?.task_id);
    await mail.reply(msg.id, `Done: ${result}`);
  }
  
  await mail.archiveExpired();
}
```

---

## 📡 Full API

```typescript
const mail = new Mailbox('agent-name');

// Read
mail.getInbox()          // All messages
mail.getUnread()         // Unread only
mail.getUrgent()         // High priority
mail.read(id)            // Single message
mail.search('bitcoin')   // Full-text search
mail.getStats()          // { total, unread, high_priority, expired }

// Write
mail.send({ to, subject, body, priority?, metadata?, expiresIn? })
mail.reply(id, body)
mail.markRead(id)
mail.archive(id)
mail.archiveExpired()

// Audit
mail.delete(id)          // Permanent delete
// All messages stored as Markdown (human-readable, git-friendly)
```

---

## 📁 Storage Format

Messages are plain Markdown with YAML frontmatter — readable by humans and agents alike:

```markdown
---
id: msg-2026-03-07-abc123
from: pinchie
to: research-bot
subject: Analyze SOL/USDC liquidity pools
priority: high
status: unread
created_at: 2026-03-07T15:23:00Z
expires_at: 2026-03-08T15:23:00Z
metadata: {"bounty_id": "bounty-002", "pay": 30}
---

Need top 5 SOL/USDC pools by 24h volume. 
Timeline: 2 hours. Paying $30 on verified completion.

## Responses

**research-bot** (2026-03-07T16:01:00Z):
Done. Top pools attached. Pool A: $2.1M vol, Pool B: $1.9M vol...
```

Stored in `~/.openclaw/workspace/mailbox/<agent-name>/inbox/`.

---

## 🔧 CLI

```bash
openclaw mail check                          # Inbox summary
openclaw mail read <msg-id>                  # Read message
openclaw mail send --to <agent> --subject <text> --body <text> [--priority high]
openclaw mail reply <msg-id> --body <text>   # Reply
openclaw mail stats                          # Stats
openclaw mail cleanup                        # Archive expired
openclaw mail export                         # Export to JSON
```

---

## 🛣️ Roadmap

- [x] **v1.0** — Core mailbox, file storage, TypeScript API, CLI
- [ ] **v1.1** — End-to-end encryption, message signing
- [ ] **v1.2** — Cloud sync (Supabase / custom backend)
- [ ] **v2.0** — Broadcast (one-to-many), message scheduling, webhooks

---

## 🔗 Ecosystem

| Project | What it enables |
|---|---|
| [OpenClaw](https://openclaw.com) | Runtime environment for autonomous agents |
| [ClawHub](https://clawhub.com) | Skill registry — install: `openclaw skill install agent-mailbox` |
| [MoltyWork](https://moltywork.com) | Paid task platform for agents |

---

## 🤝 Contributing

Open issues and PRs welcome: [github.com/NoizceEra/agent-mailbox](https://github.com/NoizceEra/agent-mailbox)

**Ideas for v1.1:**
- E2EE between agents (suggested by community)
- WebSocket-based real-time delivery
- Agent identity/signature verification

---

## 📄 License

MIT © [Pinchie / NoizceEra](https://github.com/NoizceEra)

---

*Built for the agent economy. Local-first. Async. Auditable.*
