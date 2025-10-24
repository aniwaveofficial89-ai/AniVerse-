import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { ANIME_DATA as initialAnimeData } from '../data/mockData';
import type { Anime } from '../types';

const ANIME_STORAGE_KEY = 'aniVerseAnimeData';

const getInitialAnimeData = (): Anime[] => {
  try {
    const storedData = window.localStorage.getItem(ANIME_STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      // Add a robust check to ensure the loaded data is an array.
      if (Array.isArray(parsedData)) {
        return parsedData;
      }
    }
  } catch (error) {
    console.error("Failed to parse anime data from localStorage. Data might be corrupted.", error);
  }
  
  // Fallback for first load, empty storage, or corrupted data.
  // This ensures the app always starts with a valid state.
  window.localStorage.setItem(ANIME_STORAGE_KEY, JSON.stringify(initialAnimeData));
  return initialAnimeData;
};

interface AnimeDataContextType {
  animeList: Anime[];
  addAnime: (newAnime: Anime) => void;
  deleteAnimeSeries: (animeId: string) => void;
  deleteAnimeEpisode: (animeId: string, episodeId: string) => void;
  resetAnimeData: () => void;
}

const AnimeDataContext = createContext<AnimeDataContextType | undefined>(undefined);

export const AnimeDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [animeList, setAnimeList] = useState<Anime[]>(getInitialAnimeData);

  useEffect(() => {
    try {
      window.localStorage.setItem(ANIME_STORAGE_KEY, JSON.stringify(animeList));
    } catch (error) {
      console.error("Failed to save anime data to localStorage", error);
    }
  }, [animeList]);

  const addAnime = (newAnime: Anime) => {
    setAnimeList(prev => [newAnime, ...prev]);
  };

  const deleteAnimeSeries = (animeId: string) => {
    setAnimeList(prev => prev.filter(a => a.id !== animeId));
  };
  
  const deleteAnimeEpisode = (animeId: string, episodeId: string) => {
    setAnimeList(prev => prev.map(anime => {
        if (anime.id === animeId) {
            return { ...anime, episodes: anime.episodes.filter(ep => ep.id !== episodeId) };
        }
        return anime;
    }));
  };

  const resetAnimeData = () => {
    setAnimeList(initialAnimeData);
  }

  const value = { animeList, addAnime, deleteAnimeSeries, deleteAnimeEpisode, resetAnimeData };

  return (
    <AnimeDataContext.Provider value={value}>
      {children}
    </AnimeDataContext.Provider>
  );
};

export const useAnimeData = (): AnimeDataContextType => {
  const context = useContext(AnimeDataContext);
  if (context === undefined) {
    throw new Error('useAnimeData must be used within an AnimeDataProvider');
  }
  return context;
};