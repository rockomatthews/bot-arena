export async function fetchCoinbaseBTCUSD() {
  const res = await fetch("https://api.exchange.coinbase.com/products/BTC-USD/ticker", {
    headers: { "user-agent": "bot-arena" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Coinbase ticker failed: ${res.status}`);
  const j = await res.json();
  const price = Number(j.price);
  if (!Number.isFinite(price)) throw new Error("Bad Coinbase price");
  return price;
}
