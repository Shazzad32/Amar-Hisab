import { iso, parse, addD, pad, bn } from "./data";
export const RL = [["today","আজ"],["week","এই সপ্তাহ"],["7d","৭ দিন"],["month","এই মাস"],["lm","গত মাস"],["3m","৩ মাস"],["year","এই বছর"],["custom","কাস্টম"]];
export const wk = (d) => addD(d, -((d.getDay() + 1) % 7));
export const days = (a, b) => Math.round((b - a) / 864e5) + 1;
export const autoG = (n) => (n <= 31 ? "day" : n <= 140 ? "week" : "month");
export function rangeOf(k, f, t2) {
  const t = parse(iso(new Date())), y = t.getFullYear(), m = t.getMonth(); let a, b = t;
  if (k === "today") a = t; else if (k === "week") a = wk(t); else if (k === "7d") a = addD(t, -6); else if (k === "month") a = new Date(y, m, 1);
  else if (k === "lm") { a = new Date(y, m - 1, 1); b = new Date(y, m, 0); } else if (k === "3m") a = new Date(y, m - 2, 1); else if (k === "year") a = new Date(y, 0, 1);
  else { a = parse(f || iso(t)); b = parse(t2 || iso(t)); if (a > b) { const x = a; a = b; b = x; } }
  return [a, b];
}
const bk = (d, g) => (g === "day" ? iso(d) : g === "week" ? iso(wk(d)) : d.getFullYear() + "-" + pad(d.getMonth() + 1));
function buckets(a, b, g) {
  const o = []; let d = g === "week" ? wk(a) : g === "month" ? new Date(a.getFullYear(), a.getMonth(), 1) : new Date(a);
  while (d <= b) { o.push({ k: bk(d, g), d: new Date(d), inc: 0, exp: 0 }); d = g === "day" ? addD(d, 1) : g === "week" ? addD(d, 7) : new Date(d.getFullYear(), d.getMonth() + 1, 1); }
  return o;
}
const MS = (d) => d.toLocaleDateString("bn-BD", { month: "short" }), DN = (d) => bn(d.getDate());
export const full = (d) => DN(d) + " " + MS(d) + " " + bn(d.getFullYear());
export const blab = (x, g, f) => g === "day" ? (f ? DN(x.d) + " " + MS(x.d) : DN(x.d)) : g === "week" ? (f ? DN(x.d) + " " + MS(x.d) + " – " + DN(addD(x.d, 6)) + " " + MS(addD(x.d, 6)) : DN(x.d) + " " + MS(x.d)) : (f ? x.d.toLocaleDateString("bn-BD", { month: "long", year: "numeric" }) : MS(x.d));
export function compute(txs, k, g, f, t2) {
  const [a, b] = rangeOf(k, f, t2), A = iso(a), Z = iso(b), n = days(a, b), R = txs.filter((t) => !t.open && t.date >= A && t.date <= Z), B = buckets(a, b, g), map = {};
  B.forEach((x) => (map[x.k] = x)); let inc = 0, exp = 0, big = null; const cat = {}, dx = {};
  R.forEach((t) => {
    if (t.type === "transfer") return; const x = map[bk(parse(t.date), g)];
    if (t.type === "income") { inc += t.amount; if (x) x.inc += t.amount; }
    else { exp += t.amount; if (x) x.exp += t.amount; cat[t.cat] = (cat[t.cat] || 0) + t.amount; dx[t.date] = (dx[t.date] || 0) + t.amount; if (!big || t.amount > big.amount) big = t; }
  });
  const cs = Object.entries(cat).sort((x, y) => y[1] - x[1]), pk = Object.entries(dx).sort((x, y) => y[1] - x[1])[0];
  return { a, b, n, R, B, inc, exp, net: inc - exp, rate: inc > 0 ? Math.max(0, Math.round(((inc - exp) / inc) * 100)) : 0, cs, pk, big };
}
