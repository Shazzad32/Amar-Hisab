export const pad = (n) => String(n).padStart(2, "0");
export const iso = (d) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
export const fmt = (n) => "৳" + Math.round(n).toLocaleString("bn-BD");
export const bn = (n) => Number(n).toLocaleString("bn-BD");
export const parse = (s) => new Date(s + "T00:00:00");
export const addD = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
export const today = () => iso(new Date());
export const uid = () => (globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36));

export const EX = [["খাবার","🍽","#ff9f43"],["বাজার","🛒","#feca57"],["রেস্টুরেন্ট","🍔","#ff6b6b"],["বাসা ভাড়া","🏠","#6c8cff"],["বিল","💡","#f6d365"],["মোবাইল/নেট","📶","#48dbfb"],["যাতায়াত","🚌","#1dd1a1"],["জ্বালানি","⛽","#8395a7"],["গাড়ি/বাইক","🔧","#9aa5b1"],["স্বাস্থ্য","💊","#ff6b81"],["শিক্ষা","🎓","#a29bfe"],["সন্তান","🧸","#fd79a8"],["পোশাক","👕","#e17055"],["কেনাকাটা","🛍","#e84393"],["ইলেকট্রনিক্স","📱","#74b9ff"],["বিনোদন","🎬","#00cec9"],["ভ্রমণ","✈️","#55efc4"],["উপহার/দান","🎁","#fab1a0"],["ধর্মীয়/যাকাত","🕌","#81ecec"],["ব্যক্তিগত যত্ন","💈","#b8c1cc"],["ঘর-সংসার","🧹","#a4b0be"],["কিস্তি/ঋণ","🏦","#ffeaa7"],["বীমা","🛡","#a0c4ff"],["সঞ্চয়/বিনিয়োগ","📈","#7bed9f"],["বিবিধ","🏷","#95a5a6"]];
export const IN = [["বেতন","💼","#3ddc97"],["ব্যবসা","🏪","#2ed573"],["ফ্রিল্যান্স","💻","#1dd1a1"],["বোনাস","🎉","#7bed9f"],["ভাড়া আয়","🏘","#55efc4"],["লাভ/সুদ","📊","#00b894"],["বিক্রি","🏷","#26de81"],["উপহার","🎁","#20bf6b"],["ফেরত","↩️","#0be881"],["অন্যান্য আয়","➕","#38ada9"]];
export const AC = [["নগদ টাকা","💵"],["ব্যাংক","🏦"],["মোবাইল ব্যাংকিং","📲"],["কার্ড","💳"]];
export const CM = Object.fromEntries([...EX, ...IN].map((c) => [c[0], [c[1], c[2]]]));

export const sum = (a, t) => a.filter((x) => x.type === t).reduce((s, x) => s + x.amount, 0);
export const cmp = (a, b) => b.date.localeCompare(a.date) || (b.ts || 0) - (a.ts || 0);
export const bal = (txs, a) => txs.reduce((s, t) => s + (t.acct === a ? (t.type === "income" ? t.amount : -t.amount) : 0) + (t.type === "transfer" && t.to === a ? t.amount : 0), 0);
export const dayLabel = (d) => { const t = today(), y = iso(addD(new Date(), -1)); return d === t ? "আজ" : d === y ? "গতকাল" : parse(d).toLocaleDateString("bn-BD", { weekday: "short", day: "numeric", month: "long" }); };

export function sampleData() {
  let sd = 7, k = 0; const rnd = () => (sd = (sd * 9301 + 49297) % 233280) / 233280, ri = (a, b) => Math.round(a + rnd() * (b - a)), t = parse(today()), out = [];
  const add = (d, type, amount, cat, acct, note, to, open) => { if (d > t) return; out.push({ id: uid(), ts: ++k, type, amount, cat, acct, to, date: iso(d), note: note || "", open }); };
  const st = new Date(t.getFullYear(), t.getMonth() - 5, 1);
  [["নগদ টাকা", 30000], ["ব্যাংক", 50000], ["মোবাইল ব্যাংকিং", 15000], ["কার্ড", 25000]].forEach((a) => add(st, "income", a[1], "অন্যান্য আয়", a[0], "প্রারম্ভিক ব্যালেন্স", undefined, true));
  for (let i = 5; i >= 0; i--) {
    const y = new Date(t.getFullYear(), t.getMonth() - i, 1), mk = (n) => new Date(y.getFullYear(), y.getMonth(), n), dim = new Date(y.getFullYear(), y.getMonth() + 1, 0).getDate();
    add(mk(1), "income", 60000, "বেতন", "ব্যাংক", "মাসিক বেতন"); add(mk(ri(6, 12)), "income", ri(5000, 18000), "ফ্রিল্যান্স", "মোবাইল ব্যাংকিং", "ক্লায়েন্ট প্রজেক্ট");
    if (i % 3 === 0) add(mk(20), "income", ri(8000, 12000), "বোনাস", "ব্যাংক", "উৎসব বোনাস");
    add(mk(2), "expense", 15000, "বাসা ভাড়া", "ব্যাংক", "বাসা ভাড়া"); add(mk(5), "expense", ri(1500, 2400), "বিল", "ব্যাংক", "বিদ্যুৎ ও গ্যাস"); add(mk(6), "expense", ri(700, 1000), "মোবাইল/নেট", "মোবাইল ব্যাংকিং", "ইন্টারনেট ও রিচার্জ");
    add(mk(3), "transfer", 8000, "", "ব্যাংক", "ব্যাংক থেকে বিকাশে", "মোবাইল ব্যাংকিং"); add(mk(4), "transfer", 20000, "", "ব্যাংক", "নগদ উত্তোলন", "নগদ টাকা"); add(mk(8), "transfer", 6000, "", "ব্যাংক", "কার্ডে টাকা", "কার্ড");
    for (let d = 1; d <= dim; d++) {
      if (rnd() < .28) add(mk(d), "expense", ri(900, 2600), "বাজার", "নগদ টাকা", "বাজার"); if (rnd() < .55) add(mk(d), "expense", ri(60, 260), "যাতায়াত", "নগদ টাকা", "রিকশা / বাস");
      if (rnd() < .3) add(mk(d), "expense", ri(180, 750), rnd() < .5 ? "রেস্টুরেন্ট" : "খাবার", rnd() < .5 ? "কার্ড" : "নগদ টাকা", "দুপুরের খাবার"); if (rnd() < .05) add(mk(d), "expense", ri(1500, 6000), rnd() < .5 ? "পোশাক" : "কেনাকাটা", "কার্ড", "কেনাকাটা");
      if (rnd() < .04) add(mk(d), "expense", ri(300, 2500), "স্বাস্থ্য", "নগদ টাকা", "ওষুধ ও ডাক্তার"); if (rnd() < .06) add(mk(d), "expense", ri(300, 1500), "বিনোদন", "মোবাইল ব্যাংকিং", "সিনেমা / ঘোরাফেরা");
    }
    add(mk(15), "expense", ri(1500, 3000), "শিক্ষা", "ব্যাংক", "অনলাইন কোর্স");
  }
  return out;
}
