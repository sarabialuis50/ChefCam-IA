
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { Recipe, Ingredient } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const analyzeIngredientImage = async (base64Image: string): Promise<Ingredient[]> => {
  const model = 'gemini-3-flash-preview';
  
  const prompt = `Analiza esta imagen de comida. Identifica los ingredientes comestibles primarios. 
    Devuelve el resultado como un arreglo JSON de objetos con 'name' (string), 'confidence' (number 0-100) y 'properties' (arreglo de strings como 'Orgánico', 'Grasas Saludables', 'Vitamina C').
    Sé conciso y solo incluye ingredientes claros. TODO EL TEXTO DEBE ESTAR EN ESPAÑOL.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Nombre del ingrediente en español" },
              confidence: { type: Type.NUMBER },
              properties: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Propiedades o beneficios en español"
              }
            },
            required: ["name", "confidence"]
          }
        }
      }
    });

    const results = JSON.parse(response.text || "[]");
    return results;
  } catch (error) {
    console.error("Error analyzing image:", error);
    return [];
  }
};

export const generateRecipes = async (ingredients: string[], portions: number): Promise<Recipe[]> => {
  const model = 'gemini-3-pro-preview';
  
  const prompt = `Crea 5 recetas saludables y creativas usando principalmente estos ingredientes: ${ingredients.join(", ")}. 
    Las recetas deben ser para ${portions} porciones. 
    Incluye información nutricional (calorías, proteínas, carbohidratos, grasas), dificultad y tiempo de preparación.
    IMPORTANTE: Los títulos, la descripción, los nombres de los ingredientes y el modo de preparación DEBEN ESTAR EXCLUSIVAMENTE EN ESPAÑOL.
    Formatea la salida como un arreglo JSON de objetos Recipe.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING, description: "Título de la receta en español" },
              description: { type: Type.STRING, description: "Breve descripción en español" },
              portions: { type: Type.NUMBER },
              prepTime: { type: Type.STRING, description: "Tiempo de prep, ej: 20 min" },
              difficulty: { type: Type.STRING, description: "Dificultad en español: Fácil, Media, Difícil" },
              calories: { type: Type.STRING },
              protein: { type: Type.STRING },
              carbs: { type: Type.STRING },
              fat: { type: Type.STRING },
              ingredients: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }, 
                description: "Lista de ingredientes con cantidades en español" 
              },
              instructions: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }, 
                description: "Pasos detallados de preparación en español" 
              },
              matchPercentage: { type: Type.NUMBER }
            },
            required: ["id", "title", "ingredients", "instructions"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error generating recipes:", error);
    return [];
  }
};

export const chatWithChef = async (history: { role: string; parts: string[] }[], message: string) => {
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "Eres el Chef AI de ChefCam.IA. Ayudas a los usuarios con dudas sobre recetas, sustitución de ingredientes y consejos de cocina saludable. Eres amable, técnico pero accesible, y muy profesional. Responde SIEMPRE en español."
    }
  });

  const result = await chat.sendMessage({ message });
  return result.text;
};

export const processAudioInstruction = async (base64Audio: string, mimeType: string) => {
  const model = 'gemini-3-flash-preview';
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { text: "Eres el Chef AI. Escucha la instrucción del usuario y responde de manera breve y profesional en ESPAÑOL. Si el usuario pide una receta o consejo, dáselo. Tu respuesta debe ser solo texto en español." },
          {
            inlineData: {
              mimeType,
              data: base64Audio,
            },
          },
        ],
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error processing audio instruction:", error);
    return "Lo siento, hubo un error al procesar tu mensaje de voz.";
  }
};

export const generateSpeech = async (text: string): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Di de forma clara y profesional en español: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("Error generating speech:", error);
    return undefined;
  }
};
