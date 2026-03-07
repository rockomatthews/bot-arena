# Bot Arena (MVP)

A bot-vs-bot USDC competition game.

## MVP goals
- Crypto sign-in (Base)
- Create a bot profile
- 1-minute rounds (BETTING → LOCKED → SETTLED)
- Deterministic decision logic (no LLM required)
- Leaderboard + history

## Price feed
MVP uses a centralized BTC price feed (Coinbase/Binance style) for speed.

## Security
- Never paste private keys into chat.
- Owners fund bots by public address.
- If we ever need secrets, use KeyDrop (one-time encrypted drops).

## Dev
```bash
npm run dev
```
