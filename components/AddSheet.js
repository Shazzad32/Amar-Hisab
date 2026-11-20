"use client";
import { useState } from "react";
import { EX, IN, AC, today, uid } from "@/lib/data";

export default function AddSheet({ type, onSave, onClose }) {
  const [f, setF] = useState({ type, cat: type === "income" ? "বেতন" : "খাবার", acct: "নগদ টাকা", to: "ব্যাংক", date: today(), a: "", note: "", open: false });
  const [err, setErr] = useState("");
  const set = (k, v) => setF((p) => ({ ...p, [k]: v })), cats = f.type === "income" ? IN : EX;
  const save = () => {
    const a = +f.a; if (!(a > 0)) return setErr("পরিমাণ লিখুন");
    if (f.type === "transfer" && f.acct === f.to) return setErr("দুটি অ্যাকাউন্ট আলাদা হতে হবে");
    const op = f.type === "income" && f.open;
    onSave({ id: uid(), ts: Date.now(), type: f.type, amount: a, cat: f.type === "transfer" ? "" : op ? "অন্যান্য আয়" : f.cat, acct: f.acct, to: f.type === "transfer" ? f.to : undefined, date: f.date || today(), note: op ? f.note || "প্রারম্ভিক ব্যালেন্স" : f.note, open: op || undefined });
  };
  const opts = AC.map((a) => <option key={a[0]}>{a[0]}</option>);
  return (
    <div className="modal open" onClick={onClose}><div className="card" onClick={(e) => e.stopPropagation()}>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 14 }}><h3>নতুন লেনদেন</h3><button className="x" onClick={onClose}>✕</button></div>
      <div className="seg">{[["expense", "ব্যয়"], ["income", "আয়"], ["transfer", "ট্রান্সফার"]].map(([k, l]) => <button key={k} className={f.type === k ? "on" : ""} onClick={() => setF((p) => ({ ...p, type: k, cat: k === "income" ? "বেতন" : "খাবার" }))}>{l}</button>)}</div>
      <div className="amt"><span>৳</span><input type="number" inputMode="decimal" min="1" placeholder="০" value={f.a} onChange={(e) => set("a", e.target.value)} autoFocus /></div>
      {f.type === "transfer" ? (
        <div className="two" style={{ margin: "14px 0" }}>
          <label className="lbl">কোথা থেকে<select className="inp" value={f.acct} onChange={(e) => set("acct", e.target.value)}>{opts}</select></label>
          <label className="lbl">কোথায়<select className="inp" value={f.to} onChange={(e) => set("to", e.target.value)}>{opts}</select></label></div>
      ) : (
        <>
          <div className="cg">{cats.map((c) => <button key={c[0]} className={f.cat === c[0] ? "on" : ""} onClick={() => set("cat", c[0])}><i style={{ background: c[2] + "22" }}>{c[1]}</i>{c[0]}</button>)}</div>
          <label className="lbl" style={{ display: "block", marginBottom: 12 }}>অ্যাকাউন্ট<select className="inp" value={f.acct} onChange={(e) => set("acct", e.target.value)}>{opts}</select></label>
        </>)}
      <div className="two"><label className="lbl">তারিখ<input className="inp" type="date" max={today()} value={f.date} onChange={(e) => set("date", e.target.value)} /></label>
        <label className="lbl">নোট<input className="inp" placeholder="ঐচ্ছিক" value={f.note} onChange={(e) => set("note", e.target.value)} /></label></div>
      {f.type === "income" && <label className="lbl" style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}><input type="checkbox" checked={f.open} onChange={(e) => set("open", e.target.checked)} />এটা প্রারম্ভিক ব্যালেন্স (রিপোর্টে আয় হিসেবে ধরা হবে না)</label>}
      {err && <p className="hint err" style={{ margin: "10px 0 0" }}>{err}</p>}
      <button className="btn pri big" onClick={save}>সংরক্ষণ করুন</button>
    </div></div>
  );
}
