import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

dotenv.config();

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY || 'dummy_key');

const getDynamicPrompt = (dietMode?: string, cuisine?: string) => {
  let modeText = "Sen profesyonel bir şefsin. Kullanıcının sana verdiği malzemeleri kullanarak yapılabilecek lezzetli ve gerçekçi bir yemek tarifi üret.";
  
  if (dietMode) {
    modeText += `\nLütfen tarifi "${dietMode}" diyetine/hedefine uygun olarak tasarla.`;
  }
  if (cuisine) {
    modeText += `\nTarifini "${cuisine}" mutfağı tarzında kurgula.`;
  }

  return `${modeText}
Eğer girilen malzemelerle mantıklı yemek yapılamıyorsa, en fazla 1-2 temel ek malzeme (örneğin "soğan", "salça") öner.

Aşağıdaki JSON formatında TÜRKÇE olarak cevap ver. Asla markdown kodu veya fazladan yazı yazma, sadece JSON'ı döndür:
{
  "title": "Tarif başlığı",
  "description": "Kısa ve iştah açıcı tarif açıklaması",
  "ingredients": ["malzeme 1 (ölçüsüyle)", "malzeme 2 (ölçüsüyle)"],
  "missing_optional_ingredients": ["olmasa da olur ama yemeği güzelleştirecek 1-2 malzeme"],
  "instructions": ["1. Adım", "2. Adım"],
  "cooking_time": "Örn: 25 dakika",
  "difficulty": "Kolay, Orta veya Zor",
  "calorie_estimate": "Örn: 450 kcal",
  "serving_size": "Örn: 2 Kişilik"
}
`;
};

export const generateRecipeWithAI = async (ingredients: string[], dietMode?: string, cuisine?: string) => {
  const ingredientsText = ingredients.join(", ");
  
  if (!process.env.HUGGINGFACE_API_KEY || process.env.HUGGINGFACE_API_KEY.includes('dummy')) {
    console.log("No valid HUGGINGFACE_API_KEY found, returning dummy recipe for ingredients:", ingredientsText);
    return {
      title: "Uydurma Özel " + ingredients[0] + " Yemeği",
      description: "Bu tarif sadece test amaçlı olarak otomatik üretilmiştir.",
      ingredients: ingredients.concat(["Tuz", "Karabiber"]),
      missing_optional_ingredients: ["Biraz sevgi"],
      instructions: [
        "Tüm malzemeleri bir kaba al.",
        "İyice karıştır ve pişir.",
        "Afiyetle ye."
      ],
      cooking_time: "15 dakika",
      difficulty: "Kolay",
      calorie_estimate: "300 kcal",
      serving_size: "1 Kişilik"
    };
  }

  try {
    const dynamicPrompt = getDynamicPrompt(dietMode, cuisine);
    const response = await hf.chatCompletion({
      model: "Qwen/Qwen2.5-72B-Instruct",
      messages: [
        { role: "system", content: dynamicPrompt },
        { role: "user", content: "Malzemelerim: " + ingredientsText }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    let result = response.choices[0]?.message?.content || "";
    
    // Clean up potential markdown formatting from HuggingFace
    result = result.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    
    if (!result) throw new Error("AI returned empty result");
    
    return JSON.parse(result);
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Tarif üretilirken bir hata oluştu.");
  }
};
