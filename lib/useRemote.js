import { useEffect, useRef, useState } from "react";

const push = (key, value) =>
  fetch(`/api/store/${key}`, {
    method: "PUT", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value }), keepalive: true,
  });

// MongoDB-তে সংরক্ষণ; localStorage থাকে cache/offline কপি হিসেবে
export default function useRemote(key, init) {
  const [v, setV] = useState(init);
  const [ready, setReady] = useState(false);
  const synced = useRef(false);   // সার্ভার থেকে সফলভাবে লোড হয়েছে কি না
  const last = useRef("");        // শেষবার সার্ভারে যা আছে
  const timer = useRef(null);

  useEffect(() => {
    let off = false;
    (async () => {
      let local; try { const s = localStorage.getItem(key); if (s) local = JSON.parse(s); } catch {}
      try {
        const r = await fetch(`/api/store/${key}`, { cache: "no-store" });
        if (!r.ok) throw new Error("load failed");
        const { value } = await r.json();
        if (off) return;
        if (value != null) { setV(value); last.current = JSON.stringify(value); }
        else if (local != null) { setV(local); await push(key, local); last.current = JSON.stringify(local); } // আগের localStorage ডেটা প্রথমবার মাইগ্রেট
        synced.current = true;
      } catch { if (!off && local != null) setV(local); }
      if (!off) setReady(true);
    })();
    return () => { off = true; };
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    const s = JSON.stringify(v);
    try { localStorage.setItem(key, s); } catch {}
    if (!synced.current || s === last.current) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { push(key, v).then((r) => { if (r.ok) last.current = s; }).catch(() => {}); }, 400);
  }, [v, ready, key]);

  return [v, setV, ready];
}
