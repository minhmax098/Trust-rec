const db = require('../../db/connection');
const { analyzeRecipeSafety } = require('../../services/llmService');

const resolvers = {
  Query: {
    getSecureRecommendations: async (_, { preferences, healthConditions }) => {
      try {
        let queryText = 'SELECT * FROM recipes';
        let params = [];

        if (preferences && preferences.length > 0) {
          queryText += ' WHERE tags && $1';
          params.push(preferences);
        }

        const res = await db.query(queryText, params);

        // Data conversion and parallel AI activation for each dish.
        const recipesWithAI = await Promise.all(res.rows.map(async (row) => {
          // Gọi sang Gemini API để phân tích trực tiếp theo thời gian thực (Real-time)
          const aiAnalysis = await analyzeRecipeSafety(row.title, row.ingredients, healthConditions);

          return {
            id: row.id.toString(),
            title: row.title,
            ingredients: row.ingredients,
            cookingTime: row.cooking_time,
            tags: row.tags,
            safetyAnalysis: aiAnalysis // Attach the Gemini results directly here.
          };
        }));

        return recipesWithAI;

      } catch (err) {
        console.error("Error in getSecureRecommendations:", err);
        throw new Error("Internal server error");
      }
    },

    getRecipeDetails: async (_, { id }) => {
      try {
        const res = await db.query('SELECT * FROM recipes WHERE id = $1', [id]);
        if (res.rows.length === 0) return null;
        
        const row = res.rows[0];
        return {
          id: row.id.toString(),
          title: row.title,
          ingredients: row.ingredients,
          cookingTime: row.cooking_time,
          tags: row.tags,
          safetyAnalysis: null
        };
      } catch (err) {
        console.error("Error fetching recipe details:", err);
        throw new Error("Internal server error");
      }
    }
  }
};

module.exports = resolvers;