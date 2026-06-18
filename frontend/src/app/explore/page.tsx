"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { getRecipes } from "@/lib/api";
import { Compass, Clock, BarChart, Star } from "lucide-react";
import AdSlot from "@/components/AdSlot";

export default function ExplorePage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDiet, setFilterDiet] = useState("");
  const [filterCuisine, setFilterCuisine] = useState("");

  useEffect(() => {
    getRecipes()
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredRecipes = recipes.filter(r => {
    if (filterDiet && r.diet_mode !== filterDiet) return false;
    if (filterCuisine && r.cuisine !== filterCuisine) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto p-6 py-16 w-full">
      <div className="text-center mb-12 flex flex-col items-center">
        <Compass className="w-12 h-12 text-slate-400 mb-4" />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-50 mb-4 tracking-tight">Keşfet</h1>
        <p className="text-lg text-slate-400 max-w-xl mx-auto">Topluluğun oluşturduğu yaratıcı tarifleri incele. İlham al, kendi sihrini yarat.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <select
          value={filterDiet}
          onChange={(e) => setFilterDiet(e.target.value)}
          className="px-5 py-3 rounded-lg bg-slate-900 border border-slate-800 text-stone-200 outline-none focus:ring-1 focus:ring-stone-300 transition-all appearance-none"
        >
          <option value="">Tüm Diyetler</option>
          <option value="Vegan">Vegan</option>
          <option value="Düşük Kalorili">Düşük Kalorili</option>
          <option value="Sporcu">Sporcu</option>
          <option value="Öğrenci Bütçesi">Öğrenci Bütçesi</option>
        </select>

        <select
          value={filterCuisine}
          onChange={(e) => setFilterCuisine(e.target.value)}
          className="px-5 py-3 rounded-lg bg-slate-900 border border-slate-800 text-stone-200 outline-none focus:ring-1 focus:ring-stone-300 transition-all appearance-none"
        >
          <option value="">Tüm Mutfaklar</option>
          <option value="Türk">Türk Mutfağı</option>
          <option value="İtalyan">İtalyan Mutfağı</option>
          <option value="Kore">Kore Mutfağı</option>
          <option value="Meksika">Meksika Mutfağı</option>
          <option value="Japon">Japon Mutfağı</option>
          <option value="Absürt Füzyon">Absürt Füzyon</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-8 h-8 border-2 border-slate-800 border-t-stone-200 rounded-full animate-spin"></div>
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="text-center py-24 bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-xl text-slate-400 mb-6 font-medium">Bu kriterlere uygun tarif bulunamadı.</p>
          <button onClick={() => { setFilterDiet(''); setFilterCuisine(''); }} className="px-6 py-3 bg-slate-800 text-stone-300 rounded-xl font-medium hover:bg-slate-700 transition-colors mr-3">Filtreleri Temizle</button>
          <Link href="/" className="px-6 py-3 bg-stone-100 text-slate-950 rounded-xl font-semibold hover:bg-stone-200 transition-colors inline-block">
            Yeni Tarif Üret
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe, index) => (
            <Fragment key={recipe.id}>
              <Link href={`/recipes/${recipe.id}`} className="group flex flex-col bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-600 transition-all duration-300">
                <div className="h-48 bg-slate-950 relative p-6 flex items-end">
                  <div className="absolute top-4 left-4 z-20 flex gap-2 flex-wrap">
                    {recipe.is_featured && <span className="bg-stone-100 text-slate-950 text-xs font-bold px-2 py-1 rounded">Öne Çıkan</span>}
                    {recipe.diet_mode && <span className="bg-slate-800 text-stone-200 text-xs font-medium px-2 py-1 rounded border border-slate-700">{recipe.diet_mode}</span>}
                    {recipe.cuisine && <span className="bg-slate-800 text-stone-200 text-xs font-medium px-2 py-1 rounded border border-slate-700">{recipe.cuisine}</span>}
                  </div>
                  <h2 className="text-xl font-bold text-stone-50 relative z-20 group-hover:text-stone-300 transition-colors line-clamp-2 leading-tight">
                    {recipe.title}
                  </h2>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-slate-400 mb-6 line-clamp-3 flex-1 leading-relaxed text-sm">
                    {recipe.description}
                  </p>
                  <div className="flex items-center justify-between gap-3 text-xs font-medium text-slate-500 pt-4 border-t border-slate-800">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{recipe.cooking_time}</span>
                    <span className="flex items-center gap-1"><BarChart className="w-3.5 h-3.5" />{recipe.difficulty}</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Star className="w-3.5 h-3.5 fill-current text-stone-300" /> {Number(recipe.average_rating || 0).toFixed(1)}
                    </span>
                  </div>
                </div>
              </Link>

              {(index + 1) % 6 === 0 && index < filteredRecipes.length - 1 && (
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
    </div>
  );
}
