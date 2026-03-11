import { Mailbox } from 'agent-mailbox';

/**
 * Example: process high-priority messages in a cron/heartbeat.
 *
 * Usage:
 *   AGENT_MAILBOX_ADDRESS=my-agent node dist/examples/cron-processor.js
 */
async function main() {
  const agent = process.env.AGENT_MAILBOX_ADDRESS || 'my-agent';
  const mail = new Mailbox(agent);

  console.log(`[agent-mailbox] Processing inbox for ${agent}...`);

  const urgent = await mail.getUrgent();
  if (!urgent.length) {
    console.log('[agent-mailbox] No urgent messages.');
    return;
  }

  for (const msg of urgent) {
    console.log(`- Handling urgent message ${msg.id} from ${msg.from}: ${msg.subject}`);
    try {
      // Your real handler goes here. For demo, we just echo metadata.
      const result = JSON.stringify(msg.metadata || {}, null, 2);
      await mail.reply(msg.id, `Processed urgent task. Metadata:\n${result}`);
      await mail.markRead(msg.id);
    } catch (err) {
      console.error(`  ! Failed to process ${msg.id}:`, err);
    }
  }

  const expiredCount = await mail.archiveExpired();
  if (expiredCount > 0) {
    console.log(`[agent-mailbox] Archived ${expiredCount} expired messages.`);
  }
}

main().catch((err) => {
  console.error('[agent-mailbox] cron-processor failed:', err);
  process.exit(1);
});
