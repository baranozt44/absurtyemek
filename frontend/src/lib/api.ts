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

export const getRecipes = async () => {
  const response = await fetch(`${apiUrl}/recipes`);
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
