import { useEffect, useState } from "react";
export default function useLocal(key, init) {
  const [v, setV] = useState(init);
  const [ready, setReady] = useState(false);
  useEffect(() => { try { const s = localStorage.getItem(key); if (s) setV(JSON.parse(s)); } catch {} setReady(true); }, [key]);
  useEffect(() => { if (ready) try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [v, ready, key]);
  return [v, setV, ready];
}
