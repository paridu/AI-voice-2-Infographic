import { GoogleGenAI, Type, Schema } from "@google/genai";
import { InfographicData, ChartType, Source } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const INFOGRAPHIC_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Main title of the infographic" },
    subtitle: { type: Type.STRING, description: "A catchy subtitle" },
    themeColor: { type: Type.STRING, description: "Hex code for the primary accent color" },
    backgroundColor: { type: Type.STRING, description: "Hex code for background, usually light or dark" },
    footer: { type: Type.STRING, description: "Source citation or footer text" },
    sections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: { 
            type: Type.STRING, 
            enum: [ChartType.BAR, ChartType.PIE, ChartType.LINE, ChartType.STAT, ChartType.LIST],
            description: "The type of visualization"
          },
          title: { type: Type.STRING, description: "Section header" },
          description: { type: Type.STRING, description: "Short explanation of the data" },
          chartDescription: { type: Type.STRING, description: "Additional detailed description or context for the chart" },
          data: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Label for the data point" },
                value: { type: Type.NUMBER, description: "Numerical value" },
                label: { type: Type.STRING, description: "Optional text for list items" }
              },
              required: ["name", "value"]
            }
          }
        },
        required: ["id", "type", "title", "data"]
      }
    }
  },
  required: ["title", "subtitle", "themeColor", "sections"]
};

export const generateInfographicData = async (prompt: string): Promise<InfographicData> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a structured JSON for an infographic based on this request: "${prompt}".
      
      Guidelines:
      1. **LANGUAGE**: The content (titles, descriptions, labels) MUST be in **Thai (ภาษาไทย)** unless the user explicitly requests another language.
      2. **REAL DATA**: If the user asks for factual information, comparisons, or news, USE GOOGLE SEARCH to get accurate numbers and statistics.
      3. Create realistic, interesting data if the user doesn't provide specific numbers.
      4. Choose the best chart type (BAR, PIE, LINE, STAT, LIST) for the data.
      5. Use a modern, professional color palette in themeColor.
      6. Ensure at least 3 distinct sections unless the user asks for less.
      `,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: INFOGRAPHIC_SCHEMA,
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for speed on this task
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const data = JSON.parse(text) as InfographicData;

    // Extract grounding sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      // Explicitly type and map to avoid unknown type errors
      const sources: Source[] = groundingChunks
        .map((chunk: any) => chunk.web)
        .filter((web: any) => web && web.uri && web.title)
        .map((web: any) => ({ title: web.title, uri: web.uri }));
      
      // Remove duplicates
      const uniqueSources = Array.from(new Map(sources.map(s => [s.uri, s])).values());
      
      if (uniqueSources.length > 0) {
        data.sources = uniqueSources;
      }
    }

    return data;
  } catch (error) {
    console.error("Error generating infographic:", error);
    throw error;
  }
};

export const optimizeInfographicContent = async (data: InfographicData): Promise<InfographicData> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
      Analyze the provided Infographic JSON and improve its copywriting.
      
      Goal: Make titles, subtitles, descriptions, and labels more engaging, professional, and concise (in Thai).
      
      Rules:
      1. KEEP all 'id', 'type', and numerical 'value' fields exactly as they are.
      2. KEEP the JSON structure.
      3. ONLY modify text fields for better flow and impact.
      4. Maintain the original meaning.

      Input:
      ${JSON.stringify(data)}
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: INFOGRAPHIC_SCHEMA,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    // Preserve sources if they exist in original data, as optimization prompt might lose them (or we need to merge them back)
    const optimizedData = JSON.parse(text) as InfographicData;
    if (data.sources) {
      optimizedData.sources = data.sources;
    }
    
    return optimizedData;
  } catch (error) {
    console.error("Error optimizing infographic:", error);
    throw error;
  }
};