"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export default function AuthNav() {
  const [user, setUser] = useState<User | null>(null);
  const isAdmin = user?.app_metadata?.role === "admin";

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (!user) {
    return (
      <Link href="/login" className="hover:text-white transition-colors">
        Giriş
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {isAdmin && (
        <Link href="/admin" className="text-indigo-300 hover:text-white transition-colors">
          Admin
        </Link>
      )}
      <span className="hidden sm:inline max-w-[180px] truncate text-slate-500">{user.email}</span>
      <button type="button" onClick={signOut} className="hover:text-white transition-colors">
        Çıkış
      </button>
    </div>
  );
}
