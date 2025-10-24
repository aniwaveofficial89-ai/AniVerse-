import React from 'react';
import { Link } from 'react-router-dom';
import { GENRES } from '../data/mockData';
import { useAnimeData } from '../context/AnimeDataContext';
import { useUser } from '../context/UserContext';
import HeroSection from '../components/HeroSection';
import AnimeCard from '../components/AnimeCard';

const HomePage: React.FC = () => {
  const { animeList } = useAnimeData();
  const { isAdmin } = useUser();
  const featuredAnime = animeList[0];

  if (animeList.length === 0) {
    return (
      <div className="container mx-auto text-center py-20 flex flex-col items-center h-[calc(100vh-10rem)] justify-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">The Catalog is Empty</h1>
        <p className="text-gray-400 mb-8 max-w-md">It looks like there are no anime series available right now. An administrator can add new series or restore the default catalog.</p>
        {isAdmin && (
          <div className="flex gap-4">
              <Link to="/admin" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-300 transform hover:scale-105">
                  Go to Admin Panel
              </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <HeroSection anime={featuredAnime} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {GENRES.map(genre => {
          const animesInGenre = animeList.filter(anime => anime.genres.includes(genre)).slice(0, 10);
          if (animesInGenre.length === 0) return null;

          return (
            <section key={genre}>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-l-4 border-purple-500 pl-4">{genre}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {animesInGenre.map(anime => (
                  <AnimeCard key={anime.id} anime={anime} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
