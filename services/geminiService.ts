import { GoogleGenAI, Type, Schema } from "@google/genai";
import { InfographicData, ChartType } from '../types';

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
      2. Create realistic, interesting data if the user doesn't provide specific numbers.
      3. Choose the best chart type (BAR, PIE, LINE, STAT, LIST) for the data.
      4. Use a modern, professional color palette in themeColor.
      5. Ensure at least 3 distinct sections unless the user asks for less.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: INFOGRAPHIC_SCHEMA,
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for speed on this task
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as InfographicData;
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
    
    return JSON.parse(text) as InfographicData;
  } catch (error) {
    console.error("Error optimizing infographic:", error);
    throw error;
  }
};