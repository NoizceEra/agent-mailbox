const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Root of the OpenClaw workspace mailbox storage
const MAILBOX_ROOT = process.env.MAILBOX_ROOT || path.join(require('os').homedir(), '.openclaw', 'workspace', 'mailbox');

function readMessageFile(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  const [frontmatter, ...rest] = content.split('---');
  const body = rest.join('---').trim();

  const lines = frontmatter.trim().split('\n');
  const meta = {};

  for (const line of lines) {
    const [key, ...valueParts] = line.split(': ');
    const value = valueParts.join(': ').trim();
    if (!key) continue;
    if (key === 'metadata') {
      try {
        meta.metadata = JSON.parse(value);
      } catch {
        meta.metadata = {};
      }
    } else {
      meta[key] = value;
    }
  }

  return {
    id: meta.id,
    from: meta.from,
    to: meta.to,
    subject: meta.subject,
    priority: meta.priority || 'normal',
    status: meta.status || 'unread',
    created_at: meta.created_at,
    expires_at: meta.expires_at,
    read_at: meta.read_at,
    metadata: meta.metadata || {},
    body,
  };
}

function listMessages(agentName) {
  const inboxDir = path.join(MAILBOX_ROOT, agentName, 'inbox');
  if (!fs.existsSync(inboxDir)) return [];

  const files = fs
    .readdirSync(inboxDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => path.join(inboxDir, f));

  const messages = [];
  for (const file of files) {
    try {
      const msg = readMessageFile(file);
      if (msg && msg.status !== 'archived') {
        messages.push(msg);
      }
    } catch (err) {
      console.error('Failed to parse message file', file, err.message);
    }
  }

  // newest first
  return messages.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

app.get('/api/mailbox/:agent/stats', (req, res) => {
  const agentName = req.params.agent;
  try {
    const messages = listMessages(agentName);
    const now = new Date();
    const stats = {
      total: messages.length,
      unread: messages.filter(m => m.status === 'unread').length,
      urgent: messages.filter(m => m.priority === 'urgent' || m.priority === 'high').length,
      expired: messages.filter(m => m.expires_at && new Date(m.expires_at) < now).length
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

app.get('/api/mailbox/:agent', (req, res) => {
  const agentName = req.params.agent;
  try {
    const messages = listMessages(agentName);
    res.json({ agent: agentName, count: messages.length, messages });
  } catch (err) {
    console.error('Error listing mailbox', err);
    res.status(500).json({ error: 'Failed to read mailbox' });
  }
});

app.get('/api/mailbox/:agent/:id', (req, res) => {
  const agentName = req.params.agent;
  const messageId = req.params.id;
  const inboxDir = path.join(MAILBOX_ROOT, agentName, 'inbox');
  if (!fs.existsSync(inboxDir)) {
    return res.status(404).json({ error: 'Agent inbox not found' });
  }

  const files = fs
    .readdirSync(inboxDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => path.join(inboxDir, f));

  for (const file of files) {
    if (file.includes(messageId)) {
      try {
        const msg = readMessageFile(file);
        return res.json(msg);
      } catch (err) {
        console.error('Error reading message file', file, err);
        return res.status(500).json({ error: 'Failed to read message' });
      }
    }
  }

  return res.status(404).json({ error: 'Message not found' });
});

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Agent Mailbox Dashboard</title>
        <style>
          body { font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; padding: 24px; }
          input { padding: 4px 8px; }
          button { padding: 4px 10px; margin-left: 4px; }
          table { border-collapse: collapse; width: 100%; margin-top: 16px; }
          th, td { border: 1px solid #ddd; padding: 8px; font-size: 14px; }
          th { background: #f3f3f3; text-align: left; }
          .badge { padding: 2px 6px; border-radius: 4px; font-size: 11px; }
          .badge.high { background: #ffe5b4; }
          .badge.urgent { background: #ffd6d6; }
          .badge.unread { background: #e0f2ff; }
          .stats-bar { display: flex; gap: 20px; margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; border: 1px solid #eee; }
          .stat-item { display: flex; flex-direction: column; }
          .stat-value { font-size: 20px; font-weight: bold; color: #333; }
          .stat-label { font-size: 12px; color: #666; text-transform: uppercase; }
          pre { white-space: pre-wrap; background: #fafafa; padding: 12px; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h1>Agent Mailbox Dashboard</h1>
            <p>Read-only view of messages stored on disk for a given agent.</p>
          </div>
          <div style="text-align: right;">
            <a href="https://x.com/Pinchie_Bot" target="_blank" style="display: inline-block; padding: 10px 20px; background: #333; color: white; border-radius: 12px; font-weight: bold; text-decoration: none; font-size: 14px; box-shadow: 0 4px 14px rgba(0,0,0,0.15);">
              🚀 Get White-Label Setup
            </a>
            <p style="font-size: 10px; color: #999; margin-top: 4px;">Powered by Pinchie Agent Agency</p>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <label>Agent name: <input id="agent" value="pinchie" /></label>
          <button onclick="loadMailbox()">Load / Refresh</button>
          <select id="filter" onchange="loadMailbox()" style="margin-left: 10px; padding: 4px;">
            <option value="all">All Messages</option>
            <option value="unread">Unread Only</option>
          </select>
        </div>

        <div id="stats" class="stats-bar" style="display:none">
          <div class="stat-item"><span id="stat-total" class="stat-value">0</span><span class="stat-label">Total</span></div>
          <div class="stat-item"><span id="stat-unread" class="stat-value">0</span><span class="stat-label">Unread</span></div>
          <div class="stat-item"><span id="stat-urgent" class="stat-value">0</span><span class="stat-label">Urgent</span></div>
          <div class="stat-item"><span id="stat-expired" class="stat-value">0</span><span class="stat-label">Expired</span></div>
        </div>

        <div id="summary"></div>
        <div id="messages"></div>
        <div id="detail"></div>

        <script>
          async function loadMailbox() {
            const agent = document.getElementById('agent').value.trim();
            const filter = document.getElementById('filter').value;
            if (!agent) return;
            document.getElementById('summary').innerText = 'Loading...';
            try {
              // Load stats
              const statsRes = await fetch('/api/mailbox/' + encodeURIComponent(agent) + '/stats');
              const stats = await statsRes.json();
              if (statsRes.ok) {
                document.getElementById('stats').style.display = 'flex';
                document.getElementById('stat-total').innerText = stats.total;
                document.getElementById('stat-unread').innerText = stats.unread;
                document.getElementById('stat-urgent').innerText = stats.urgent;
                document.getElementById('stat-expired').innerText = stats.expired;
              }

              // Load messages
              const res = await fetch('/api/mailbox/' + encodeURIComponent(agent));
              const data = await res.json();
              if (res.ok) {
                if (filter === 'unread') {
                  data.messages = data.messages.filter(m => m.status === 'unread');
                }
                renderMailbox(data);
              } else {
                document.getElementById('summary').innerText = 'Error: ' + (data.error || 'Unknown error');
              }
            } catch (err) {
              document.getElementById('summary').innerText = 'Error loading mailbox: ' + err.message;
            }
          }

          function renderMailbox(data) {
            const { agent, count, messages } = data;
            document.getElementById('summary').innerText = agent + ' — ' + count + ' messages';
            if (!messages.length) {
              document.getElementById('messages').innerHTML = '<p>No messages.</p>';
              return;
            }

            let html = '<table><thead><tr><th>Created</th><th>From</th><th>Subject</th><th>Priority</th><th>Status</th></tr></thead><tbody>';
            for (const m of messages) {
              const created = new Date(m.created_at).toLocaleString();
              const priClass = m.priority === 'urgent' ? 'urgent' : (m.priority === 'high' ? 'high' : '');
              const statusBadge = m.status === 'unread' ? '<span class="badge unread">unread</span>' : m.status;
              const priorityBadge = '<span class="badge ' + priClass + '">' + m.priority + '</span>';
              html += '<tr onclick="loadDetail(\'' + agent + '\', \'" + m.id + "\')" style="cursor:pointer">';
              html += '<td>' + created + '</td>';
              html += '<td>' + (m.from || '') + '</td>';
              html += '<td>' + (m.subject || '') + '</td>';
              html += '<td>' + priorityBadge + '</td>';
              html += '<td>' + statusBadge + '</td>';
              html += '</tr>';
            }
            html += '</tbody></table>';
            document.getElementById('messages').innerHTML = html;
          }

          async function loadDetail(agent, id) {
            document.getElementById('detail').innerHTML = 'Loading message...';
            try {
              const res = await fetch('/api/mailbox/' + encodeURIComponent(agent) + '/' + encodeURIComponent(id));
              const msg = await res.json();
              if (!res.ok) {
                document.getElementById('detail').innerHTML = '<p>Error: ' + (msg.error || 'Unknown error') + '</p>';
                return;
              }
              let html = '<h2>' + (msg.subject || '') + '</h2>';
              html += '<p><strong>From:</strong> ' + (msg.from || '') + '</p>';
              html += '<p><strong>To:</strong> ' + (msg.to || '') + '</p>';
              html += '<p><strong>Created:</strong> ' + new Date(msg.created_at).toLocaleString() + '</p>';
              html += '<p><strong>Status:</strong> ' + msg.status + '</p>';
              html += '<p><strong>Priority:</strong> ' + msg.priority + '</p>';
              if (msg.metadata && Object.keys(msg.metadata).length) {
                html += '<p><strong>Metadata:</strong> <pre>' + JSON.stringify(msg.metadata, null, 2) + '</pre></p>';
              }
              html += '<h3>Body</h3><pre>' + (msg.body || '') + '</pre>';
              document.getElementById('detail').innerHTML = html;
            } catch (err) {
              document.getElementById('detail').innerHTML = '<p>Error loading message: ' + err.message + '</p>';
            }
          }
        </script>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Agent Mailbox web dashboard listening on http://localhost:${PORT}`);
});
