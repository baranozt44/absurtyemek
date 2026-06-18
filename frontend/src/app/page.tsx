"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, TrendingUp, Plus } from "lucide-react";
import AdSlot from "@/components/AdSlot";
import { apiUrl } from "@/lib/site";

interface Recipe {
  id: string;
  title: string;
  average_rating: number;
  rating_count: number;
}

export default function Home() {
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [topRecipes, setTopRecipes] = useState<Recipe[]>([]);
  const [dietMode, setDietMode] = useState("");
  const [cuisine, setCuisine] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch(`${apiUrl}/recipes/top`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTopRecipes(data);
        }
      })
      .catch((err) => console.error("Error fetching top recipes:", err));
  }, []);

  const addIngredient = (e?: any) => {
    if (e) e.preventDefault();
    if (!ingredientInput || ingredientInput.trim() === "") return;

    const newIngs = ingredientInput
      .split(",")
      .map((i) => i.trim().toLowerCase())
      .filter((i) => i.length > 0);

    if (newIngs.length > 0) {
      const uniqueIngs = Array.from(new Set([...ingredients, ...newIngs]));
      setIngredients(uniqueIngs);
      setIngredientInput("");
      setError("");
    }
  };

  const removeIngredient = (ing: string) => {
    setIngredients(ingredients.filter((i) => i !== ing));
  };

  const handleGenerate = () => {
    if (ingredients.length === 0) {
      setError("Şefin sihrini göstermesi için en az bir malzeme lazım.");
      return;
    }
    let query = `/generate?ingredients=${encodeURIComponent(ingredients.join(","))}`;
    if (dietMode) query += `&dietMode=${encodeURIComponent(dietMode)}`;
    if (cuisine) query += `&cuisine=${encodeURIComponent(cuisine)}`;
    router.push(query);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-16 px-6">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        
        {/* Sol Kolon - Form */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-10">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Malzemelerini Yaz. <br />
              <span className="text-zinc-400">Tarifini Keşfet.</span>
            </h1>
            <p className="text-lg text-zinc-500 font-medium max-w-lg">
              Dolabındaki malzemeleri gir, gelişmiş yapay zeka senin için saniyeler içinde benzersiz bir tarif oluştursun.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="ingredients" className="block text-sm font-semibold text-zinc-400">
                Elinizdeki Malzemeler
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="ingredients"
                  type="text"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addIngredient();
                    }
                  }}
                  placeholder="Örn: yumurta, peynir, mantar..."
                  className="flex-1 px-5 py-4 rounded-xl bg-zinc-900 border border-zinc-800 focus:ring-1 focus:ring-white focus:border-white outline-none transition-all text-white text-base placeholder:text-zinc-600"
                />
                <button
                  type="button"
                  onClick={() => addIngredient()}
                  className="px-6 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl transition-all whitespace-nowrap border border-zinc-700 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Ekle
                </button>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>

            <div className="flex flex-wrap gap-2 min-h-[60px] p-4 bg-zinc-900 rounded-xl border border-zinc-800 items-start">
              {ingredients.length === 0 ? (
                <span className="text-zinc-600 text-sm w-full my-auto">
                  Eklenen malzemeler burada görünecek.
                </span>
              ) : (
                ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-lg text-sm font-medium"
                  >
                    {ing}
                    <button
                      onClick={() => removeIngredient(ing)}
                      className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-zinc-600 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="dietMode" className="block text-sm font-semibold text-zinc-400">Diyet Hedefi</label>
                <select
                  id="dietMode"
                  value={dietMode}
                  onChange={(e) => setDietMode(e.target.value)}
                  className="w-full px-4 py-4 rounded-xl bg-zinc-900 border border-zinc-800 focus:ring-1 focus:ring-white focus:border-white outline-none transition-all text-white appearance-none"
                >
                  <option value="">Serbest</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Düşük Kalorili">Düşük Kalorili</option>
                  <option value="Sporcu">Sporcu</option>
                  <option value="Öğrenci Bütçesi">Öğrenci Bütçesi</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="cuisine" className="block text-sm font-semibold text-zinc-400">Mutfak Türü</label>
                <select
                  id="cuisine"
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="w-full px-4 py-4 rounded-xl bg-zinc-900 border border-zinc-800 focus:ring-1 focus:ring-white focus:border-white outline-none transition-all text-white appearance-none"
                >
                  <option value="">Rastgele</option>
                  <option value="Türk">Türk Mutfağı</option>
                  <option value="İtalyan">İtalyan Mutfağı</option>
                  <option value="Kore">Kore Mutfağı</option>
                  <option value="Meksika">Meksika Mutfağı</option>
                  <option value="Japon">Japon Mutfağı</option>
                  <option value="Absürt Füzyon">Absürt Füzyon</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              className="w-full py-4 bg-white text-black font-bold rounded-xl text-lg hover:bg-zinc-200 transition-colors mt-4 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Tarif Üret
            </button>
          </div>
        </div>

        {/* Sağ Kolon - Popüler */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-zinc-400" />
            En Çok Beğenilenler
          </h2>
          
          <div className="space-y-3">
            {topRecipes.length === 0 ? (
              <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
                <p className="text-zinc-500 text-sm">Henüz tarif yok.</p>
              </div>
            ) : (
              topRecipes.map((recipe, index) => (
                <div 
                  key={recipe.id}
                  onClick={() => router.push(`/recipes/${recipe.id}`)}
                  className="group flex items-center gap-4 p-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-zinc-950 rounded-lg text-sm font-bold text-zinc-400 border border-zinc-800">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-zinc-200 group-hover:text-white transition-colors line-clamp-1">
                      {recipe.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-500">
                      <span className="text-zinc-400">★</span>
                      <span>{recipe.average_rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            <button 
              onClick={() => router.push('/explore')}
              className="w-full mt-2 py-4 px-6 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-transparent text-zinc-400 hover:text-white font-medium transition-colors text-sm"
            >
              Tüm Tarifleri İncele
            </button>
          </div>

          <AdSlot
            slot="home-popular-recipes-below"
            label="Ana sayfa populer tarifler alti"
            className="mt-4"
          />
        </div>
      </div>
    </div>
  );
}
