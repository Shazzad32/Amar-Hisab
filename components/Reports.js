"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { CM, fmt, bn, iso, today, parse } from "@/lib/data";
import { RL, rangeOf, autoG, days, compute, blab, full } from "@/lib/report";

function Bars({ B, g, cw }) {
  const mx = Math.max(1, ...B.flatMap((x) => [x.inc, x.exp])), W = Math.max(cw, B.length * 34), H = 170, sw = W / B.length, bw = Math.min(12, sw / 2 - 3), step = Math.ceil(B.length / Math.floor(W / 46));
  return (
    <div className="scr"><svg viewBox={`0 0 ${W} ${H + 26}`} width={W} height={H + 26} style={{ display: "block" }}>
      {[0, 0.5, 1].map((f) => <line key={f} x1="0" x2={W} y1={H - f * (H - 10)} y2={H - f * (H - 10)} stroke="var(--bd)" strokeDasharray="3 4" />)}
      {B.map((x, i) => { const cx = i * sw + sw / 2, h1 = (x.inc / mx) * (H - 10), h2 = (x.exp / mx) * (H - 10); return (
        <g key={x.k}>
          <rect x={cx - bw - 1} y={H - h1} width={bw} height={h1} rx="3" fill="var(--g)"><title>{`${blab(x, g, 1)} • আয় ${fmt(x.inc)}`}</title></rect>
          <rect x={cx + 1} y={H - h2} width={bw} height={h2} rx="3" fill="var(--r)"><title>{`${blab(x, g, 1)} • ব্যয় ${fmt(x.exp)}`}</title></rect>
          {i % step === 0 && <text x={cx} y={H + 17} textAnchor="middle" fontSize="11" fill="var(--mut)">{blab(x, g)}</text>}
        </g>); })}
    </svg></div>
  );
}

