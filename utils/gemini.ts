import { GoogleGenAI, Type } from '@google/genai';
import type { Anime } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Gets AI-powered anime recommendations.
 * @param currentAnime The anime to get recommendations for.
 * @param allAnime The complete list of anime to choose recommendations from.
 * @returns A promise that resolves to an array of recommended anime objects.
 */
export async function getAiRecommendations(currentAnime: Anime, allAnime: Anime[]): Promise<Anime[]> {
  // Filter out the current anime from the list of candidates
  const candidateAnime = allAnime.filter(a => a.id !== currentAnime.id).map(a => ({
    id: a.id,
    title: a.title,
    genres: a.genres,
    description: a.description.substring(0, 100) + '...', // Keep it brief
  }));

  const prompt = `
    You are an expert anime recommendation engine for a streaming service called AniVerse.
    Based on the following anime:
    - Title: "${currentAnime.title}"
    - Genres: ${currentAnime.genres.join(', ')}
    - Description: "${currentAnime.description}"

    From the list of available anime provided below, please select 3 titles that are most similar or that a user who liked the above anime would also enjoy.
    Do not recommend the anime that was provided as input.
    
    Available Anime List:
    ${JSON.stringify(candidateAnime, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    recommendations: {
                        type: Type.ARRAY,
                        description: 'An array of recommended anime, each with a string id property.',
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                id: {
                                    type: Type.STRING,
                                    description: 'The unique ID of the recommended anime.'
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    const responseJson = JSON.parse(response.text);
    const recommendedIds: string[] = responseJson.recommendations?.map((rec: {id: string}) => rec.id) || [];
    
    // Find the full anime objects from the IDs
    const recommendedAnime = allAnime.filter(anime => recommendedIds.includes(anime.id));

    return recommendedAnime;

  } catch (error) {
    console.error("Error fetching AI recommendations:", error);
    // As a fallback, return a few random anime from a similar genre
    const fallback = allAnime.filter(a => 
        a.id !== currentAnime.id &&
        a.genres.some(g => currentAnime.genres.includes(g))
    ).slice(0, 3);
    return fallback.length > 0 ? fallback : allAnime.filter(a => a.id !== currentAnime.id).slice(0, 3);
  }
}
