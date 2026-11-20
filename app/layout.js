import "./globals.css";
import { Hind_Siliguri } from "next/font/google";
import PWA from "@/components/PWA";
const font = Hind_Siliguri({ subsets: ["bengali", "latin"], weight: ["400", "500", "600", "700"] });
export const metadata = {
  title: "আমার হিসাব", description: "আয়-ব্যয়, ধার-দেনা ও রিপোর্ট", manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "আমার হিসাব", statusBarStyle: "black-translucent" }, icons: { icon: "/icon-192.png", apple: "/apple-icon.png" },
};
export const viewport = { themeColor: "#06080f", width: "device-width", initialScale: 1, viewportFit: "cover" };
export default function RootLayout({ children }) {
  return (
    <html lang="bn" data-theme="dark" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: "try{document.documentElement.dataset.theme=localStorage.getItem('mm_theme')==='light'?'light':'dark'}catch(e){}" }} /></head>
      <body className={font.className}>{children}<PWA /></body>
    </html>
  );
}
