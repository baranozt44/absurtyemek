import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import AuthNav from "@/components/AuthNav";
import { absoluteUrl, defaultDescription, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Absurt Yemek - Yapay Zeka Destekli Tarif Uretici",
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  applicationName: siteName,
  category: "food",
  keywords: [
    "yapay zeka tarif",
    "tarif uretici",
    "evdeki malzemelerle yemek",
    "diyet tarifleri",
    "mutfak onerileri",
    "absurt yemek",
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png", sizes: "any" }
    ],
    apple: [{ url: "/logo.png", type: "image/png", sizes: "768x768" }],
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName,
    title: "Absurt Yemek - Yapay Zeka Destekli Tarif Uretici",
    description: defaultDescription,
    images: [
      {
        url: absoluteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: "Absurt Yemek",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Absurt Yemek - Yapay Zeka Destekli Tarif Uretici",
    description: defaultDescription,
    images: [absoluteUrl("/opengraph-image")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${dmSerif.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-300 font-sans selection:bg-zinc-800 selection:text-white">
        <header className="w-full py-5 px-8 sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-900">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center flex-shrink-0 shadow-md">
                <img src="/logo.png" alt="Absürt Yemek Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-black tracking-tight text-white hidden sm:block group-hover:opacity-80 transition-opacity" style={{ fontFamily: 'var(--font-dm-serif)' }}>
                AbsürtYemek
              </span>
            </a>
            <nav className="flex items-center gap-6 font-medium text-sm">
              <a href="/" className="text-zinc-400 hover:text-white transition-colors">Ana Sayfa</a>
              <a href="/explore" className="text-zinc-400 hover:text-white transition-colors">Keşfet</a>
              <AuthNav />
            </nav>
          </div>
        </header>

        <main className="flex-1 flex flex-col">{children}</main>

        <footer className="w-full py-10 border-t border-zinc-900 bg-zinc-950">
          <div className="max-w-6xl mx-auto px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-zinc-500" style={{ fontFamily: 'var(--font-dm-serif)' }}>AbsürtYemek</span>
              <span className="text-zinc-800">|</span>
              <span>by <a href="https://baranozt.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors underline decoration-zinc-800 underline-offset-4">baranozt.com</a></span>
            </div>
            <span>© {new Date().getFullYear()} — Yapay zeka destekli tarif üreticisi</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
