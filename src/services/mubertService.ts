export interface MubertMusicResult {
  trackUrl: string;
  mood: string;
  genre: string;
}

export class MubertService {
  static async generateMusic(
    description: string,
    tags: string[]
  ): Promise<MubertMusicResult> {
    try {
      const mood = this.determineMood(description, tags);
      const genre = this.determineGenre(tags);

      const response = await fetch("https://api.mubert.com/v2/GenerateTrack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_MUBERT_API_KEY}`,
        },
        body: JSON.stringify({
          method: "GenerateTrack",
          params: {
            duration: 30,
            intensity: "medium",
            mood: mood,
            genre: genre,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Mubert API request failed");
      }

      const data = await response.json();

      return {
        trackUrl: data.data.track_url,
        mood: mood,
        genre: genre,
      };
    } catch (error) {
      console.error("Error generating music:", error);
      throw new Error("Failed to generate music");
    }
  }

  private static determineMood(description: string, tags: string[]): string {
    const text = description.toLowerCase() + " " + tags.join(" ").toLowerCase();

    if (
      text.includes("happy") ||
      text.includes("joy") ||
      text.includes("celebration")
    )
      return "happy";
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
    if (text.includes("romantic") || text.includes("love")) return "romantic";

    return "neutral";
  }

  private static determineGenre(tags: string[]): string {
    const text = tags.join(" ").toLowerCase();

    if (text.includes("nature") || text.includes("outdoor")) return "ambient";
    if (text.includes("city") || text.includes("urban")) return "electronic";
    if (text.includes("person") || text.includes("people")) return "pop";
    if (text.includes("food")) return "jazz";
    if (text.includes("animal")) return "ambient";

    return "ambient";
  }
}
