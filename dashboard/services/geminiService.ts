import { GoogleGenAI } from "@google/genai";
import { Campaign, WABAStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDashboardInsights = async (
  campaigns: Campaign[],
  status: WABAStatus
): Promise<string> => {
  try {
    const dataContext = JSON.stringify({
      accountStatus: status,
      recentCampaigns: campaigns.slice(0, 3), // Analyze top 3 recent
    });

    const prompt = `
      You are a WhatsApp Business marketing analyst. Analyze the following JSON data representing a WABA (WhatsApp Business API) account.
      
      Data: ${dataContext}
      
      Provide a concise, 2-3 sentence strategic insight. Focus on read rates (Read/Delivered ratio) and quality rating. 
      Do not output JSON. Just plain text advice.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No insights available at this time.";
  } catch (error) {
    console.error("Error generating insights:", error);
    return "Unable to generate AI insights. Please check your API key configuration.";
  }
};