export default function Reports({ txs }) {
  const n0 = new Date();
  const [rk, setRk] = useState("month"), [gb, setGb] = useState("day"), [rf, setRf] = useState(iso(new Date(n0.getFullYear(), n0.getMonth(), 1))), [rt, setRt] = useState(today());
  const ref = useRef(), [w, setW] = useState(320);
  useEffect(() => { const f = () => setW((ref.current?.clientWidth || 358) - 38); f(); window.addEventListener("resize", f); return () => window.removeEventListener("resize", f); }, []);
  const pick = (k, f = rf, t = rt) => { setRk(k); setGb(autoG(days(...rangeOf(k, f, t)))); };
  const d = useMemo(() => compute(txs, rk, gb, rf, rt), [txs, rk, gb, rf, rt]);
  const C = 2 * Math.PI * 40; let off = 0;
  const csv = () => {
    const r = [["তারিখ", "ধরন", "ক্যাটাগরি", "অ্যাকাউন্ট", "পরিমাণ", "নোট"], ...d.R.map((t) => [t.date, t.type === "income" ? "আয়" : t.type === "expense" ? "ব্যয়" : "ট্রান্সফার", t.cat || "", t.acct + (t.to ? " → " + t.to : ""), t.amount, '"' + (t.note || "") + '"'])];
    const l = document.createElement("a"); l.href = URL.createObjectURL(new Blob(["\uFEFF" + r.map((x) => x.join(",")).join("\n")], { type: "text/csv" })); l.download = "report.csv"; l.click();
  };
  return (
    <section ref={ref}>
      <div className="sec" style={{ marginTop: 14 }}><div><h2>রিপোর্ট</h2><small>{full(d.a)} – {full(d.b)} • {bn(d.n)} দিন</small></div><button className="btn" onClick={csv}>⬇ CSV</button></div>
      <div className="rc">{RL.map(([k, l]) => <button key={k} className={rk === k ? "on" : ""} onClick={() => pick(k)}>{l}</button>)}</div>
      {rk === "custom" && <div className="two" style={{ marginBottom: 12 }}>
        <label className="lbl">শুরু<input className="inp" type="date" value={rf} onChange={(e) => { setRf(e.target.value); pick("custom", e.target.value, rt); }} /></label>
        <label className="lbl">শেষ<input className="inp" type="date" value={rt} onChange={(e) => { setRt(e.target.value); pick("custom", rf, e.target.value); }} /></label></div>}
      <div className="seg" style={{ marginBottom: 14 }}>{[["day", "দৈনিক"], ["week", "সাপ্তাহিক"], ["month", "মাসিক"]].map(([k, l]) => <button key={k} className={gb === k ? "on" : ""} onClick={() => setGb(k)}>{l}</button>)}</div>
      {d.R.length === 0 ? <div className="empty"><div style={{ fontSize: 34 }}>📊</div>এই সময়ে কোনো লেনদেন নেই</div> : (
        <>
          <div className="tl">
            <div className="card"><small>মোট আয়</small><b className="inc">{fmt(d.inc)}</b></div><div className="card"><small>মোট ব্যয়</small><b className="exp">{fmt(d.exp)}</b></div>
            <div className="card"><small>সঞ্চয় • {bn(d.rate)}%</small><b style={{ color: d.net < 0 ? "var(--r)" : "var(--g)" }}>{d.net < 0 ? "−" : ""}{fmt(Math.abs(d.net))}</b></div>
            <div className="card"><small>দৈনিক গড় ব্যয়</small><b>{fmt(d.exp / d.n)}</b></div>
          </div>
          <div className="card" style={{ marginTop: 12 }}>
            <div className="row" style={{ justifyContent: "space-between" }}><h3>আয় বনাম ব্যয়</h3><div className="leg2"><span><i style={{ background: "var(--g)" }} />আয়</span><span><i style={{ background: "var(--r)" }} />ব্যয়</span></div></div>
            <div style={{ marginTop: 14 }}><Bars B={d.B} g={gb} cw={w} /></div>
          </div>
          {d.exp > 0 && (
            <div className="card" style={{ marginTop: 12 }}><h3>কোথায় খরচ হলো</h3>
              <svg viewBox="0 0 120 120" style={{ width: 170, display: "block", margin: "10px auto 0" }}>
                {d.cs.map(([k, v]) => { const l = (v / d.exp) * C, o = off; off += l; return <circle key={k} r="40" cx="60" cy="60" fill="none" stroke={(CM[k] || [0, "#95a5a6"])[1]} strokeWidth="16" strokeDasharray={`${Math.max(l - 1.5, 0)} ${C}`} strokeDashoffset={-o} transform="rotate(-90 60 60)" />; })}
                <text x="60" y="58" textAnchor="middle" fontSize="7" fill="var(--mut)">মোট ব্যয়</text><text x="60" y="70" textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--tx)">{fmt(d.exp)}</text>
              </svg>
              <ul className="cl">{d.cs.slice(0, 8).map(([k, v]) => { const m = CM[k] || ["🏷", "#95a5a6"], p = Math.round((v / d.exp) * 100); return (
                <li key={k}><span className="ci" style={{ width: 34, height: 34, borderRadius: 11, fontSize: 15, background: m[1] + "22" }}>{m[0]}</span>
                  <div><div className="row" style={{ justifyContent: "space-between" }}><span>{k}</span><small>{bn(p)}%</small></div><div className="bar"><i style={{ width: p + "%", background: m[1] }} /></div></div><b>{fmt(v)}</b></li>); })}</ul>
            </div>)}
          <div className="card" style={{ marginTop: 12 }}><h3 style={{ marginBottom: 6 }}>বিশেষ তথ্য</h3>
            {d.pk && <div className="hi2"><span>সবচেয়ে বেশি খরচের দিন</span><b>{full(parse(d.pk[0]))} • {fmt(d.pk[1])}</b></div>}
            {d.big && <div className="hi2"><span>সবচেয়ে বড় ব্যয়</span><b>{d.big.note || d.big.cat} • {fmt(d.big.amount)}</b></div>}
            <div className="hi2"><span>মোট লেনদেন</span><b>{bn(d.R.length)} টি</b></div></div>
          <div className="card" style={{ marginTop: 12 }}><h3 style={{ marginBottom: 8 }}>{{ day: "দৈনিক", week: "সাপ্তাহিক", month: "মাসিক" }[gb]} বিবরণ</h3>
            <div className="trw h"><span>সময়</span><span>আয়</span><span>ব্যয়</span><span>নিট</span></div>
            {[...d.B].filter((x) => x.inc || x.exp).reverse().slice(0, 40).map((x) => { const n = x.inc - x.exp; return (
              <div key={x.k} className="trw"><span>{blab(x, gb, 1)}</span><span className="inc">{fmt(x.inc)}</span><span className="exp">{fmt(x.exp)}</span><b style={{ color: n < 0 ? "var(--r)" : "var(--g)" }}>{n < 0 ? "−" : ""}{fmt(Math.abs(n))}</b></div>); })}
          </div>
        </>)}
    </section>
  );
}
