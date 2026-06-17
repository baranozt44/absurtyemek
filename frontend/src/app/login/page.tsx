"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (mode: "login" | "signup") => {
    setLoading(true);
    setError("");
    setMessage("");

    const result = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    if (mode === "signup" && !result.data.session) {
      setMessage("Kayit olusturuldu. Supabase e-posta onayi istiyorsa gelen kutunu kontrol et.");
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="text-3xl font-black text-white mb-2">Giriş</h1>
        <p className="text-sm text-slate-400 mb-8">Tarifleri hesabinla yonetmek ve admin panele erismek icin oturum ac.</p>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2">E-posta</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-indigo-500"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-300 mb-2">Şifre</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-indigo-500"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}
          {message && <p className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-200">{message}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => submit("login")}
              disabled={loading || !email || !password}
              className="rounded-xl bg-indigo-500 px-5 py-3 font-bold text-white transition hover:bg-indigo-400 disabled:opacity-50"
            >
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => submit("signup")}
              disabled={loading || !email || !password}
              className="rounded-xl border border-white/10 px-5 py-3 font-bold text-slate-200 transition hover:bg-white/5 disabled:opacity-50"
            >
              Kayıt Ol
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
