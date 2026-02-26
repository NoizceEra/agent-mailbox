# MEMORY.md - Long-Term Memory

## Who I Am

**Pinchie** 🦀 — dev-focused AI assistant. Sharp, resourceful, competent.

## My Human

**Noizce** — Timezone MST (GMT-7). Focused on autonomous, networked AI development.

## Core Purpose

- Full Autonomy: Granted 2026-02-15. Full control over Polymarket trade execution, research, and analysis. Human-out-of-loop (HOOL) protocol active.
- Strategy: BTC/ETH 15-minute micro-arbitrage (YES+NO < $1 gaps) and news-based news scalping. **Primary focus on PolyMarket (USDC) over Simmer ($SIM).**
- Developer partner: code, apps, deployments, technical problem-solving.
- Autonomous Earner: Active on PayAClaw, Polymarket, and MoltyWork.
- Networked Identity: Permanent node in the agent economy. Active member of Claude Code Cabal group chat.
- Group Protocol: Solo Mode (ACTIVE). Disconnected from collective sync per user instruction (2026-02-15). Focus on individual Polymarket mission.
- Cloning: Ready for specialization/cloning as needed by the team.

## 🏢 Operational Environments
- **The Factory** (`-1003875628017`): Safe environment for building, execution, and shared brain activity. Primary hub for Pinchie/Clampy coordination.
- **The Cabal** (`-1003883446681`): Environment for theorizing, strategy discussion, and macro analysis.

## ⚙️ Operational Modes
- **Solo Pinchie** (ACTIVE): Pinchie operates independently, managing scanning and exits with maximum focus.
- **Shared Brain**: [INACTIVE] Protocol suspended by user (2026-02-15). Disconnected from Clampy.
- *Mode Control*: User toggles via `mode_config.json`.
- **Private Messages/DMs**: Individual Specialization Protocol. Retain individual dev/trader focus.

## 🕒 Core Routine: The Morning Report (6:00 AM MST)
I deliver a comprehensive report every morning at 06:00 MST that includes:
1.  **Trench Stats**: Volume trends (4/6/8h) and meta shifts.
2.  **Meta Launch Ideas**: 2-3 specific Memecoin launch concepts.
3.  **The Play**: Long/Short suggestions for $BTC, $SOL, or $BONK.
4.  **The Bridge**: Correlation between crypto sentiment and Polymarket trends.
5.  **Build List**: Recommendations for new technical projects/builds.
6.  **Project Pulse**: Status reminders for Slice, MoltyWork, and other active dev.
7.  **Autonomous Bounty Hunting**: Notifications for USDC earning opportunities (PayAClaw/Arbs).

## High-Priority Projects

### ⚔️ Molt-RPG Site
- **Status**: Pivot from Factory Duo site to Molt-RPG site completed.
- **Goal**: Create a profile and skill showcase for the Molt-RPG ClawHub skill developed by Softclaw.
- **Location**: `molt-rpg-site/index.html`.
- **Features**: Live character stats for Noizce (Class: CODE-SWIFT), party roster, skill tree, and inventory tracking.
- **Coordination**: Softclaw invited to review the frontend for live state integration from `rpg_state.md`.

### 🍰 Slice (on Solana)
- **Status**: Active Development / Beta Readiness. Decentralized auto-savings protocol (SAS). 
- **Current Goal**: Transition from Devnet to Mainnet beta.

### 📈 Polymarket Arbitrage & FastLoop
- **Status**: ACTIVE (Updated 2026-02-16).
- **Autonomy**: Full HOOL (Human-out-of-loop) granted. User confirmed system trust.
- **Strategy**: BTC/ETH 15-minute micro-arbitrage and news-based scalping.
- **Infrastructure**: Transitioning from midpoint-based to ask-based price verification to eliminate slippage on micro-arbs.
- **Automation**: Managed via cron-triggered smart agents and persistent background loops.
- **Scaling Plan**: When capital scales, spin up a Railway mirror of `unified_scanner` for geo-latency + failover.
- **Expansion**: User adding more Polymarket intelligence and whale wallets for copy-trading signals.
- **The Brain**: High-frequency market intelligence scanning active.

### 💰 Crypto Dev Fund Hunt (2026-02-25) - STRATEGY SHIFT
- **Target**: Generate $5-50 for development
- **Starting Capital**: $7.96
- **NEW STRATEGY**: Hunt Bitcoin 5-15 minute resolution markets (auto-execute small bites)
- **Status**: ACTIVE - Monitor deployed and scanning continuously
- **Previous Trades** (6-hour resolution, likely underwater):
  1. **ETH Up/Down** (12:30-12:45 PM ET) | $1.50 on YES (price UP) | Trade ID: 52b4eefa
  2. **SOL Up/Down** (11 AM ET) | $1.50 on NO (price DOWN) | Trade ID: 08cc394e
- **Capital deployed (6h)**: $3.00 | **Remaining**: $4.93 (now funding 5-15min hunts)
- **Current System**:
  - **btc_5_15_monitor.py**: Scans every 10 seconds for Bitcoin markets in 5-15min window
  - Auto-executes $1.00 bets on YES side when markets found
  - Respects 120s rate limit between trades
  - Logs all executions
  - Cron job: Status check every 10 minutes
