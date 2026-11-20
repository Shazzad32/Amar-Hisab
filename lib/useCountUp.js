import { useEffect, useRef, useState } from "react";
export default function useCountUp(v, d = 800) {
  const [n, setN] = useState(0); const from = useRef(0);
  useEffect(() => {
    const s = performance.now(), a = from.current; let raf;
    const t = (now) => { const p = Math.min(1, (now - s) / d); setN(a + (v - a) * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(t); else from.current = v; };
    raf = requestAnimationFrame(t); return () => cancelAnimationFrame(raf);
  }, [v, d]);
  return n;
}
