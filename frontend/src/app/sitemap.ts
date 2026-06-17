import type { MetadataRoute } from "next";
import { absoluteUrl, apiUrl } from "@/lib/site";

type RecipeSitemapItem = {
  id: string;
  created_at?: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/explore"),
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.8,
    },
  ];

  try {
    const response = await fetch(`${apiUrl}/recipes`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) return routes;

    const recipes = (await response.json()) as RecipeSitemapItem[];
    return [
      ...routes,
      ...recipes.map((recipe) => ({
        url: absoluteUrl(`/recipes/${recipe.id}`),
        lastModified: recipe.created_at ? new Date(recipe.created_at) : now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ];
  } catch {
    return routes;
  }
}
