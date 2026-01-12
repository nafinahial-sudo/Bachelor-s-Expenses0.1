
import { GoogleGenAI, Type } from "@google/genai";
import { MonthData, UserProfile, Expense, LifeMode, LifeEvent } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
if (!apiKey) {
  console.error("Gemini API Key is missing! Please set VITE_GEMINI_API_KEY in your .env file.");
}

const ai = new GoogleGenAI({ apiKey });

export const analyzeFinances = async (
  profile: UserProfile,
  currentMonth: MonthData,
  previousMonth?: MonthData
) => {
  const prompt = `
    As a wise elder sibling (Bhai/Apu) from Bangladesh, analyze these finances.
    User Profile: ${JSON.stringify(profile)}
    Current Life Mode: ${profile.lifeMode}
    Current Life Event: ${profile.lifeEvent}
    Current Month Data: ${JSON.stringify(currentMonth)}
    Previous Month Data: ${previousMonth ? JSON.stringify(previousMonth) : 'No previous data'}

    Provide:
    1. A summary in Banglish (mix of Bengali and English). 
    2. Mental Health Score (0-100) based on deficit days, stress spending, and borrowing.
    3. Mental Health Category (Calm, Pressured, or Overloaded).
    4. "Cash Gap Detector": Why a recurring end-of-month crisis happens.
    5. Payday Strategy: Suggestions for 3 phases (1st week, mid-month, last week).
    6. Spender Personality (e.g., Emotional, Conservative, etc.).
    7. Supportive advice.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          mentalHealthScore: { type: Type.NUMBER },
          mentalHealthCategory: { type: Type.STRING },
          cashGapInsight: { type: Type.STRING },
          paydayStrategy: { type: Type.STRING },
          predictionDays: { type: Type.NUMBER },
          spenderPersonality: { type: Type.STRING },
          advice: { type: Type.STRING },
          status: { type: Type.STRING }
        },
        required: ["summary", "mentalHealthScore", "mentalHealthCategory", "cashGapInsight", "paydayStrategy", "spenderPersonality", "advice", "status"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const analyzeSavingsGoal = async (
  profile: UserProfile,
  currentMonth: MonthData,
  goalAmount: number,
  purpose: string,
  flexibility: string
) => {
  const prompt = `
    As a wise Apu/Bhai, help the user with their Savings Goal.
    User Profile: ${JSON.stringify(profile)}
    Goal: Save ৳${goalAmount} for "${purpose}" (Flexibility: ${flexibility}).
    Current Income: ৳${currentMonth.totalIncome}
    Total Spent so far: ৳${currentMonth.expenses.reduce((s, e) => s + e.amount, 0)}
    Life Mode: ${profile.lifeMode}
    Life Event: ${profile.lifeEvent}

    Requirements:
    - Analyze if the goal is realistic for a typical Bangladeshi bachelor/student/professional.
    - Provide a "Micro-Savings Engine" plan: Round-ups, skipping small daily habits (like premium tea or extra smoking), and turning impulse avoids into savings.
    - Calculate daily/weekly targets.
    - Explain "Survival Impact": How many extra days of survival this saved money provides.
    - Use a supportive, non-shaming Banglish tone.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isRealistic: { type: Type.BOOLEAN },
          explanation: { type: Type.STRING },
          microSavingsTips: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Small, effortless, habit-based savings suggestions"
          },
          dailyTarget: { type: Type.NUMBER },
          weeklyTarget: { type: Type.NUMBER },
          savingTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          extraDays: { type: Type.NUMBER, description: "Extra survival days gained" },
          stressReduction: { type: Type.NUMBER, description: "Estimated percentage" }
        },
        required: ["isRealistic", "explanation", "microSavingsTips", "dailyTarget", "weeklyTarget", "savingTips", "extraDays", "stressReduction"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const getGiftSuggestions = async (budget: number, occasion: string, recipient: string, profile: UserProfile) => {
  const prompt = `
    Suggest gifts for ${recipient} for ${occasion} available in Bangladesh (Daraz, AjkerDeal, etc). Budget: ${budget} BDT.
    Life Mode: ${profile.lifeMode}.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            price: { type: Type.NUMBER },
            shop: { type: Type.STRING },
            reason: { type: Type.STRING }
          }
        }
      }
    }
  });

  return JSON.parse(response.text);
};
