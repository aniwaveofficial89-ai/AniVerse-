
import React from 'react';
import { Link } from 'react-router-dom';
import type { Anime } from '../types';
import GenrePill from './GenrePill';

interface HeroSectionProps {
  anime: Anime;
}

const PlayIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.72-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
    </svg>
);


const HeroSection: React.FC<HeroSectionProps> = ({ anime }) => {
  if (!anime) return null;

  const firstEpisode = anime.episodes[0];

  return (
    <div className="relative h-[60vh] md:h-[85vh] w-full text-white">
      <img src={anime.bannerUrl} alt={anime.title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent"></div>
      
      <div className="relative z-10 flex flex-col justify-end h-full container mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-20">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-lg">{anime.title}</h1>
          <div className="flex items-center space-x-4 mb-4 text-sm md:text-base">
            <span className="font-bold text-yellow-400">★ {anime.rating}</span>
            <span className="text-gray-300">{anime.releaseYear}</span>
            <div className="flex flex-wrap gap-2">
                {anime.genres.slice(0, 3).map(genre => <GenrePill key={genre} genre={genre} />)}
            </div>
          </div>
          <p className="text-gray-200 mb-6 line-clamp-3 md:line-clamp-none">{anime.description}</p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            {firstEpisode && (
              <Link to={`/watch/${anime.id}/${firstEpisode.id}`} className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-300 transform hover:scale-105">
                <PlayIcon className="w-6 h-6 mr-2" />
                Play Episode 1
              </Link>
            )}
            <Link to={`/anime/${anime.id}`} className="flex items-center justify-center bg-slate-700/80 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-300 transform hover:scale-105">
              More Info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
