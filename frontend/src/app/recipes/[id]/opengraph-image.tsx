import { ImageResponse } from "next/og";
import { apiUrl } from "@/lib/site";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

type RecipeOg = {
  title: string;
  description: string;
  average_rating?: number;
  rating_count?: number;
  cuisine?: string | null;
  diet_mode?: string | null;
};

const getRecipe = async (id: string): Promise<RecipeOg | null> => {
  try {
    const response = await fetch(`${apiUrl}/recipes/${id}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
};

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = await getRecipe(id);
  const title = recipe?.title || "Absurt Yemek Tarifi";
  const rating = Number(recipe?.average_rating || 0).toFixed(1);
  const ratingCount = recipe?.rating_count || 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#09090b",
          color: "white",
          padding: 72,
          fontFamily: "Arial",
        }}
      >
        <div style={{ display: "flex", gap: 16, fontSize: 28, color: "#d4d4d8" }}>
          <span>Absurt Yemek</span>
          {recipe?.cuisine && <span>• {recipe.cuisine}</span>}
          {recipe?.diet_mode && <span>• {recipe.diet_mode}</span>}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, maxWidth: 980 }}>
            {title}
          </div>
          <div style={{ marginTop: 26, fontSize: 30, lineHeight: 1.25, color: "#a1a1aa", maxWidth: 920 }}>
            {recipe?.description || "Yapay zeka ile uretilmis yaratıcı tarif."}
          </div>
        </div>
        <div style={{ display: "flex", gap: 20, fontSize: 28, color: "#e4e4e7" }}>
          <span>★ {rating}</span>
          <span>({ratingCount} oy)</span>
        </div>
      </div>
    ),
    size,
  );
}
