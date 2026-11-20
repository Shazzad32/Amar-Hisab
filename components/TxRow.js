import { CM, fmt } from "@/lib/data";
export default function TxRow({ t, del }) {
  const tr = t.type === "transfer", inc = t.type === "income", m = tr ? ["🔁", "#8d95ab"] : CM[t.cat] || ["🏷", "#95a5a6"];
  return (
    <div className="tr">
      <span className="ci" style={{ background: m[1] + "22", color: m[1] }}>{m[0]}</span>
      <div className="tm"><b>{t.note || t.cat || "ট্রান্সফার"}</b><small>{tr ? `${t.acct} → ${t.to}` : `${t.cat} • ${t.acct}`}</small></div>
      <b className={tr ? "" : inc ? "inc" : "exp"}>{tr ? "" : inc ? "+" : "−"}{fmt(t.amount)}</b>
      <button className="x" onClick={() => del(t)} aria-label="মুছুন">✕</button>
    </div>
  );
}
