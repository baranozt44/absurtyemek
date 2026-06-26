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
    console.error('Error fetching top recipes:', error);
    res.status(500).json({ error: 'En begenilen tarifler getirilemedi.' });
  }
});

// POST /api/recipes/generate
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { ingredients, dietMode, cuisine } = req.body;
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'Gecersiz malzeme listesi' });
    }

    const recipe = await generateRecipeWithAI(ingredients, dietMode, cuisine);
    res.json(recipe);
  } catch (error) {
    console.error('Error generating recipe:', error);
    res.status(500).json({ error: 'Tarif uretilemedi.' });
  }
});

// POST /api/recipes
router.post('/', async (req: Request, res: Response) => {
  try {
    const savedRecipe = await saveRecipe(req.body);
    res.json(savedRecipe);
  } catch (error) {
    console.error('Error saving recipe:', error);
    res.status(500).json({ error: 'Tarif kaydedilemedi.' });
  }
});

// GET /api/recipes?q=...&page=1&limit=12&diet=...&cuisine=...
router.get('/', async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string | undefined;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 12;
    const diet = req.query.diet as string | undefined;
    const cuisine = req.query.cuisine as string | undefined;

    const result = await getRecipes({ q, page, limit, diet, cuisine });
    res.json(result);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Tarifler getirilemedi.' });
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
      return res.status(400).json({ error: 'Puan 1 ile 5 arasinda olmali.' });
    }

    if (error instanceof Error && error.message === 'Recipe not found') {
      return res.status(404).json({ error: 'Tarif bulunamadi.' });
    }

    console.error('Error rating recipe:', error);
    res.status(500).json({ error: 'Tarif puanlanamadi.' });
  }
});

// GET /api/recipes/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const recipeId = req.params.id as string;
    const recipe = await getRecipeById(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: 'Tarif bulunamadi.' });
    }
    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe detail:', error);
    res.status(500).json({ error: 'Tarif detaylari getirilemedi.' });
  }
});

export default router;
