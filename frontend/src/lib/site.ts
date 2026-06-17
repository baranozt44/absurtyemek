export const siteName = "Absurt Yemek";
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://absurtyemek.com";
export const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const defaultDescription =
  "Evdeki malzemelerle yapay zeka destekli tarifler uret, diyet ve mutfak tercihlerine gore yaratıcı yemek fikirleri kesfet.";

export const absoluteUrl = (path: string) => new URL(path, siteUrl).toString();
