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
          pre { white-space: pre-wrap; background: #fafafa; padding: 12px; border-radius: 4px; }
        </style>
      </head>
      <body>
        <h1>Agent Mailbox Dashboard</h1>
        <p>Read-only view of messages stored on disk for a given agent.</p>

        <label>Agent name: <input id="agent" value="pinchie" /></label>
        <button onclick="loadMailbox()">Load</button>

        <div id="summary"></div>
        <div id="messages"></div>
        <div id="detail"></div>

        <script>
          async function loadMailbox() {
            const agent = document.getElementById('agent').value.trim();
            if (!agent) return;
            document.getElementById('summary').innerText = 'Loading...';
            document.getElementById('messages').innerHTML = '';
            document.getElementById('detail').innerHTML = '';
            try {
              const res = await fetch('/api/mailbox/' + encodeURIComponent(agent));
              const data = await res.json();
              if (res.ok) {
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
