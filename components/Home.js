"use client";
import TxRow from "./TxRow";
import useCountUp from "@/lib/useCountUp";
import { AC, fmt, sum, bal, iso, parse, addD, today, cmp } from "@/lib/data";

export default function Home({ txs, onAdd, onDebt, seeAll, del, sample }) {
  const t = parse(today()), m1 = iso(new Date(t.getFullYear(), t.getMonth(), 1)), R = txs.filter((x) => !x.open && x.date >= m1);
  const inc = sum(R, "income"), exp = sum(R, "expense"), tot = AC.reduce((s, a) => s + bal(txs, a[0]), 0), shown = useCountUp(tot);
  const sp = [...Array(14)].map((_, i) => { const d = iso(addD(t, i - 13)); return txs.filter((x) => x.date === d && x.type === "expense").reduce((s, x) => s + x.amount, 0); }), mx = Math.max(1, ...sp);
  const recent = [...txs].sort(cmp).slice(0, 6);
  return (
    <section>
      <div className="hero">
        <div className="hl">মোট ব্যালেন্স</div>
        <div className="hb">{(shown < 0 ? "−" : "") + fmt(Math.abs(shown))}</div>
        <div className="hrow">
          <div><small>এই মাসে আয়</small><b style={{ color: "#6ee7b7" }}>+{fmt(inc)}</b></div>
          <div><small>এই মাসে ব্যয়</small><b style={{ color: "#fda4af" }}>−{fmt(exp)}</b></div>
          <div className="sp" title="গত ১৪ দিনের ব্যয়">{sp.map((v, i) => <i key={i} style={{ height: Math.max(4, (v / mx) * 40) }} />)}</div>
        </div>
      </div>
      <div className="sec"><h3>অ্যাকাউন্টসমূহ</h3></div>
      <div className="acs">{AC.map((a) => <div key={a[0]} className="ac"><span>{a[1]}</span><small>{a[0]}</small><b>{fmt(bal(txs, a[0]))}</b></div>)}</div>
      <div className="qa">
        <button onClick={() => onAdd("expense")}><i>➖</i>ব্যয়</button><button onClick={() => onAdd("income")}><i>➕</i>আয়</button>
        <button onClick={() => onAdd("transfer")}><i>🔁</i>ট্রান্সফার</button><button onClick={onDebt}><i>🤝</i>ধার</button>
      </div>
      <div className="sec"><h3>সাম্প্রতিক লেনদেন</h3>{recent.length > 0 && <button className="lnk" onClick={seeAll}>সব দেখুন ›</button>}</div>
      {recent.length === 0 ? (
        <div className="card empty"><div style={{ fontSize: 34 }}>🧾</div>এখনো কোনো লেনদেন নেই<br />নিচের “＋” বাটন চেপে প্রথম লেনদেন যোগ করুন<br /><button className="btn" style={{ marginTop: 14 }} onClick={sample}>নমুনা ডেটা দিয়ে দেখুন</button></div>
      ) : <div className="card" style={{ padding: 8 }}>{recent.map((t) => <TxRow key={t.id} t={t} del={del} />)}</div>}
    </section>
  );
}
