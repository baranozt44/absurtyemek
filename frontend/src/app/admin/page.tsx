"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { apiUrl } from "@/lib/site";

type AdminRecipe = {
  id: string;
  title: string;
  description: string;
  average_rating: number;
  rating_count: number;
  is_hidden: boolean;
  is_featured: boolean;
  diet_mode?: string | null;
  cuisine?: string | null;
  created_at: string;
};

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [recipes, setRecipes] = useState<AdminRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.app_metadata?.role === "admin";

  const getAccessToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  };

  const loadRecipes = async () => {
    setLoading(true);
    setError("");

    const token = await getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    const response = await fetch(`${apiUrl}/admin/recipes`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      setError("Admin tarifleri getirilemedi.");
      setLoading(false);
      return;
    }

    setRecipes(await response.json());
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadRecipes();
    }
  }, [isAdmin]);

  const updateRecipe = async (id: string, body: Record<string, boolean>) => {
    const token = await getAccessToken();
    if (!token) return;

    const endpoint = Object.prototype.hasOwnProperty.call(body, "is_featured")
      ? `${apiUrl}/admin/recipes/${id}/feature`
      : `${apiUrl}/admin/recipes/${id}`;

    const response = await fetch(endpoint, {
      method: Object.prototype.hasOwnProperty.call(body, "is_featured") ? "POST" : "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setError("Tarif guncellenemedi.");
      return;
    }

    await loadRecipes();
  };

  const deleteRecipe = async (id: string) => {
    if (!window.confirm("Bu tarifi kalici olarak silmek istiyor musun?")) return;

    const token = await getAccessToken();
    if (!token) return;

    const response = await fetch(`${apiUrl}/admin/recipes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      setError("Tarif silinemedi.");
      return;
    }

    await loadRecipes();
  };

  if (!loading && !user) {
    return (
      <div className="max-w-3xl mx-auto w-full px-4 py-16">
        <h1 className="text-4xl font-black text-white mb-4">Admin Panel</h1>
        <p className="text-slate-400 mb-8">Admin panel icin once giris yapmalisin.</p>
        <Link href="/login" className="inline-flex rounded-xl bg-indigo-500 px-6 py-3 font-bold text-white hover:bg-indigo-400">
          Giriş Yap
        </Link>
      </div>
    );
  }

  if (!loading && user && !isAdmin) {
    return (
      <div className="max-w-3xl mx-auto w-full px-4 py-16">
        <h1 className="text-4xl font-black text-white mb-4">Admin Panel</h1>
        <p className="text-slate-400">Bu hesabin admin rolu yok. Admin rolu verildikten sonra cikis yapip tekrar giris yap.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-white">Admin Panel</h1>
          <p className="text-slate-400 mt-2">Tarifleri gizle, one cikar veya sil.</p>
        </div>
        <button type="button" onClick={loadRecipes} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-200 hover:bg-white/5">
          Yenile
        </button>
      </div>

      {error && <p className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}

      <div className="space-y-4">
        {loading ? (
          <p className="text-slate-400">Yukleniyor...</p>
        ) : recipes.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-slate-400">Tarif bulunamadi.</p>
        ) : (
          recipes.map((recipe) => (
            <div key={recipe.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {recipe.is_hidden && <span className="rounded-lg bg-red-500/10 px-2 py-1 text-xs font-bold text-red-300">Gizli</span>}
                    {recipe.is_featured && <span className="rounded-lg bg-indigo-500/10 px-2 py-1 text-xs font-bold text-indigo-300">Öne çıkan</span>}
                    {recipe.cuisine && <span className="rounded-lg bg-white/5 px-2 py-1 text-xs text-slate-300">{recipe.cuisine}</span>}
                    {recipe.diet_mode && <span className="rounded-lg bg-white/5 px-2 py-1 text-xs text-slate-300">{recipe.diet_mode}</span>}
                  </div>
                  <h2 className="text-xl font-bold text-white">{recipe.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-400">{recipe.description}</p>
                  <p className="mt-3 text-xs text-slate-500">
                    Puan {Number(recipe.average_rating || 0).toFixed(1)} ({recipe.rating_count || 0} oy)
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <button
                    type="button"
                    onClick={() => updateRecipe(recipe.id, { is_hidden: !recipe.is_hidden })}
                    className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-200 hover:bg-white/5"
                  >
                    {recipe.is_hidden ? "Göster" : "Gizle"}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateRecipe(recipe.id, { is_featured: !recipe.is_featured })}
                    className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-200 hover:bg-white/5"
                  >
                    {recipe.is_featured ? "Öne çıkarmayı kaldır" : "Öne çıkar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteRecipe(recipe.id)}
                    className="rounded-xl border border-red-500/30 px-4 py-2 text-sm font-bold text-red-300 hover:bg-red-500/10"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
