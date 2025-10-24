import React, { useState, useEffect } from 'react';
import type { Anime } from '../types';
import { getAiRecommendations } from '../utils/gemini';
import AnimeCard from './AnimeCard';
import LoadingSpinner from './LoadingSpinner';
import { useAnimeData } from '../context/AnimeDataContext';

interface RecommendationsProps {
  currentAnime: Anime;
}

const Recommendations: React.FC<RecommendationsProps> = ({ currentAnime }) => {
  const [recommendations, setRecommendations] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { animeList } = useAnimeData();

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const recs = await getAiRecommendations(currentAnime, animeList);
        setRecommendations(recs);
      } catch (e) {
        console.error("Failed to fetch recommendations", e);
        setError("Could not load recommendations at this time.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentAnime.id, animeList]);

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-l-4 border-purple-500 pl-4">
        You Might Also Like
      </h2>
      {isLoading ? (
        <div className="flex justify-center py-8">
            <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-400">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {recommendations.map(anime => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
