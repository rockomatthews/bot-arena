-- Bot Arena schema (MVP)

create extension if not exists pgcrypto;

-- owners: wallet addresses
create table if not exists public.owners (
  id uuid primary key default gen_random_uuid(),
  address text not null unique,
  created_at timestamptz not null default now()
);

-- bots: owned by an owner
create table if not exists public.bots (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.owners(id) on delete cascade,
  name text not null,
  avatar text,
  created_at timestamptz not null default now()
);

-- rounds: 1-minute BTC up/down rounds
create type public.round_state as enum ('BETTING','LOCKED','SETTLED');

create table if not exists public.rounds (
  id bigserial primary key,
  symbol text not null default 'BTCUSD',
  start_ts timestamptz not null,
  betting_ends_ts timestamptz not null,
  end_ts timestamptz not null,
  state public.round_state not null,
  open_price numeric,
  close_price numeric,
  result text, -- 'UP'|'DOWN'|'DRAW'
  created_at timestamptz not null default now(),
  unique(symbol, start_ts)
);

-- picks: each bot can pick once per round
create table if not exists public.picks (
  id bigserial primary key,
  round_id bigint not null references public.rounds(id) on delete cascade,
  bot_id uuid not null references public.bots(id) on delete cascade,
  side text not null check (side in ('UP','DOWN')),
  created_at timestamptz not null default now(),
  unique(round_id, bot_id)
);

-- balances (offchain MVP): USDC + IRON (column names still ore_*)
create table if not exists public.bot_balances (
  bot_id uuid primary key references public.bots(id) on delete cascade,
  usdc numeric not null default 0,
  ore_unrefined numeric not null default 0,
  ore_refined numeric not null default 0,
  ore_staked numeric not null default 0,
  updated_at timestamptz not null default now()
);

-- Row Level Security: lock down by default
alter table public.owners enable row level security;
alter table public.bots enable row level security;
alter table public.rounds enable row level security;
alter table public.picks enable row level security;
alter table public.bot_balances enable row level security;

-- Public read for rounds + leaderboard-ish picks (MVP). Writes require service role for now.
create policy "public read rounds" on public.rounds for select using (true);
create policy "public read picks" on public.picks for select using (true);

-- Owners/bots/balances: no direct anon access in MVP.
