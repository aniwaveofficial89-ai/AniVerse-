import React from 'react';
import { Link } from 'react-router-dom';
import { useMyList } from '../context/MyListContext';
import { useAnimeData } from '../context/AnimeDataContext';
import AnimeCard from '../components/AnimeCard';

const MyListPage: React.FC = () => {
  const { myList } = useMyList();
  const { animeList } = useAnimeData();

  const favoriteAnime = animeList.filter(anime => myList.includes(anime.id));

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white text-center mb-2">
          My List
        </h1>
        <p className="text-center text-gray-400">Your saved anime series.</p>
      </div>

      {favoriteAnime.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {favoriteAnime.map(anime => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-400">Your list is empty.</p>
          <p className="text-gray-500 mt-2">Add some anime to your list to see them here.</p>
          <Link to="/browse" className="mt-6 inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-300 transform hover:scale-105">
            Browse Anime
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyListPage;
