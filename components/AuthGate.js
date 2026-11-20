"use client";
import { useEffect, useState } from "react";
const hash = async (pw, salt) => {
  if (!globalThis.crypto?.subtle) return btoa(unescape(encodeURIComponent(salt + pw)));
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(salt + pw));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
};
export default function AuthGate({ children }) {
  const [st, setSt] = useState("loading"), [auth, setAuth] = useState(null);
  const [name, setName] = useState(""), [pw, setPw] = useState(""), [pw2, setPw2] = useState(""), [err, setErr] = useState("");
  useEffect(() => {
    let a = null; try { a = JSON.parse(localStorage.getItem("mm_auth") || "null"); } catch {}
    setAuth(a); setSt(!a ? "setup" : sessionStorage.getItem("mm_in") ? "in" : "login");
  }, []);
  const submit = async (e) => {
    e.preventDefault(); setErr("");
    if (st === "setup") {
      if (!name.trim()) return setErr("আপনার নাম লিখুন");
      if (pw.length < 6) return setErr("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      if (pw !== pw2) return setErr("দুটি পাসওয়ার্ড মিলছে না");
      const salt = Math.random().toString(36).slice(2), a = { name: name.trim(), salt, h: await hash(pw, salt) };
      localStorage.setItem("mm_auth", JSON.stringify(a)); sessionStorage.setItem("mm_in", "1"); setAuth(a); setSt("in");
    } else {
      if ((await hash(pw, auth.salt)) !== auth.h) return setErr("পাসওয়ার্ড ভুল হয়েছে");
      sessionStorage.setItem("mm_in", "1"); setSt("in");
    }
    setPw(""); setPw2("");
  };
  const reset = () => { if (confirm("সব ডেটা ও পাসওয়ার্ড মুছে নতুন করে শুরু হবে। নিশ্চিত?")) { ["mm_auth", "mm_tx_v2", "mm_debts_v2"].forEach((k) => localStorage.removeItem(k)); sessionStorage.clear(); location.reload(); } };
  if (st === "loading") return null;
  if (st === "in") return children({ user: auth, logout: () => { sessionStorage.removeItem("mm_in"); setSt("login"); } });
  return (
    <div id="login"><form onSubmit={submit}>
      <div className="lg">👛</div>
      <div><h1>{st === "setup" ? "স্বাগতম" : `আবার স্বাগতম, ${auth?.name}`}</h1><p className="sub">{st === "setup" ? "একবার সেটআপ করুন, ডেটা থাকবে শুধু আপনার ডিভাইসে" : "চালিয়ে যেতে পাসওয়ার্ড দিন"}</p></div>
      {st === "setup" && <input className="inp" placeholder="আপনার নাম" value={name} onChange={(e) => setName(e.target.value)} autoFocus />}
      <input className="inp" type="password" placeholder="পাসওয়ার্ড" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus={st === "login"} />
      {st === "setup" && <input className="inp" type="password" placeholder="পাসওয়ার্ড আবার লিখুন" value={pw2} onChange={(e) => setPw2(e.target.value)} />}
      {err && <p className="hint err">{err}</p>}
      <button className="btn pri big" style={{ margin: 0 }}>{st === "setup" ? "শুরু করুন" : "প্রবেশ করুন"}</button>
      {st === "login" && <button type="button" className="lnk" onClick={reset} style={{ color: "#8d95ab", fontSize: 12 }}>পাসওয়ার্ড ভুলে গেছেন? অ্যাপ রিসেট করুন</button>}
    </form></div>
  );
}
