"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRecipeById, rateRecipe } from "@/lib/api";
import { Clock, Flame, BarChart, Users, Eye, ShoppingCart, ChefHat, Star } from "lucide-react";
import AdSlot from "@/components/AdSlot";

const normalizeRecipe = (data: any) => ({
  ...data,
  ingredients: typeof data.ingredients === 'string' ? JSON.parse(data.ingredients) : data.ingredients,
  instructions: typeof data.instructions === 'string' ? JSON.parse(data.instructions) : data.instructions,
});

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [ratingError, setRatingError] = useState("");

  useEffect(() => {
    if (!params.id) return;
    
    getRecipeById(params.id as string)
      .then((data) => {
        const recipeId = params.id as string;
        setRecipe(normalizeRecipe(data));
        setHasRated(localStorage.getItem(`recipe-rating-${recipeId}`) !== null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [params.id]);

  const handleRate = async (score: number) => {
    if (!recipe || !params.id || hasRated || ratingSubmitting) return;

    const recipeId = params.id as string;
    setRatingSubmitting(true);
    setRatingError("");

    try {
      const updatedRecipe = await rateRecipe(recipeId, score);
      setRecipe(normalizeRecipe(updatedRecipe));
      localStorage.setItem(`recipe-rating-${recipeId}`, String(score));
      setHasRated(true);
    } catch (err) {
      console.error(err);
      setRatingError("Puan kaydedilemedi. Lutfen tekrar deneyin.");
    } finally {
      setRatingSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-24">
      <div className="w-8 h-8 border-2 border-zinc-800 border-t-white rounded-full animate-spin"></div>
    </div>
  );
  if (!recipe) return <div className="p-12 text-center text-zinc-500 font-medium">Tarif bulunamadı.</div>;

  const recipeJsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description,
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.instructions.map((step: string, index: number) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: step,
    })),
    recipeYield: recipe.serving_size,
    totalTime: recipe.cooking_time,
    recipeCuisine: recipe.cuisine || undefined,
    aggregateRating: recipe.rating_count > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: Number(recipe.average_rating || 0).toFixed(1),
          ratingCount: recipe.rating_count,
        }
      : undefined,
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 py-12 w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeJsonLd) }}
      />
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="p-8 sm:p-12 border-b border-zinc-800">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white tracking-tight leading-tight">
            {recipe.title}
          </h1>
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
            <span className="bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-lg font-medium text-sm text-zinc-300 flex items-center gap-2">
              <Eye className="w-4 h-4 text-zinc-400" /> {recipe.view_count} Görüntülenme
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

            <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800">
              <h3 className="font-bold text-white mb-3 text-sm">Puan Ver</h3>
              <div className="flex gap-1 text-2xl mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRate(star)}
                    disabled={ratingSubmitting || hasRated}
                    className={`transition-colors disabled:cursor-not-allowed ${star <= Math.round(Number(recipe.average_rating || 0)) ? "text-white" : "text-zinc-700 hover:text-zinc-400"}`}
                  >
                    <Star className={`w-6 h-6 ${star <= Math.round(Number(recipe.average_rating || 0)) ? "fill-current" : ""}`} />
                  </button>
                ))}
              </div>
              <p className="text-xs text-zinc-500">
                Ortalama: <span className="font-bold text-zinc-300">{Number(recipe.average_rating || 0).toFixed(1)}</span> / 5 ({recipe.rating_count || 0} oy)
              </p>
              {hasRated && <p className="mt-2 text-xs text-zinc-400">Puanınız kaydedildi.</p>}
              {ratingError && <p className="mt-2 text-xs text-red-400">{ratingError}</p>}
            </div>
          </div>

          <div className="md:col-span-8">
            <AdSlot
              slot="recipe-detail-ingredients-before-steps"
              label="Malzemeler ile hazirlanis adimlari arasi"
              className="mb-10"
            />

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
            
            <div className="mt-12 pt-8 border-t border-zinc-800 flex justify-end">
              <button 
                onClick={() => router.push('/explore')}
                className="px-6 py-3 bg-zinc-800 text-white hover:bg-zinc-700 rounded-xl font-medium transition-colors border border-zinc-700"
              >
                Diğer Tarifleri Keşfet
              </button>
            </div>
          </div>
        </div>
      </div>

      <AdSlot
        slot="recipe-detail-bottom"
        label="Tarif detay sayfasi en alt"
        className="mt-8"
      />
    </div>
  );
}