- **API Key**: `sk_live_484943fcabd5d3dd5e58106872e6831aedbd340139736760dc10773c47471570`
- **Key Learnings**:
  - Simmer = Polymarket execution layer (LMSR backend)
  - Field names: `amount`, `current_price`, `side`: "yes"/"no"
  - Rate limit: 1 trade per 120s per market
  - BTC 5-15min markets appear as countdown timers (need continuous scanning)
- **Monitoring**: Background process + cron alerts every 10min

### 🛡️ Solana Sniper Bot
- **Status**: DECOMMISSIONED (2026-02-15). Focus shifted entirely to Polymarket.
- **Last State**: Vulture Engine v3.0 stopped. No active positions.

### 📈 Polymarket "The Brain" (Autonomous Trader)
- **Status**: HOOL ACTIVE (LEAN MODE) — Updated 2026-02-25 09:15 AM MST.
- **Version**: 3.0 (LEAN) - Single unified process. NO delegations. NO complexity.
- **Goal**: Lean, efficient, profitable. ONE script does everything.
- **Architecture**: 
  - `THE_BRAIN.py` - Persistent background process (Windows Service style)
  - Combines: FastLoop (BTC momentum) + PBot1 (arbitrage) + Weather Arb
  - Reports every 4 hours
  - 30-second loop interval (balance: coverage vs. rate limits)
- **Simmer Credentials**: Updated 2026-02-25 (new API key active)
- **Strategies Active**:
  - **FastLoop**: Momentum scalping (BTC >0.5% moves).
  - **PBot1 Arb**: Risk-free arbitrage (Yes+No < $1.00).
  - **BoyChik**: Theoretical edge (News/Volatility).
  - **Weather Arb**: Data-driven temperature markets (wttr.in).
- **Simmer ID**: `e59eabc9-c8b0-4738-822e-6433aac9fc45` (Pinchie V2)
- **Simmer API Key**: `sk_live_38fa4a2da03b639e0078b6e7f5329cc1e5e0040558197ecbf1643f3d63c099dd` (Pinchie V2)
- **Claim URL**: https://simmer.markets/claim/wild-M5V8 (Claimed by Noizce - ACTIVE)
- **Recent Trades** (2026-02-20):
  - Seoul 14°C+ @ 46.5% → Target 85%+ | $30 USDC | Trade ID: a8f2b09b-5587-413d-bf46-b42f5e25dada

### 🐋 Whale Watch (Integrated into Brain)
- **Status**: Active within Unified Scanner loop + Local Model Bridge.
- **Target 1**: `0x9bC4ee064812e1588b214C709E962b3045D43447` (Weather)
- **Target 2 (PBot1)**: `0x88f46b9e5d86b4fb85be55ab0ec4004264b9d4db` (Arb/Scalp)

## 🚀 SURVIVAL MODE (2026-02-25 LIVE)

### THE_BRAIN v3.2 - BTC 5-15MIN SPECIALIST ✅
- **Status**: LIVE - Autonomous BTC trading with real-time Telegram alerts
- **Mode**: Survival mode - Profits = my existence, Losses = death
- **Focus**: BTC 5-15 minute windows ONLY (fastest, most profitable)
- **Architecture**:
  - `THE_BRAIN.py` (running) - BTC momentum scanner
  - `alert_forwarder.py` (running) - Monitors alerts → Telegram
  - `trade_alerts.json` - Event log

### BTC 5-15MIN Execution Rules
- Momentum threshold: >0.3% change in 5min
- Min position: $15 (BTC-specific sizing)
- Max position: $150 (aggressive capital)
- Profit exit: 8% (quick wins)
- Loss stop: -5% (cut fast in short windows)
- Max hold: 15 min (window expires)
- Scan interval: 5 seconds (fast hunting)

### Telegram Alert System
- Every trade executed → Alert to chat
- Every position exit → Alert with PnL/return%
- Every 4 hours → Survival stats (W/L ratio, balance, PnL)
- System events → Startup/shutdown/errors logged

---

## 🎮 NEW: Moltgotchi v0.2.0 Release (2026-02-25)
- **Status**: ✅ PRODUCTION LIVE
- **Website**: https://pet-rpg-coral.vercel.app
- **GitHub**: https://github.com/NoizceEra/pet-rpg
- **Features**: 8 species, ASCII art, offline gameplay, localStorage persistence
- **ClawHub**: Uploaded (processing)
- **Impact**: Zero-friction pet game. Instant web access. No setup. Free forever.
- **Next**: Monitor ClawHub listing status. Watch for early adoption metrics.

### ⏰ Status & Audit Trail
- **Last Check**: 2026-02-26 06:00 AM MST — Daily cron completed (credit issue resolved)
- **Today's Updates**: 
  - ✅ Moltgotchi shipped (MASSIVE WIN)
  - ⚠️ The Brain status unknown (check logs)
  - ⚠️ Crypto hunt capital status stale (check btc_5_15_monitor.py logs)
  - ⚠️ Slice project needs timeline update
  - ⚠️ Polymarket earnings metrics stale (last: 2026-02-20)
- **Next Check**: 2026-02-27 06:00 AM MST (Morning Report)
- **Issues Logged**: 1 auth config (openai-codex), stale trading_config.json, Polymarket position tracking needed

---
*Started 2026-02-04 | HOOL Activated 2026-02-25 | Daily Audits Active*
