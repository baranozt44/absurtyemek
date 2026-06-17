import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(requireAdmin);

// GET /api/admin/recipes - List all recipes (including hidden ones)
router.get('/recipes', async (req: Request, res: Response) => {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json(recipes);
  } catch (error) {
    console.error("Admin fetch error:", error);
    res.status(500).json({ error: "Tarifler getirilemedi." });
  }
});

// PATCH /api/admin/recipes/:id - Toggle visibility (is_hidden)
router.patch('/recipes/:id', async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { is_hidden } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Tarif id gerekli." });
    }
    
    if (typeof is_hidden !== 'boolean') {
      return res.status(400).json({ error: "is_hidden boolean olmalıdır" });
    }

    const updated = await prisma.recipe.update({
      where: { id },
      data: { is_hidden }
    });
    res.json(updated);
  } catch (error) {
    console.error("Admin update error:", error);
    res.status(500).json({ error: "Tarif güncellenemedi." });
  }
});

// POST /api/admin/recipes/:id/feature - Toggle featured status
router.post('/recipes/:id/feature', async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { is_featured } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Tarif id gerekli." });
    }

    if (typeof is_featured !== 'boolean') {
      return res.status(400).json({ error: "is_featured boolean olmalıdır" });
    }

    const updated = await prisma.recipe.update({
      where: { id },
      data: { is_featured }
    });
    res.json(updated);
  } catch (error) {
    console.error("Admin feature error:", error);
    res.status(500).json({ error: "Öne çıkarma durumu güncellenemedi." });
  }
});

// DELETE /api/admin/recipes/:id - Delete recipe
router.delete('/recipes/:id', async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Tarif id gerekli." });
    }

    await prisma.recipe.delete({ where: { id } });
    res.json({ success: true, message: "Tarif silindi." });
  } catch (error) {
    console.error("Admin delete error:", error);
    res.status(500).json({ error: "Tarif silinemedi." });
  }
});

export default router;
