"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { generateRecipe, saveRecipe } from "@/lib/api";
import { Clock, Flame, BarChart, Users, ShoppingCart, ChefHat, Loader2, AlertCircle, Save, X } from "lucide-react";

function GenerateRecipeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ingredientsParam = searchParams.get("ingredients");
  const dietModeParam = searchParams.get("dietMode");
  const cuisineParam = searchParams.get("cuisine");
  
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState<any>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!ingredientsParam) {
      router.push("/");
      return;
    }

    const ingredientsList = ingredientsParam.split(",");
    
    generateRecipe(ingredientsList, dietModeParam || undefined, cuisineParam || undefined)
      .then((data) => {
        setRecipe(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [ingredientsParam, dietModeParam, cuisineParam, router]);

  const handleSave = async () => {
    if (!recipe) return;
    setSaving(true);
    try {
      const recipeToSave = {
        ...recipe,
        diet_mode: dietModeParam || null,
        cuisine: cuisineParam || null
      };
      const saved = await saveRecipe(recipeToSave);
      router.push(`/recipes/${saved.id}`);
    } catch (err: any) {
      alert("Hata: " + err.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Tarif Oluşturuluyor...</h2>
          <p className="text-zinc-500 font-medium text-base">Yapay zeka sihrini yapıyor, lütfen bekleyin.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="bg-zinc-900 p-8 rounded-2xl max-w-md text-center border border-zinc-800">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-3">Eyvah! Bir sorun oluştu.</h2>
          <p className="text-zinc-400 mb-8">{error}</p>
          <button onClick={() => router.push("/")} className="w-full px-6 py-3 bg-white text-black font-semibold rounded-xl transition-colors hover:bg-zinc-200">
            Geri Dön ve Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="max-w-5xl mx-auto p-4 py-12 w-full">
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        
        <div className="p-8 sm:p-12 border-b border-zinc-800">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 tracking-tight text-white">{recipe.title}</h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-3xl">{recipe.description}</p>
          <div className="flex flex-wrap gap-3 mt-8">
            <span className="bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-lg font-medium text-sm text-zinc-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-400" /> Süre: {recipe.cooking_time}
            </span>
            <span className="bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-lg font-medium text-sm text-zinc-300 flex items-center gap-2">
              <Flame className="w-4 h-4 text-zinc-400" /> Kalori: {recipe.calorie_estimate}
            </span>
            <span className="bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-lg font-medium text-sm text-zinc-300 flex items-center gap-2">
              <BarChart className="w-4 h-4 text-zinc-400" /> Zorluk: {recipe.difficulty}
            </span>
            <span className="bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-lg font-medium text-sm text-zinc-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-zinc-400" /> Porsiyon: {recipe.serving_size}
            </span>
          </div>
        </div>

        <div className="p-8 sm:p-12 grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4 space-y-10">
            <div>
              <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-zinc-400" /> Malzemeler
              </h3>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-400 text-sm leading-snug">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-zinc-600 flex-shrink-0"></span>
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            {recipe.missing_optional_ingredients && recipe.missing_optional_ingredients.length > 0 && (
              <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800">
                <h4 className="font-bold text-white mb-3 text-sm">Olsa İyi Olurdu</h4>
                <ul className="space-y-2">
                  {recipe.missing_optional_ingredients.map((ing: string, i: number) => (
                    <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                      <span className="text-zinc-600 mt-0.5">-</span> {ing}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="md:col-span-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-zinc-400" /> Hazırlanışı
            </h3>
            <ol className="space-y-8">
              {recipe.instructions.map((step: string, i: number) => (
                <li key={i} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-zinc-400 leading-relaxed pt-1 text-base">{step}</p>
                </li>
              ))}
            </ol>
            
            <div className="mt-12 pt-8 border-t border-zinc-800 flex justify-end gap-4">
              <button 
                onClick={() => router.push('/')}
                className="px-6 py-3 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl font-medium transition-colors border border-transparent hover:border-zinc-700 flex items-center gap-2"
              >
                <X className="w-5 h-5" /> Vazgeç
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? 'Kaydediliyor...' : 'Tarifi Kaydet'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GenerateRecipePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500 animate-pulse">Yükleniyor...</div>}>
      <GenerateRecipeContent />
    </Suspense>
  );
}
