export interface SunoSongResult {
  id: string;
  audioUrl: string;
  status: "pending" | "complete" | "failed";
}

export class SunoService {
  static async generateSong(
    description: string,
    tags: string[]
  ): Promise<SunoSongResult> {
    try {
      // Create a prompt for Suno AI based on the image analysis
      const prompt = this.createSongPrompt(description, tags);

      const response = await fetch("https://api.suno.ai/v1/generate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUNO_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          duration: 30, // 30 seconds
          model: "suno-v2",
        }),
      });

      if (!response.ok) {
        throw new Error("Suno API request failed");
      }

      const data = await response.json();

      return {
        id: data.id,
        audioUrl: data.audio_url,
        status: "pending",
      };
    } catch (error) {
      console.error("Error generating song:", error);
      throw new Error("Failed to generate song");
    }
  }

  private static createSongPrompt(description: string, tags: string[]): string {
    const mood = this.determineMood(description, tags);
    const genre = this.determineGenre(tags);

    return `Create a ${mood} ${genre} song about this memory: ${description}. 
    The song should capture the emotions and atmosphere of this moment. 
    Include elements that reflect: ${tags.join(", ")}. 
    Make it personal and nostalgic, like a soundtrack to this memory.`;
  }

  private static determineMood(description: string, tags: string[]): string {
    const text = description.toLowerCase() + " " + tags.join(" ").toLowerCase();

    if (
      text.includes("happy") ||
      text.includes("joy") ||
      text.includes("celebration")
    )
      return "upbeat";
    if (
      text.includes("sad") ||
      text.includes("melancholy") ||
      text.includes("nostalgic")
    )
      return "melancholic";
    if (
      text.includes("peaceful") ||
      text.includes("calm") ||
      text.includes("serene")
    )
      return "peaceful";
    if (
      text.includes("energetic") ||
      text.includes("dynamic") ||
      text.includes("vibrant")
    )
      return "energetic";

    return "emotional";
  }

  private static determineGenre(tags: string[]): string {
    const text = tags.join(" ").toLowerCase();

    if (text.includes("nature") || text.includes("outdoor")) return "folk";
    if (text.includes("city") || text.includes("urban")) return "electronic";
    if (text.includes("person") || text.includes("people")) return "pop";
    if (text.includes("food")) return "jazz";
    if (text.includes("animal")) return "ambient";

    return "indie";
  }

  static async checkSongStatus(songId: string): Promise<SunoSongResult> {
    try {
      const response = await fetch(
        `https://api.suno.ai/v1/generate/${songId}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUNO_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check song status");
      }

      const data = await response.json();

      return {
        id: songId,
        audioUrl: data.audio_url || "",
        status: data.status,
      };
    } catch (error) {
      console.error("Error checking song status:", error);
      throw new Error("Failed to check song status");
    }
  }
}
