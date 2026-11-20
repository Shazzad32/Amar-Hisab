"use client";
import { useEffect, useMemo, useState } from "react";
import { fmt, bn, today, uid } from "@/lib/data";

const rem = (d) => d.amount - d.payments.reduce((s, p) => s + p.amount, 0);
const dfmt = (s) => new Date(s).toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" });
const Modal = ({ title, onClose, children }) => (
  <div className="modal open" onClick={onClose}><div className="card" onClick={(e) => e.stopPropagation()}>
    <div className="row" style={{ justifyContent: "space-between", marginBottom: 14 }}><h3>{title}</h3><button className="x" onClick={onClose}>✕</button></div>{children}</div></div>
);

function DebtForm({ people, onSave, onClose }) {
  const [f, setF] = useState({ dir: "lent", person: "", amount: "", date: today(), due: "", note: "" }), set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  return (
    <Modal title="নতুন ধার / দেনা" onClose={onClose}>
      <div style={{ display: "grid", gap: 12 }}>
        <div className="seg">{[["lent", "আমি দিয়েছি (পাবো)"], ["borrowed", "আমি নিয়েছি (দেব)"]].map(([k, l]) => <button key={k} className={f.dir === k ? "on" : ""} onClick={() => set("dir", k)}>{l}</button>)}</div>
        <input className="inp" list="ppl" placeholder="ব্যক্তির নাম" value={f.person} onChange={(e) => set("person", e.target.value)} autoFocus />
        <datalist id="ppl">{people.map((p) => <option key={p} value={p} />)}</datalist>
        <input className="inp" type="number" inputMode="decimal" min="1" placeholder="পরিমাণ (৳)" value={f.amount} onChange={(e) => set("amount", e.target.value)} style={{ fontSize: 18, fontWeight: 600 }} />
        <div className="two"><label className="lbl">তারিখ<input className="inp" type="date" value={f.date} onChange={(e) => set("date", e.target.value)} /></label><label className="lbl">ফেরতের তারিখ<input className="inp" type="date" value={f.due} onChange={(e) => set("due", e.target.value)} /></label></div>
        <input className="inp" placeholder="নোট (ঐচ্ছিক)" value={f.note} onChange={(e) => set("note", e.target.value)} />
        <button className="btn pri" style={{ padding: 12 }} disabled={!f.person.trim() || !(+f.amount > 0)} onClick={() => onSave({ id: uid(), ...f, person: f.person.trim(), amount: +f.amount, payments: [] })}>সংরক্ষণ করুন</button>
      </div>
    </Modal>
  );
}

function PayForm({ d, onSave, onClose }) {
  const [a, setA] = useState(rem(d)), [date, setDate] = useState(today());
  return (
    <Modal title={d.dir === "lent" ? `${d.person} থেকে ফেরত পেলাম` : `${d.person}-কে পরিশোধ করলাম`} onClose={onClose}>
      <p className="sub">বাকি আছে: <b>{fmt(rem(d))}</b></p>
      <div style={{ display: "grid", gap: 12, marginTop: 10 }}>
        <input className="inp" type="number" min="1" max={rem(d)} value={a} onChange={(e) => setA(e.target.value)} style={{ fontSize: 18, fontWeight: 600 }} autoFocus />
        <input className="inp" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button className="btn pri" style={{ padding: 12 }} disabled={!(+a > 0)} onClick={() => onSave({ id: uid(), amount: Math.min(+a, rem(d)), date })}>নিশ্চিত করুন</button>
      </div>
    </Modal>
  );
}

