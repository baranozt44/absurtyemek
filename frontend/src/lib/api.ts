import { apiUrl } from "@/lib/site";

export const generateRecipe = async (ingredients: string[], dietMode?: string, cuisine?: string) => {
  const response = await fetch(`${apiUrl}/recipes/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients, dietMode, cuisine }),
  });
  if (!response.ok) throw new Error('Tarif üretilemedi');
  return response.json();
};

export const saveRecipe = async (recipe: any) => {
  const response = await fetch(`${apiUrl}/recipes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recipe),
  });
  if (!response.ok) throw new Error('Tarif kaydedilemedi');
  return response.json();
};

export interface RecipeParams {
  q?: string;
  page?: number;
  limit?: number;
  diet?: string;
  cuisine?: string;
}

export interface PaginatedRecipes {
  data: any[];
  total: number;
  page: number;
  totalPages: number;
}

export const getRecipes = async (params?: RecipeParams): Promise<PaginatedRecipes> => {
  const query = new URLSearchParams();
  if (params?.q) query.set('q', params.q);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.diet) query.set('diet', params.diet);
  if (params?.cuisine) query.set('cuisine', params.cuisine);

  const qs = query.toString();
  const response = await fetch(`${apiUrl}/recipes${qs ? `?${qs}` : ''}`);
  if (!response.ok) throw new Error('Tarifler getirilemedi');
  return response.json();
};

export const getRecipeById = async (id: string) => {
  const response = await fetch(`${apiUrl}/recipes/${id}`);
  if (!response.ok) throw new Error('Tarif getirilemedi');
  return response.json();
};

export const rateRecipe = async (id: string, score: number) => {
  const response = await fetch(`${apiUrl}/recipes/${id}/rate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ score }),
  });
  if (!response.ok) throw new Error('Puan kaydedilemedi');
  return response.json();
};
