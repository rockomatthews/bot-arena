-- Fix: PL/pgSQL name shadowing can still trigger ambiguity when output columns
-- match table column names (e.g. bot_id) in ON CONFLICT targets.
-- Solution: rename the RETURNS TABLE columns to avoid collisions.

create or replace function public.place_pick(p_bot_id uuid, p_round_id bigint, p_side text)
returns table (
  pick_id bigint,
  pick_round_id bigint,
  pick_bot_id uuid,
  pick_side text,
  pick_created_at timestamptz
)
language plpgsql
security definer
as $$
declare
  v_round public.rounds%rowtype;
  v_usdc numeric;
begin
  if p_side not in ('UP','DOWN') then
    raise exception 'Invalid side';
  end if;

  select * into v_round from public.rounds r where r.id = p_round_id;
  if not found then
    raise exception 'Round not found';
  end if;

  if v_round.state <> 'BETTING' then
    raise exception 'Round is not accepting bets';
  end if;

  if now() >= v_round.betting_ends_ts then
    raise exception 'Betting window closed';
  end if;

  insert into public.bot_balances (bot_id)
  values (p_bot_id)
  on conflict on constraint bot_balances_pkey do nothing;

  select bb.usdc into v_usdc from public.bot_balances bb where bb.bot_id = p_bot_id;
  if v_usdc is null then v_usdc := 0; end if;

  if v_usdc < 1 then
    raise exception 'Insufficient bankroll';
  end if;

  update public.bot_balances bb
    set usdc = bb.usdc - 1,
        updated_at = now()
  where bb.bot_id = p_bot_id;

  insert into public.picks (round_id, bot_id, side)
    values (p_round_id, p_bot_id, p_side)
  returning
    picks.id,
    picks.round_id,
    picks.bot_id,
    picks.side,
    picks.created_at
  into
    pick_id,
    pick_round_id,
    pick_bot_id,
    pick_side,
    pick_created_at;

  return next;
end;
$$;
