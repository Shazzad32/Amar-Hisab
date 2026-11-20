"use client";
import { useMemo, useState } from "react";
import TxRow from "./TxRow";
import { cmp, dayLabel, fmt } from "@/lib/data";

export default function Transactions({ txs, del }) {
  const [q, setQ] = useState(""), [f, setF] = useState("all"), [m, setM] = useState("");
  const groups = useMemo(() => {
    const l = txs.filter((t) => (f === "all" || t.type === f) && (!m || t.date.startsWith(m)) && ((t.note || "") + (t.cat || "") + t.acct + (t.to || "")).toLowerCase().includes(q.toLowerCase())).sort(cmp).slice(0, 150), g = [];
    l.forEach((t) => { const x = g[g.length - 1]; x && x.d === t.date ? x.items.push(t) : g.push({ d: t.date, items: [t] }); }); return g;
  }, [txs, q, f, m]);
  return (
    <section>
      <div className="sec" style={{ marginTop: 14 }}><h2>লেনদেন</h2></div>
      <input className="inp" placeholder="🔍 খুঁজুন..." value={q} onChange={(e) => setQ(e.target.value)} style={{ marginBottom: 10 }} />
      <div className="row" style={{ flexWrap: "nowrap" }}>
        <div className="seg" style={{ flex: 1 }}>{[["all", "সব"], ["income", "আয়"], ["expense", "ব্যয়"], ["transfer", "ট্রান্সফার"]].map(([k, l]) => <button key={k} className={f === k ? "on" : ""} onClick={() => setF(k)}>{l}</button>)}</div>
        <input type="month" className="inp" style={{ width: "auto" }} value={m} onChange={(e) => setM(e.target.value)} />
      </div>
      {groups.length === 0 ? <div className="empty"><div style={{ fontSize: 34 }}>🧾</div>কোনো লেনদেন পাওয়া যায়নি</div> : groups.map((g) => {
        const n = g.items.reduce((s, t) => s + (t.type === "income" ? t.amount : t.type === "expense" ? -t.amount : 0), 0);
        return (<div key={g.d}><div className="gh"><span>{dayLabel(g.d)}</span><span>{n < 0 ? "−" : n > 0 ? "+" : ""}{fmt(Math.abs(n))}</span></div><div className="card" style={{ padding: 6 }}>{g.items.map((t) => <TxRow key={t.id} t={t} del={del} />)}</div></div>);
      })}
    </section>
  );
}
