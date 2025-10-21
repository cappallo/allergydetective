
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function parseIngredients(rawIngredients: string): Promise<string[]> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are an ingredient parsing expert. Given the following text from a product's ingredient list, extract and return a JSON array of individual ingredients. Normalize them by converting to lowercase, trimming whitespace, and simplifying compound ingredients (e.g., 'spicy mayo (soybean oil, egg yolk)' becomes 'spicy mayo', 'soybean oil', 'egg yolk'). Ignore quantities, percentages, and descriptors like "(organic)". Input: "${rawIngredients}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING,
                    },
                },
            },
        });
        const jsonStr = response.text.trim();
        const ingredients = JSON.parse(jsonStr);
        return Array.isArray(ingredients) ? ingredients : [];
    } catch (error) {
        console.error("Error parsing ingredients with Gemini:", error);
        // Fallback to simple comma splitting on error
        return rawIngredients.toLowerCase().split(',').map(i => i.trim().replace(/[()]/g, '')).filter(Boolean);
    }
}

export async function getIngredientInfo(ingredientName: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Provide a concise, easy-to-understand summary for a potential allergen: **${ingredientName}**. 
            - Start with a brief explanation of what it is.
            - List common product types it is found in.
            - Mention any common alternative names.
            Format the response as simple markdown, using bullet points.`,
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching ingredient info from Gemini:", error);
        return "Could not retrieve information for this ingredient. Please try again.";
    }
}
