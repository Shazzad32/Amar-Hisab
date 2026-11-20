# আমার হিসাব – Money Manager (Next.js PWA)
আয়-ব্যয়, ট্রান্সফার, ধার-দেনা, দৈনিক/সাপ্তাহিক/মাসিক/কাস্টম রিপোর্ট, লগইন, ডার্ক/লাইট থিম, ইনস্টলযোগ্য অ্যাপ।

```
npm install
npm run dev                     # http://localhost:3000
npm run build && npm start      # প্রোডাকশন (PWA ইনস্টল পরীক্ষার জন্য)
```
ফোনে ইনস্টল: Vercel-এ ডিপ্লয় করুন (HTTPS লাগবে)। Android Chrome-এ 📲 বাটন, iPhone Safari-তে Share > Add to Home Screen।

ডেটা ব্রাউজারের localStorage-এ থাকে; লগইন শুধু ওই ডিভাইসের জন্য। একাধিক ডিভাইসে সিঙ্ক করতে চাইলে MongoDB + সার্ভার লগইন যোগ করতে হবে।

## MongoDB
`.env.local` ফাইলে `MONGODB_URI`, `MONGODB_DB=mydb`, `MONGODB_COLLECTION=myhisab` দিন (নমুনা: `.env.example`)।
`npm install` করে চালালে ডেটা `mydb.myhisab` কালেকশনে সংরক্ষিত হবে (`mm_tx_v2`, `mm_debts_v2` নামে দুটি ডকুমেন্ট)।
Vercel-এ ডিপ্লয় করলে Settings > Environment Variables-এ একই তিনটি ভ্যারিয়েবল দিন, আর Atlas > Network Access-এ `0.0.0.0/0` অনুমোদন করুন।
