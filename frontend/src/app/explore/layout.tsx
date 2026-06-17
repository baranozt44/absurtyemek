import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarifleri Kesfet",
  description: "Toplulugun olusturdugu yapay zeka tariflerini puan, diyet hedefi ve mutfak turune gore kesfet.",
  alternates: {
    canonical: "/explore",
  },
  openGraph: {
    title: "Tarifleri Kesfet",
    description: "Toplulugun olusturdugu yapay zeka tariflerini kesfet.",
    url: "/explore",
  },
};

export default function ExploreLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
