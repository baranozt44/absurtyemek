import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarif Uret",
  robots: {
    index: false,
    follow: false,
  },
};

export default function GenerateLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
