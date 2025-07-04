import { model } from "../config/firebase";

export interface AIAnalysisResult {
  description: string;
  tags: string[];
  confidence: number;
}

export class AIService {
  static async analyzeImage(imageDataUrl: string): Promise<AIAnalysisResult> {
    try {
      // Convert image to base64 if needed
      const base64Image = imageDataUrl.startsWith("data:")
        ? imageDataUrl.split(",")[1]
        : imageDataUrl;

      const result = await this.callGeminiAPI(base64Image);
      return result;
    } catch (error) {
      console.error("Error analyzing image:", error);
      throw new Error("Failed to analyze image");
    }
  }

  private static async callGeminiAPI(
    base64Image: string
  ): Promise<AIAnalysisResult> {
    try {
      // Create the prompt with image
      const prompt =
        "Analyze this image and provide: 1. A detailed description 2. Relevant tags (comma-separated) 3. Confidence level (0-1). Format your response as JSON with keys: description, tags (array), confidence (number).";

      // Generate content with image
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
          },
        },
      ]);

      const response = result.response;
      const text = response.text();

      // Try to parse JSON response
      try {
        const parsed = JSON.parse(text);
        return {
          description: parsed.description || "Image analyzed successfully",
          tags: parsed.tags || ["image", "memory"],
          confidence: parsed.confidence || 0.8,
        };
      } catch (parseError) {
        // Fallback if JSON parsing fails
        return {
          description: text,
          tags: this.extractTags(text),
          confidence: 0.8,
        };
      }
    } catch (error) {
      console.error("Gemini API error:", error);
      throw new Error("AI analysis failed");
    }
  }

  private static extractTags(description: string): string[] {
    const commonTags = [
      "person",
      "nature",
      "city",
      "food",
      "animal",
      "object",
      "memory",
      "moment",
    ];
    return commonTags.filter((tag) => description.toLowerCase().includes(tag));
  }
}
