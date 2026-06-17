import { Router, Request, Response } from 'express';
import { generateRecipeWithAI } from '../services/ai_service';
import { saveRecipe, getRecipes, getRecipeById, rateRecipe, getTopRecipes } from '../services/recipe_service';

const router = Router();

// GET /api/recipes/top
router.get('/top', async (req: Request, res: Response) => {
  try {
    const recipes = await getTopRecipes();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: "En beğenilen tarifler getirilemedi." });
  }
});

// POST /api/recipes/generate
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { ingredients, dietMode, cuisine } = req.body;
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: "Geçersiz malzeme listesi" });
    }

    const recipe = await generateRecipeWithAI(ingredients, dietMode, cuisine);
    res.json(recipe);
  } catch (error) {
    console.error("Error generating recipe:", error);
    res.status(500).json({ error: "Tarif üretilemedi." });
  }
});

// POST /api/recipes
router.post('/', async (req: Request, res: Response) => {
  try {
    const savedRecipe = await saveRecipe(req.body);
    res.json(savedRecipe);
  } catch (error) {
    console.error("Error saving recipe:", error);
    res.status(500).json({ error: "Tarif kaydedilemedi." });
  }
});

// GET /api/recipes
router.get('/', async (req: Request, res: Response) => {
  try {
    const recipes = await getRecipes();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Tarifler getirilemedi." });
  }
});

// POST /api/recipes/:id/rate
router.post('/:id/rate', async (req: Request, res: Response) => {
  try {
    const recipeId = req.params.id as string;
    const score = Number(req.body.score);
    const recipe = await rateRecipe(recipeId, score);

    res.json(recipe);
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid rating score') {
      return res.status(400).json({ error: "Puan 1 ile 5 arasinda olmali." });
    }

    if (error instanceof Error && error.message === 'Recipe not found') {
      return res.status(404).json({ error: "Tarif bulunamadi." });
    }

    console.error("Error rating recipe:", error);
    res.status(500).json({ error: "Tarif puanlanamadi." });
  }
});

// GET /api/recipes/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const recipeId = req.params.id as string;
    const recipe = await getRecipeById(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: "Tarif bulunamadı." });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: "Tarif detayları getirilemedi." });
  }
});

export default router;
