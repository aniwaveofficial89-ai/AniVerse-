import React from 'react';
import { Link } from 'react-router-dom';
import type { Anime } from '../types';
import GenrePill from './GenrePill';

interface AnimeCardProps {
  anime: Anime;
}

const StarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);


const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  return (
    <Link to={`/anime/${anime.id}`} className="group flex flex-col h-full rounded-lg overflow-hidden shadow-lg bg-slate-800 hover:bg-slate-700 transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img src={anime.posterUrl} alt={anime.title} className="w-full h-auto aspect-[2/3] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-2 right-2 bg-slate-900/80 rounded-full px-2 py-1 flex items-center space-x-1 text-xs font-bold">
            <StarIcon />
            <span>{anime.rating.toFixed(1)}</span>
        </div>
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="font-bold text-md text-white truncate group-hover:text-purple-400">{anime.title}</h3>
        <p className="text-sm text-gray-400 mb-2">{anime.releaseYear}</p>
        <div className="mt-auto flex flex-wrap gap-1 pt-1">
            {anime.genres.slice(0, 2).map(genre => <GenrePill key={genre} genre={genre} />)}
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;
