import type { Metadata } from "next";
import { absoluteUrl, apiUrl, siteName } from "@/lib/site";

type RecipeSeo = {
  id: string;
  title: string;
  description: string;
  average_rating?: number;
  rating_count?: number;
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

const truncate = (text: string, length = 155) => {
  if (text.length <= length) return text;
  return `${text.slice(0, length - 1).trim()}...`;
};

const getRecipe = async (id: string): Promise<RecipeSeo | null> => {
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const recipe = await getRecipe(id);

  if (!recipe) {
    return {
      title: "Tarif Bulunamadi",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${recipe.title} Tarifi`;
  const description = truncate(recipe.description);
  const url = `/recipes/${id}`;
  const image = absoluteUrl(`/recipes/${id}/opengraph-image`);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      siteName,
      url,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: recipe.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default function RecipeLayout({ children }: Props) {
  return children;
}
