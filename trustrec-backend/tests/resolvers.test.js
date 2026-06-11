const resolvers = require('../src/graphql/resolvers/index');
const db = require('../src/db/connection');
const llmService = require('../src/services/llmService');

jest.mock('../src/db/connection');
jest.mock('../src/services/llmService');

describe('Resolvers', () => {
  describe('getSecureRecommendations', () => {
    it('should fetch recipes from db and attach ai analysis', async () => {
      const mockRecipes = [
        { id: 1, title: 'Chicken Salad', ingredients: ['chicken', 'lettuce'], cooking_time: 15, tags: ['Healthy'] }
      ];

      db.query.mockResolvedValue({ rows: mockRecipes });

      const mockAnalysis = { safetyScore: 10, riskLevel: "LOW", allergensDetected: [], medicalWarnings: [], aiExplanation: "Safe" };
      llmService.analyzeRecipeSafety.mockResolvedValue(mockAnalysis);

      const result = await resolvers.Query.getSecureRecommendations(null, { preferences: ['Healthy'], healthConditions: [] });

      expect(db.query).toHaveBeenCalled();
      expect(llmService.analyzeRecipeSafety).toHaveBeenCalledWith('Chicken Salad', ['chicken', 'lettuce'], []);
      expect(result[0].id).toBe('1');
      expect(result[0].title).toBe('Chicken Salad');
      expect(result[0].safetyAnalysis).toEqual(mockAnalysis);
    });
  });
});