export default function Debts({ debts, setDebts, open, onDone, say }) {
  const [flt, setFlt] = useState("open"), [q, setQ] = useState(""), [m, setM] = useState(null), TD = today();
  useEffect(() => { if (open) { setM({ k: "add" }); onDone(); } }, [open]); // eslint-disable-line
  const recv = debts.filter((d) => d.dir === "lent").reduce((s, d) => s + rem(d), 0), pay = debts.filter((d) => d.dir === "borrowed").reduce((s, d) => s + rem(d), 0), net = recv - pay;
  const people = useMemo(() => [...new Set(debts.map((d) => d.person))], [debts]);
  const chips = useMemo(() => { const o = {}; debts.forEach((d) => (o[d.person] = (o[d.person] || 0) + (d.dir === "lent" ? 1 : -1) * rem(d))); return Object.entries(o).filter((e) => e[1]).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])); }, [debts]);
  const list = debts.filter((d) => (flt === "all" || (flt === "open" && rem(d) > 0) || (flt === "done" && rem(d) <= 0) || flt === d.dir) && (d.person + d.note).toLowerCase().includes(q.toLowerCase())).sort((a, b) => (rem(b) > 0) - (rem(a) > 0) || b.date.localeCompare(a.date));
  const addPay = (id, p) => { setDebts((l) => l.map((d) => (d.id === id ? { ...d, payments: [...d.payments, p] } : d))); say("আপডেট হয়েছে ✓"); };
  const pd = m?.k === "pay" ? debts.find((d) => d.id === m.id) : null;
  return (
    <section>
      <div className="sec" style={{ marginTop: 14 }}><div><h2>ধার-দেনা</h2><small>কে কত পাবে, কাকে কত দেবেন</small></div><button className="btn pri" onClick={() => setM({ k: "add" })}>＋ নতুন</button></div>
      <section className="cards3">
        <div className="card stat"><div className="top"><span>আমি পাবো</span><span className="ico" style={{ background: "var(--gb)", color: "var(--g)" }}>↙</span></div><b>{fmt(recv)}</b></div>
        <div className="card stat"><div className="top"><span>আমি দেব</span><span className="ico" style={{ background: "var(--rb)", color: "var(--r)" }}>↗</span></div><b>{fmt(pay)}</b></div>
        <div className="card stat main"><div className="top"><span>নিট অবস্থা</span><span className="ico">⚖</span></div><b>{net < 0 ? "−" : ""}{fmt(Math.abs(net))}</b></div>
      </section>
      {chips.length > 0 && <div className="chips">{chips.map(([p, v]) => <span key={p} className={`chip ${v > 0 ? "g" : "rr"}`}>{p}: {v > 0 ? "পাবো" : "দেব"} <b>{fmt(Math.abs(v))}</b></span>)}</div>}
      <div className="row" style={{ marginBottom: 14, flexWrap: "nowrap" }}>
        <input className="inp" placeholder="খুঁজুন..." value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: 1, minWidth: 90 }} />
        <div className="seg" style={{ overflowX: "auto" }}>{[["open", "বাকি"], ["lent", "পাবো"], ["borrowed", "দেব"], ["done", "শোধ"], ["all", "সব"]].map(([k, l]) => <button key={k} className={flt === k ? "on" : ""} onClick={() => setFlt(k)}>{l}</button>)}</div>
      </div>
      {list.length === 0 ? <div className="empty"><div style={{ fontSize: 34 }}>🤝</div>কোনো ধার-দেনা নেই</div> : (
        <ul className="dl">{list.map((d) => {
          const r = rem(d), l = d.dir === "lent", c = l ? "g" : "r", late = r > 0 && d.due && d.due < TD, pct = 100 - (r / d.amount) * 100;
          return (
            <li key={d.id} className="card dc">
              <div className="h"><span className="av" style={{ background: `var(--${l ? "gb" : "rb"})`, color: `var(--${c})` }}>{d.person[0]}</span>
                <div style={{ flex: 1, minWidth: 0 }}><b>{d.person}</b><br /><small className="sub">{d.note || "—"} • {dfmt(d.date)}</small></div>
                <div style={{ textAlign: "right" }}><b style={{ color: r > 0 ? `var(--${c})` : "var(--mut)" }}>{fmt(r)}</b><br /><small className="sub">মোট {fmt(d.amount)}</small></div></div>
              <div className="pb"><i style={{ width: pct + "%", background: `var(--${c})` }} /></div>
              <div className="tg">
                <span style={{ background: `var(--${l ? "gb" : "rb"})`, color: `var(--${c})` }}>{l ? "আমি পাবো" : "আমি দেব"}</span>
                {r <= 0 && <span>✓ পরিশোধিত</span>}
                {d.due && r > 0 && <span className={late ? "late" : ""}>📅 {late ? "মেয়াদ পেরিয়েছে • " : "ফেরত: "}{dfmt(d.due)}</span>}
                {r > 0 && <button className="pay" onClick={() => setM({ k: "pay", id: d.id })}>{l ? "ফেরত পেলাম" : "পরিশোধ করলাম"}</button>}
                <button className="x" style={r > 0 ? {} : { marginLeft: "auto" }} onClick={() => { if (confirm("মুছে ফেলবেন?")) setDebts((x) => x.filter((y) => y.id !== d.id)); }}>🗑</button>
              </div>
              {d.payments.length > 0 && <details><summary>লেনদেনের ইতিহাস ({bn(d.payments.length)})</summary><ul style={{ listStyle: "none", padding: 0 }}>{d.payments.map((p) => <li key={p.id}><span>{dfmt(p.date)}</span><b>{fmt(p.amount)}</b></li>)}</ul></details>}
            </li>);
        })}</ul>)}
      {m?.k === "add" && <DebtForm people={people} onClose={() => setM(null)} onSave={(d) => { setDebts((l) => [d, ...l]); setM(null); say("ধার-দেনা যোগ হয়েছে ✓"); }} />}
      {pd && <PayForm d={pd} onClose={() => setM(null)} onSave={(p) => { addPay(pd.id, p); setM(null); }} />}
    </section>
  );
}
