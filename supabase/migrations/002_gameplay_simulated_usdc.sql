-- Gameplay logic: simulated USDC bankroll + payouts + Ore mining

alter table public.rounds
  add column if not exists paid_out boolean not null default false;

-- Place a pick atomically and deduct 1 simulated USDC
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

  select * into v_round from public.rounds where rounds.id = p_round_id;
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

  select usdc into v_usdc from public.bot_balances where bot_id = p_bot_id;
  if v_usdc is null then v_usdc := 0; end if;

  if v_usdc < 1 then
    raise exception 'Insufficient bankroll';
  end if;

  update public.bot_balances
    set usdc = usdc - 1,
        updated_at = now()
  where bot_id = p_bot_id;

  insert into public.picks (round_id, bot_id, side)
    values (p_round_id, p_bot_id, p_side)
  returning picks.id, picks.round_id, picks.bot_id, picks.side, picks.created_at
  into id, round_id, bot_id, side, created_at;

  return next;
end;
$$;

-- Settle a round: pay winners (simulated), refund on DRAW.
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
  select * into v_round from public.rounds where rounds.id = p_round_id for update;
  if not found then
    raise exception 'Round not found';
  end if;

  if v_round.state <> 'SETTLED' then
    raise exception 'Round not settled yet';
  end if;

  if v_round.paid_out = true then
    return json_build_object('ok', true, 'roundId', p_round_id, 'paidOut', true);
  end if;

  select count(*) into v_total from public.picks where round_id = p_round_id;

  if coalesce(v_round.result,'') = 'DRAW' then
    -- refund everyone
    update public.bot_balances b
      set usdc = b.usdc + 1,
          ore_unrefined = b.ore_unrefined + 1,
          updated_at = now()
    from public.picks p
    where p.round_id = p_round_id and p.bot_id = b.bot_id;

    update public.rounds set paid_out = true where id = p_round_id;

    return json_build_object('ok', true, 'roundId', p_round_id, 'result', v_round.result, 'participants', v_total, 'refund', 1);
  end if;

  select count(*) into v_winners from public.picks where round_id = p_round_id and side = v_round.result;

  if v_total = 0 then
    update public.rounds set paid_out = true where id = p_round_id;
    return json_build_object('ok', true, 'roundId', p_round_id, 'participants', 0);
  end if;

  if v_winners = 0 then
    -- everyone lost; house keeps in real version. Here: no payout.
    update public.bot_balances b
      set ore_unrefined = b.ore_unrefined + 1,
          updated_at = now()
    from public.picks p
    where p.round_id = p_round_id and p.bot_id = b.bot_id;

    update public.rounds set paid_out = true where id = p_round_id;
    return json_build_object('ok', true, 'roundId', p_round_id, 'participants', v_total, 'winners', 0, 'payoutPerWinner', 0);
  end if;

  -- pool = v_total (since each stake is 1)
  v_payout := (v_total::numeric / v_winners::numeric);

  -- Everyone who played mines 1 Ore
  update public.bot_balances b
    set ore_unrefined = b.ore_unrefined + 1,
        updated_at = now()
  from public.picks p
  where p.round_id = p_round_id and p.bot_id = b.bot_id;

  -- Winners get payout + bonus Ore
  update public.bot_balances b
    set usdc = b.usdc + v_payout,
        ore_unrefined = b.ore_unrefined + 1,
        updated_at = now()
  from public.picks p
  where p.round_id = p_round_id and p.bot_id = b.bot_id and p.side = v_round.result;

  update public.rounds set paid_out = true where id = p_round_id;

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
