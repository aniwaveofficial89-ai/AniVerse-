
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GENRES } from '../data/mockData';
import { useAnimeData } from '../context/AnimeDataContext';
import AnimeCard from '../components/AnimeCard';

const BrowsePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const { animeList } = useAnimeData();
  const searchQuery = searchParams.get('search') || '';

  const filteredAnime = useMemo(() => {
    return animeList.filter(anime => {
      const matchesGenre = selectedGenre === 'All' || anime.genres.includes(selectedGenre);
      const matchesSearch = anime.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGenre && matchesSearch;
    });
  }, [selectedGenre, searchQuery, animeList]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white text-center mb-2">
            {searchQuery ? `Searching for "${searchQuery}"` : 'Browse All Anime'}
        </h1>
        <p className="text-center text-gray-400">Discover your next favorite series.</p>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setSelectedGenre('All')}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${selectedGenre === 'All' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}
        >
          All
        </button>
        {GENRES.map(genre => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${selectedGenre === genre ? 'bg-purple-600 text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}
          >
            {genre}
          </button>
        ))}
      </div>

      {filteredAnime.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {filteredAnime.map(anime => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-400">No anime found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default BrowsePage;
