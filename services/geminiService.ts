import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development and will show an alert in the UI.
  // In a real production environment, the key should be securely provisioned.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getVisibleObjects = async (location: string, date: string, time: string, catalog: string) => {
  const prompt = `
    Based on the following information, list 5 interesting astronomical objects from the ${catalog} catalog that are likely visible in the night sky.
    - Location: ${location}
    - Date: ${date}
    - Time: ${time} (local time)

    For each object, provide the following details:
    1.  'name': The common name of the object.
    2.  'type': The type of object (e.g., 'Spiral Galaxy', 'Open Cluster', 'Planet').
    3.  'distance': The approximate distance from Earth, including units (e.g., '2.5 million light-years', '4.2 AU').
    4.  'description': A brief, one-sentence interesting fact or description.
    5.  'imageUrl': A publicly accessible, direct URL to a high-quality image of the object (e.g., a .jpg or .png file). Prioritize official sources like NASA, ESA, APOD, or high-resolution images from Wikimedia Commons. Ensure the URL links directly to the image file, not a webpage.
    6.  'wikiUrl': A URL to the Wikipedia page for the object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              type: { type: Type.STRING },
              distance: { type: Type.STRING },
              description: { type: Type.STRING },
              imageUrl: { type: Type.STRING },
              wikiUrl: { type: Type.STRING },
            },
            required: ["name", "type", "distance", "description", "imageUrl", "wikiUrl"],
          },
        },
      },
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error fetching visible objects from Gemini:", error);
    throw new Error("Failed to generate celestial objects. Please check your API key and try again.");
  }
};

export const getLocationSuggestions = async (query: string): Promise<string[]> => {
    if (!query || query.length < 3) return [];
    const prompt = `Based on the search query "${query}", provide a JSON array of up to 5 autocomplete suggestions for city names. Each suggestion should be a string in the format "City, Country".`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        const json = JSON.parse(response.text.trim());
        return Array.isArray(json) ? json : [];
    } catch (error) {
        console.error("Error fetching location suggestions:", error);
        return [];
    }
};
