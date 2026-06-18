import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import AuthNav from "@/components/AuthNav";
import { absoluteUrl, defaultDescription, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
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
    <html lang="tr" className={`${inter.variable} ${outfit.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-300 font-sans selection:bg-zinc-800 selection:text-white">
        <header className="w-full py-6 px-8 sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/logo.png" alt="Absürt Yemek Logo" className="h-12 w-12 rounded-xl object-contain" />
              <span className="text-2xl font-black tracking-tighter text-white hidden sm:block" style={{ fontFamily: 'var(--font-outfit)' }}>
                AbsürtYemek
              </span>
            </a>
            <nav className="flex gap-8 font-medium text-sm text-zinc-500">
              <a href="/" className="hover:text-white transition-colors">Ana Sayfa</a>
              <a href="/explore" className="hover:text-white transition-colors">Kesfet</a>
              <AuthNav />
            </nav>
          </div>
        </header>

        <main className="flex-1 flex flex-col">{children}</main>

        <footer className="w-full py-10 text-center text-sm text-zinc-600 border-t border-zinc-900 bg-zinc-950">
          © {new Date().getFullYear()} Absurt Yemek.
        </footer>
      </body>
    </html>
  );
}
