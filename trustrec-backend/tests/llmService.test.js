const { analyzeRecipeSafety } = require('../src/services/llmService');
const { GoogleGenerativeAI } = require('@google/generative-ai');

jest.mock('@google/generative-ai');

describe('llmService', () => {
  it('should return parsed JSON safety analysis', async () => {
    const mockResponseText = JSON.stringify({
      safetyScore: 8,
      riskLevel: "LOW",
      allergensDetected: ["none"],
      medicalWarnings: ["none"],
      aiExplanation: "Safe to eat."
    });

    const mockGenerateContent = jest.fn().mockResolvedValue({
      response: {
        text: () => mockResponseText
      }
    });

    const mockGetGenerativeModel = jest.fn().mockReturnValue({
      generateContent: mockGenerateContent
    });

    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: mockGetGenerativeModel
    }));

    // Because the service instantiates genAI outside the function, we need to reset module registry
    // The clean way is to re-require it after the mock.
    jest.resetModules();
    const { GoogleGenerativeAI: MockedAI } = require('@google/generative-ai');
    MockedAI.mockImplementation(() => ({
      getGenerativeModel: mockGetGenerativeModel
    }));
    const { analyzeRecipeSafety: localAnalyze } = require('../src/services/llmService');

    const result = await localAnalyze("Test Recipe", ["ingredient 1"], ["None"]);
    expect(result.safetyScore).toBe(8);
    expect(result.riskLevel).toBe("LOW");
    expect(mockGenerateContent).toHaveBeenCalled();
  });
});
