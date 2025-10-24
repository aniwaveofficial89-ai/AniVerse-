import React from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Episode } from '../types';
import GenrePill from '../components/GenrePill';
import { useMyList } from '../context/MyListContext';
import Recommendations from '../components/Recommendations';
import { useAnimeData } from '../context/AnimeDataContext';

const PlayIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.72-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
    </svg>
);

const EpisodeListItem: React.FC<{ animeId: string; episode: Episode; }> = ({ animeId, episode }) => {
    return (
        <Link 
            to={`/watch/${animeId}/${episode.id}`} 
            className="group flex items-center bg-slate-800/50 hover:bg-slate-700/80 rounded-lg overflow-hidden transition-all duration-300"
        >
            <div className="flex-shrink-0 w-32 sm:w-40 relative">
                <img src={episode.thumbnailUrl} alt={episode.title} className="w-full h-full object-cover aspect-video" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-purple-600/50 flex items-center justify-center transition-all duration-300">
                    <PlayIcon className="w-8 h-8 text-white/80 group-hover:text-white group-hover:scale-110 transition-transform" />
                </div>
            </div>
            <div className="p-3 sm:p-4 flex-grow">
                <p className="font-semibold text-white truncate">E{episode.episodeNumber} - {episode.title}</p>
                <p className="text-sm text-gray-400">Episode {episode.episodeNumber}</p>
            </div>
        </Link>
    );
};

const PlusIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
      <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </svg>
);

const CheckIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
      <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 0 1 1.04-.208Z" clipRule="evenodd" />
    </svg>
);


const AnimeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { animeList } = useAnimeData();
  const anime = animeList.find(a => a.id === id);
  const { isInMyList, addToMyList, removeFromMyList } = useMyList();

  if (!anime) {
    return (
      <div className="container mx-auto text-center py-20">
        <h1 className="text-2xl">Anime not found!</h1>
        <Link to="/" className="text-purple-400 hover:underline mt-4 inline-block">Go back home</Link>
      </div>
    );
  }

  const inList = isInMyList(anime.id);

  const handleMyListClick = () => {
    if (inList) {
      removeFromMyList(anime.id);
    } else {
      addToMyList(anime.id);
    }
  };

  return (
    <div>
      <div className="relative h-[40vh] md:h-[60vh] w-full">
        <img src={anime.bannerUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-24 md:-mt-32 pb-12">
        <div className="flex flex-col md:flex-row md:space-x-8">
          <div className="flex-shrink-0 w-40 md:w-60 mx-auto md:mx-0">
            <img src={anime.posterUrl} alt={anime.title} className="rounded-lg shadow-2xl w-full aspect-[2/3] object-cover" />
          </div>
          <div className="flex-grow pt-6 md:pt-16 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black text-white">{anime.title}</h1>
            <div className="flex justify-center md:justify-start items-center space-x-4 my-3 text-gray-300">
                <span className="font-bold text-yellow-400">★ {anime.rating.toFixed(1)}</span>
                <span>•</span>
                <span>{anime.releaseYear}</span>
                <span>•</span>
                <span>{anime.episodes.length} Episodes</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
              {anime.genres.map(genre => <GenrePill key={genre} genre={genre} />)}
            </div>
            <button 
                onClick={handleMyListClick}
                className={`flex items-center justify-center w-full md:w-auto font-bold py-3 px-6 rounded-lg transition-colors duration-300 transform hover:scale-105 ${inList ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-700/80 hover:bg-slate-600'}`}
            >
                {inList ? <CheckIcon className="w-6 h-6 mr-2" /> : <PlusIcon className="w-6 h-6 mr-2" />}
                {inList ? 'In My List' : 'Add to My List'}
            </button>
          </div>
        </div>
        
        <div className="mt-10">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Synopsis</h2>
          <p className="text-gray-300 leading-relaxed">{anime.description}</p>
        </div>
        
        <div className="mt-10">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Episodes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {anime.episodes.map(ep => (
              <EpisodeListItem key={ep.id} animeId={anime.id} episode={ep} />
            ))}
          </div>
        </div>
        
        <div className="mt-12">
            <Recommendations currentAnime={anime} />
        </div>
      </div>
    </div>
  );
};

export default AnimeDetailPage;
