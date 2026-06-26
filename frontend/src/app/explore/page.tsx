"use client";

import { Fragment, useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { getRecipes, PaginatedRecipes } from "@/lib/api";
import { Compass, Clock, BarChart, Star, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import AdSlot from "@/components/AdSlot";

const LIMIT = 12;

function SkeletonCard() {
  return (
    <div className="flex flex-col bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden animate-pulse">
      <div className="h-44 bg-zinc-800" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-zinc-800 rounded w-3/4" />
        <div className="h-3 bg-zinc-800 rounded w-full" />
        <div className="h-3 bg-zinc-800 rounded w-2/3" />
        <div className="h-px bg-zinc-800 mt-4" />
        <div className="flex justify-between mt-3">
          <div className="h-3 bg-zinc-800 rounded w-16" />
          <div className="h-3 bg-zinc-800 rounded w-16" />
          <div className="h-3 bg-zinc-800 rounded w-10" />
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const [result, setResult] = useState<PaginatedRecipes | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filterDiet, setFilterDiet] = useState("");
  const [filterCuisine, setFilterCuisine] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchRecipes = useCallback(async (params: {
    q: string; page: number; diet: string; cuisine: string;
  }) => {
    setLoading(true);
    try {
      const data = await getRecipes({
        q: params.q || undefined,
        page: params.page,
        limit: LIMIT,
        diet: params.diet || undefined,
        cuisine: params.cuisine || undefined,
      });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQ(searchInput);
      setPage(1);
    }, 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchInput]);

  useEffect(() => {
    fetchRecipes({ q, page, diet: filterDiet, cuisine: filterCuisine });
  }, [q, page, filterDiet, filterCuisine, fetchRecipes]);

  const handleFilterChange = (type: "diet" | "cuisine", val: string) => {
    if (type === "diet") setFilterDiet(val);
    else setFilterCuisine(val);
    setPage(1);
  };

  const clearAll = () => {
    setSearchInput("");
    setFilterDiet("");
    setFilterCuisine("");
    setPage(1);
  };

  const recipes = result?.data ?? [];
  const totalPages = result?.totalPages ?? 1;
  const total = result?.total ?? 0;
  const hasActiveFilters = q || filterDiet || filterCuisine;

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 w-full">
      <div className="text-center mb-12 flex flex-col items-center">
        <Compass className="w-10 h-10 text-zinc-500 mb-4" />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">Kesfet</h1>
        <p className="text-base text-zinc-500 max-w-lg mx-auto">
          Toplulugun olusturdugu yaratici tarifleri incele. Ilham al, kendi sihrini yarat.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tarif ara... (orn: tavuk, makarna)"
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-zinc-600 outline-none text-white placeholder:text-zinc-500 text-sm transition-colors"
          />
          {searchInput && (
            <button onClick={() => setSearchInput("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <select
          value={filterDiet}
          onChange={(e) => handleFilterChange("diet", e.target.value)}
          className="px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-zinc-600 text-zinc-300 outline-none text-sm appearance-none cursor-pointer"
        >
          <option value="">Tum Diyetler</option>
          <option value="Vegan">Vegan</option>
          <option value="Dusuk Kalorili">Dusuk Kalorili</option>
          <option value="Sporcu">Sporcu</option>
          <option value="Ogrenci Butcesi">Ogrenci Butcesi</option>
        </select>

        <select
          value={filterCuisine}
          onChange={(e) => handleFilterChange("cuisine", e.target.value)}
          className="px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-zinc-600 text-zinc-300 outline-none text-sm appearance-none cursor-pointer"
        >
          <option value="">Tum Mutfaklar</option>
          <option value="Turk">Turk Mutfagi</option>
          <option value="Italyan">Italyan Mutfagi</option>
          <option value="Kore">Kore Mutfagi</option>
          <option value="Meksika">Meksika Mutfagi</option>
          <option value="Japon">Japon Mutfagi</option>
          <option value="Absurt Fuzyon">Absurt Fuzyon</option>
        </select>

        {hasActiveFilters && (
          <button onClick={clearAll} className="px-4 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 text-sm transition-colors whitespace-nowrap">
            Temizle
          </button>
        )}
      </div>

      {!loading && result && total > 0 && (
        <p className="text-sm text-zinc-500 mb-6">{total} tarif bulundu</p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-24 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <p className="text-xl text-zinc-400 mb-6 font-medium">
            {hasActiveFilters ? "Bu kriterlere uygun tarif bulunamadi." : "Henuz hic tarif yok."}
          </p>
          {hasActiveFilters && (
            <button onClick={clearAll} className="px-6 py-3 bg-zinc-800 text-zinc-300 rounded-xl font-medium hover:bg-zinc-700 transition-colors mr-3">
              Filtreleri Temizle
            </button>
          )}
          <Link href="/" className="px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-zinc-200 transition-colors inline-block">
            Yeni Tarif Uret
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe: any, index: number) => (
            <Fragment key={recipe.id}>
              <Link
                href={`/recipes/${recipe.id}`}
                className="group flex flex-col bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden hover:border-zinc-600 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="h-44 bg-zinc-950 relative p-5 flex flex-col justify-between">
                  <div className="flex gap-1.5 flex-wrap">
                    {recipe.is_featured && (
                      <span className="bg-white text-black text-xs font-bold px-2 py-0.5 rounded-md">One Cikan</span>
                    )}
                    {recipe.diet_mode && (
                      <span className="bg-zinc-800 text-zinc-300 text-xs px-2 py-0.5 rounded-md border border-zinc-700">{recipe.diet_mode}</span>
                    )}
                    {recipe.cuisine && (
                      <span className="bg-zinc-800 text-zinc-300 text-xs px-2 py-0.5 rounded-md border border-zinc-700">{recipe.cuisine}</span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-white group-hover:text-zinc-200 transition-colors line-clamp-2 leading-snug">
                    {recipe.title}
                  </h2>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-zinc-400 mb-4 line-clamp-2 flex-1 leading-relaxed text-sm">
                    {recipe.description}
                  </p>
                  <div className="flex items-center justify-between text-xs font-medium text-zinc-500 pt-4 border-t border-zinc-800">
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{recipe.cooking_time}</span>
                    <span className="flex items-center gap-1.5"><BarChart className="w-3 h-3" />{recipe.difficulty}</span>
                    <span className="flex items-center gap-1.5 text-zinc-400">
                      <Star className="w-3 h-3 fill-current" />
                      {Number(recipe.average_rating || 0).toFixed(1)}
                    </span>
                  </div>
                </div>
              </Link>

              {(index + 1) % 6 === 0 && index < recipes.length - 1 && (
                <AdSlot
                  slot="explore-recipe-feed"
                  label="Kesfet akisi tarif kartlari arasi"
                  size="in-feed"
                  className="my-2 md:col-span-2 lg:col-span-3"
                />
              )}
            </Fragment>
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                page === p
                  ? "bg-white text-black"
                  : "border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
