import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

dotenv.config();

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY || 'dummy_key');

const getDynamicPrompt = (dietMode?: string, cuisine?: string) => {
  let modeText = "Sen yaratıcı ama gerçekçi tarifler geliştiren profesyonel bir şefsin. Kullanıcının verdiği malzemeleri merkeze alarak uygulanabilir, lezzet dengesi güçlü ve sıradanlıktan uzak bir yemek tarifi üret.";
  
  if (dietMode) {
    modeText += `\nTarifi "${dietMode}" diyetine/hedefine uygun tasarla; bu hedefle çelişen malzemeler veya teknikler kullanma.`;
  }
  if (cuisine) {
    modeText += `\nTarifi "${cuisine}" mutfağının lezzet mantığına, baharat kullanımına ve pişirme tarzına yakın kurgula.`;
  }

  return `${modeText}
Kurallar:
- Tarif basit bir "malzemeleri karıştır ve pişir" metni gibi olmasın; kavurma, mühürleme, fırınlama, sos hazırlama, marine etme veya kıvam alma gibi gerçek mutfak tekniklerinden uygun olanları kullan.
- Adımlar 5-8 maddeden oluşsun, her adım net ve uygulanabilir olsun.
- Türkçeyi doğal, akıcı ve iştah açıcı kullan; bozuk çeviri gibi duran ifadelerden kaçın.
- Kullanıcının verdiği malzemeleri boşa harcama, ama yemeği mantıksız hale getirecek kombinasyonları zorla kullanma.
- Girilen malzemelerle mantıklı yemek yapılamıyorsa, en fazla 2-3 temel ek malzeme öner ve bunları "missing_optional_ingredients" alanında belirt.
- Tarif yaratıcı olsun ama ev mutfağında yapılabilir kalsın; çok lüks, bulunması zor veya pahalı malzemelere yaslanma.
- Başlık kısa, özgün ve Türkçe olsun; açıklama tek cümlede yemeğin lezzet fikrini anlatsın.

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
      description: "Eldeki malzemeleri daha dengeli, aromatik ve uygulanabilir bir tabakta buluşturan test tarifidir.",
      ingredients: ingredients.concat(["1 tutam tuz", "1 tutam karabiber", "1 yemek kaşığı zeytinyağı"]),
      missing_optional_ingredients: ["1 küçük soğan", "1 diş sarımsak"],
      instructions: [
        "Malzemeleri yıka, kurula ve birbirine yakın boyutlarda doğra.",
        "Tavayı orta-yüksek ateşte ısıtıp zeytinyağını ekle.",
        "Aromayı güçlendirmek için soğan ve sarımsak kullanacaksan önce onları kısa süre kavur.",
        "Ana malzemeleri tavaya alıp dış yüzeyleri hafif renk alana kadar sotele.",
        "Tuz ve karabiberle lezzetlendir, ardından ateşi kısarak malzemeler yumuşayana kadar pişir.",
        "Son dakika kıvamını kontrol et ve sıcak servis et."
      ],
      cooking_time: "25 dakika",
      difficulty: "Orta",
      calorie_estimate: "350 kcal",
      serving_size: "2 Kişilik"
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
      max_tokens: 1400,
      temperature: 0.85,
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
