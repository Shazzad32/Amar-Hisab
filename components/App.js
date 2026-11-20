"use client";
import { useEffect, useState } from "react";
import useRemote from "@/lib/useRemote";
import { sampleData } from "@/lib/data";
import Home from "./Home"; import Transactions from "./Transactions"; import Reports from "./Reports"; import Debts from "./Debts"; import AddSheet from "./AddSheet";

export default function App({ user, logout }) {
  const [txs, setTxs, ready] = useRemote("mm_tx_v2", []);
  const [debts, setDebts] = useRemote("mm_debts_v2", []);
  const [view, setView] = useState("home"), [sheet, setSheet] = useState(null), [toast, setToast] = useState(null), [dark, setDark] = useState(true), [ev, setEv] = useState(null), [dOpen, setDOpen] = useState(false), [ios, setIos] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.dataset.theme !== "light");
    const h = (e) => { e.preventDefault(); setEv(e); }; window.addEventListener("beforeinstallprompt", h);
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent) && !navigator.standalone);
    return () => window.removeEventListener("beforeinstallprompt", h);
  }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 4000); return () => clearTimeout(t); }, [toast]);

  const say = (msg, undo) => setToast({ msg, undo });
  const go = (v) => { setView(v); window.scrollTo(0, 0); };
  const del = (t) => {
    const i = txs.findIndex((x) => x.id === t.id); setTxs((p) => p.filter((x) => x.id !== t.id));
    say("লেনদেন মুছে ফেলা হয়েছে", () => { setTxs((p) => { const c = [...p]; c.splice(Math.min(i, c.length), 0, t); return c; }); setToast(null); });
  };
  const theme = () => { const d = !dark; setDark(d); document.documentElement.dataset.theme = d ? "dark" : "light"; try { localStorage.setItem("mm_theme", d ? "dark" : "light"); } catch {} };
  const install = async () => { if (ev) { ev.prompt(); await ev.userChoice; setEv(null); } else say("Safari-তে Share বাটন চেপে “Add to Home Screen” বেছে নিন"); };
  const h = new Date().getHours(), greet = h < 5 ? "শুভ রাত্রি" : h < 12 ? "শুভ সকাল" : h < 16 ? "শুভ দুপুর" : h < 18 ? "শুভ বিকাল" : h < 20 ? "শুভ সন্ধ্যা" : "শুভ রাত্রি";
  if (!ready) return null;

  return (
    <>
      <header className="top">
        <div className="who"><span className="av0">{user.name[0]}</span><div><small>{greet}</small><h2 style={{ fontSize: 19 }}>{user.name}</h2></div></div>
        <div>
          {(ev || ios) && <button className="ib" onClick={install} title="অ্যাপ ইনস্টল">📲</button>}
          <button className="ib" onClick={theme} title="থিম">{dark ? "☀" : "🌙"}</button><button className="ib" onClick={logout} title="লগআউট">⎋</button>
        </div>
      </header>
      <main>
        {view === "home" && <Home txs={txs} onAdd={setSheet} onDebt={() => { go("debt"); setDOpen(true); }} seeAll={() => go("tx")} del={del} sample={() => setTxs(sampleData())} />}
        {view === "tx" && <Transactions txs={txs} del={del} />}
        {view === "rep" && <Reports txs={txs} />}
        {view === "debt" && <Debts debts={debts} setDebts={setDebts} open={dOpen} onDone={() => setDOpen(false)} say={say} />}
      </main>
      <nav className="dk">
        {[["home", "🏠", "হোম"], ["tx", "📒", "লেনদেন"]].map(([k, i, l]) => <button key={k} className={view === k ? "on" : ""} onClick={() => go(k)}><b>{i}</b>{l}</button>)}
        <button className="fab" onClick={() => (view === "debt" ? setDOpen(true) : setSheet("expense"))}>＋</button>
        {[["rep", "📊", "রিপোর্ট"], ["debt", "🤝", "ধার-দেনা"]].map(([k, i, l]) => <button key={k} className={view === k ? "on" : ""} onClick={() => go(k)}><b>{i}</b>{l}</button>)}
      </nav>
      {toast && <div id="toast">{toast.msg}{toast.undo && <button onClick={toast.undo}>পূর্বাবস্থায়</button>}</div>}
      {sheet && <AddSheet type={sheet} onClose={() => setSheet(null)} onSave={(t) => { setTxs((p) => [t, ...p]); setSheet(null); say("সংরক্ষিত হয়েছে ✓"); }} />}
    </>
  );
}
