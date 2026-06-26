import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const saveRecipe = async (recipeData: any) => {
  return await prisma.recipe.create({
    data: {
      title: recipeData.title,
      description: recipeData.description,
      ingredients: JSON.stringify(recipeData.ingredients),
      instructions: JSON.stringify(recipeData.instructions),
      cooking_time: recipeData.cooking_time,
      difficulty: recipeData.difficulty,
      calorie_estimate: recipeData.calorie_estimate,
      serving_size: recipeData.serving_size,
      diet_mode: recipeData.diet_mode || null,
      cuisine: recipeData.cuisine || null,
      created_by: null,
    }
  });
};

export const getRecipes = async (params?: {
  q?: string;
  page?: number;
  limit?: number;
  diet?: string;
  cuisine?: string;
}) => {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 12;
  const skip = (page - 1) * limit;

  const where: any = { is_hidden: false };
  if (params?.q) {
    where.OR = [
      { title: { contains: params.q, mode: 'insensitive' } },
      { description: { contains: params.q, mode: 'insensitive' } },
    ];
  }
  if (params?.diet) where.diet_mode = params.diet;
  if (params?.cuisine) where.cuisine = params.cuisine;

  const [recipes, total] = await Promise.all([
    prisma.recipe.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip,
      take: limit,
    }),
    prisma.recipe.count({ where }),
  ]);

  return {
    data: recipes,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getTopRecipes = async () => {
  return await prisma.recipe.findMany({
    where: { is_hidden: false },
    orderBy: [
      { average_rating: 'desc' },
      { rating_count: 'desc' },
      { created_at: 'desc' }
    ],
    take: 5
  });
};

export const getRecipeById = async (id: string) => {
  return await prisma.recipe.findFirst({
    where: {
      id,
      is_hidden: false,
    },
    include: { ratings: true }
  });
};

export const rateRecipe = async (recipeId: string, score: number, userIp: string, userId?: string) => {
  if (!Number.isInteger(score) || score < 1 || score > 5) {
    throw new Error('Invalid rating score');
  }

  return await prisma.$transaction(async (tx) => {
    const recipe = await tx.recipe.findFirst({
      where: {
        id: recipeId,
        is_hidden: false,
      },
      select: { id: true },
    });

    if (!recipe) {
      throw new Error('Recipe not found');
    }

    await tx.rating.create({
      data: {
        recipe_id: recipeId,
        score,
        user_ip: userIp,
        user_id: userId || null,
      },
    });

    const ratingStats = await tx.rating.aggregate({
      where: { recipe_id: recipeId },
      _avg: { score: true },
      _count: { score: true },
    });

    return await tx.recipe.update({
      where: { id: recipeId },
      data: {
        average_rating: ratingStats._avg.score ?? 0,
        rating_count: ratingStats._count.score,
      },
      include: { ratings: true },
    });
  });
};
