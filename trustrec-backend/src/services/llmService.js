const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeRecipeSafety(recipeTitle, ingredients, healthConditions) {
  try {
    const conditionsText = healthConditions && healthConditions.length > 0 
      ? healthConditions.join(', ') 
      : 'None (Healthy User)';

    const prompt = `
      You are an expert AI Medical Nutritionist & Food Safety Specialist.
      Analyze the safety of the following recipe based on the user's medical health conditions.

      Recipe Title: ${recipeTitle}
      Ingredients: ${ingredients.join(', ')}
      User's Health Conditions / Allergies: ${conditionsText}

      Respond ONLY with a valid JSON object matching this exact structure. Do not include any other markdown text, introduction, backticks, or explanation outside the JSON:
      {
        "safetyScore": 5,
        "riskLevel": "MEDIUM",
        "allergensDetected": ["ingredient"],
        "medicalWarnings": ["warning"],
        "aiExplanation": "explanation text"
      }
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const response = await model.generateContent(prompt);
    let responseText = response.response.text().trim();

    // Use Regex to extract the curly braces { } as cleanly as possible, remove the ```json wrapping character.
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      responseText = jsonMatch[0];
    }

    return JSON.parse(responseText);

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      safetyScore: 5,
      riskLevel: "MEDIUM",
      allergensDetected: ["Unknown"],
      medicalWarnings: ["AI service temporary limit. Please check manually."],
      aiExplanation: "Fallback data due to AI formatting issue or timeout."
    };
  }
}

module.exports = { analyzeRecipeSafety };