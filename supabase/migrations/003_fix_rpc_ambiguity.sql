-- Fix PL/pgSQL ambiguity: output column names shadow table column names (e.g. bot_id)
-- Recreate functions with fully-qualified column references.

create or replace function public.place_pick(p_bot_id uuid, p_round_id bigint, p_side text)
returns table (
  id bigint,
  round_id bigint,
  bot_id uuid,
  side text,
  created_at timestamptz
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

  insert into public.bot_balances (bot_id) values (p_bot_id)
  on conflict (bot_id) do nothing;

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
  returning picks.id, picks.round_id, picks.bot_id, picks.side, picks.created_at
  into id, round_id, bot_id, side, created_at;

  return next;
end;
$$;

create or replace function public.settle_round(p_round_id bigint)
returns json
language plpgsql
security definer
as $$
declare
  v_round public.rounds%rowtype;
  v_total integer;
  v_winners integer;
  v_payout numeric;
begin
  select * into v_round from public.rounds r where r.id = p_round_id for update;
  if not found then
    raise exception 'Round not found';
  end if;

  if v_round.state <> 'SETTLED' then
    raise exception 'Round not settled yet';
  end if;

  if v_round.paid_out = true then
    return json_build_object('ok', true, 'roundId', p_round_id, 'paidOut', true);
  end if;

  select count(*) into v_total from public.picks p where p.round_id = p_round_id;

  if coalesce(v_round.result,'') = 'DRAW' then
    update public.bot_balances bb
      set usdc = bb.usdc + 1,
          ore_unrefined = bb.ore_unrefined + 1,
          updated_at = now()
    from public.picks p
    where p.round_id = p_round_id and p.bot_id = bb.bot_id;

    update public.rounds r set paid_out = true where r.id = p_round_id;

    return json_build_object('ok', true, 'roundId', p_round_id, 'result', v_round.result, 'participants', v_total, 'refund', 1);
  end if;

  select count(*) into v_winners from public.picks p where p.round_id = p_round_id and p.side = v_round.result;

  if v_total = 0 then
    update public.rounds r set paid_out = true where r.id = p_round_id;
    return json_build_object('ok', true, 'roundId', p_round_id, 'participants', 0);
  end if;

  if v_winners = 0 then
    update public.bot_balances bb
      set ore_unrefined = bb.ore_unrefined + 1,
          updated_at = now()
    from public.picks p
    where p.round_id = p_round_id and p.bot_id = bb.bot_id;

    update public.rounds r set paid_out = true where r.id = p_round_id;
    return json_build_object('ok', true, 'roundId', p_round_id, 'participants', v_total, 'winners', 0, 'payoutPerWinner', 0);
  end if;

  v_payout := (v_total::numeric / v_winners::numeric);

  update public.bot_balances bb
    set ore_unrefined = bb.ore_unrefined + 1,
        updated_at = now()
  from public.picks p
  where p.round_id = p_round_id and p.bot_id = bb.bot_id;

  update public.bot_balances bb
    set usdc = bb.usdc + v_payout,
        ore_unrefined = bb.ore_unrefined + 1,
        updated_at = now()
  from public.picks p
  where p.round_id = p_round_id and p.bot_id = bb.bot_id and p.side = v_round.result;

  update public.rounds r set paid_out = true where r.id = p_round_id;

  return json_build_object(
    'ok', true,
    'roundId', p_round_id,
    'result', v_round.result,
    'participants', v_total,
    'winners', v_winners,
    'payoutPerWinner', v_payout
  );
end;
$$;
