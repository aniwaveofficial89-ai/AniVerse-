import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAnimeData } from '../context/AnimeDataContext';
// Fix: Import Anime type to correctly type component state.
import type { Episode, Anime } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

// --- ICONS ---
const PlayIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.72-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>);
const PauseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm9 0a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" /></svg>);
const VolumeHighIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.099 3.099 3.099 8.191 0 11.29a.75.75 0 1 1-1.06-1.06 6.75 6.75 0 0 0 0-9.17a.75.75 0 0 1 0-1.06Z" /><path d="M15.932 7.757a.75.75 0 0 1 1.061 0 4.5 4.5 0 0 1 0 6.364.75.75 0 1 1-1.06-1.06 3 3 0 0 0 0-4.243.75.75 0 0 1 0-1.06Z" /></svg>);
const VolumeOffIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06ZM18.28 15.72a.75.75 0 0 0 1.06-1.06l-1.72-1.72 1.72-1.72a.75.75 0 1 0-1.06-1.06L17.22 12l-1.72-1.72a.75.75 0 0 0-1.06 1.06l1.72 1.72-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72Z" /></svg>);
const FullscreenEnterIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M15 3.75a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V5.56l-3.47 3.47a.75.75 0 0 1-1.06-1.06l3.47-3.47H9.75a.75.75 0 0 1 0-1.5h4.5a.75.75 0 0 1 .75.75Zm-6 12a.75.75 0 0 1 .75.75v3.19l3.47-3.47a.75.75 0 0 1 1.06 1.06l-3.47 3.47h3.19a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" /></svg>);
const FullscreenExitIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M9 3.75a.75.75 0 0 1 .75.75v3.19l3.47-3.47a.75.75 0 0 1 1.06 1.06l-3.47 3.47h3.19a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 1 .75-.75Zm6 12a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V16.81l-3.47 3.47a.75.75 0 0 1-1.06-1.06l3.47-3.47H9.75a.75.75 0 0 1 0-1.5h4.5a.75.75 0 0 1 .75.75Z" clipRule="evenodd" /></svg>);
const SubtitleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M21.75 4.5a3 3 0 0 0-3-3h-12a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V4.5ZM8.25 12a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Zm-1.5 3.75a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75ZM9 8.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5H9.75A.75.75 0 0 1 9 8.25Z" /></svg>);
const AudioTrackIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" /><path d="M6 10.5a.75.75 0 0 1 .75.75v.75a4.5 4.5 0 0 0 9 0v-.75a.75.75 0 0 1 1.5 0v.75a6 6 0 1 1-12 0v-.75a.75.75 0 0 1 .75-.75Z" /></svg>);
const SeekForwardIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" /></svg>);
const SeekBackwardIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" /></svg>);

// --- HELPER COMPONENTS ---
// Fix: Define EpisodeListItem as a React.FC to correctly handle the 'key' prop during list rendering.
const EpisodeListItem: React.FC<{ animeId: string; episode: Episode; isActive: boolean }> = ({ animeId, episode, isActive }) => (
    <Link to={`/watch/${animeId}/${episode.id}`} className={`flex items-center gap-4 p-2 rounded-lg transition-colors ${isActive ? 'bg-purple-600/30' : 'hover:bg-slate-700/80'}`}>
        <img src={episode.thumbnailUrl} alt={episode.title} className="w-28 h-auto object-cover aspect-video rounded-md flex-shrink-0" />
        <div className="flex-grow overflow-hidden">
            <p className={`font-semibold text-sm truncate ${isActive ? 'text-purple-300' : 'text-white'}`}>E{episode.episodeNumber} - {episode.title}</p>
            <p className="text-xs text-gray-400">Episode {episode.episodeNumber}</p>
        </div>
    </Link>
);

// --- MAIN COMPONENT ---
const WatchPage: React.FC = () => {
    const { animeId, episodeId } = useParams<{ animeId: string; episodeId: string }>();
    const navigate = useNavigate();
    const { animeList } = useAnimeData();

    // Fix: Correctly type the `anime` state to avoid type errors when rendering.
    const [anime, setAnime] = useState<Anime | undefined>(undefined);
    const [currentEpisode, setCurrentEpisode] = useState<Episode | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    const videoRef = useRef<HTMLVideoElement>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const timeToSeekRef = useRef<number | null>(null);
    const lastClickTimeRef = useRef(0);
    const lastClickSideRef = useRef<'left' | 'right' | null>(null);

    const [isPlaying, setIsPlaying] = useState(true);
    const [isBuffering, setIsBuffering] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isControlsVisible, setIsControlsVisible] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isSubtitleMenuOpen, setIsSubtitleMenuOpen] = useState(false);
    const [isAudioMenuOpen, setIsAudioMenuOpen] = useState(false);
    const [activeTrack, setActiveTrack] = useState<{ lang: string; url: string; } | undefined>(undefined);
    const [seekIndicator, setSeekIndicator] = useState<{ direction: 'forward' | 'backward', key: number } | null>(null);
    
    let controlsTimeout = useRef<number | null>(null);

    // --- Effects ---
    useEffect(() => {
        setIsLoading(true);
        const foundAnime = animeList.find(a => a.id === animeId);
        const foundEpisode = foundAnime?.episodes.find(e => e.id === episodeId);
        
        setAnime(foundAnime);
        setCurrentEpisode(foundEpisode);
        setActiveTrack(foundEpisode?.tracks[0]);
        setCurrentTime(0);
        setDuration(0);
        setIsPlaying(true);
        setIsLoading(false);
    }, [episodeId, animeId, animeList]);


    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;
      
      const handleTimeUpdate = () => setCurrentTime(video.currentTime);
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleLoadedMetadata = () => {
        setDuration(video.duration);
        if (timeToSeekRef.current !== null) {
            video.currentTime = timeToSeekRef.current;
            timeToSeekRef.current = null;
        }
      };
      
      const handleBuffering = () => setIsBuffering(true);
      const handleCanPlay = () => setIsBuffering(false);

      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('waiting', handleBuffering);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('playing', handleCanPlay);
      
      return () => {
          video.removeEventListener('timeupdate', handleTimeUpdate);
          video.removeEventListener('loadedmetadata', handleLoadedMetadata);
          video.removeEventListener('play', handlePlay);
          video.removeEventListener('pause', handlePause);
          video.removeEventListener('waiting', handleBuffering);
          video.removeEventListener('canplay', handleCanPlay);
          video.removeEventListener('playing', handleCanPlay);
      };
    }, [activeTrack]);

    useEffect(() => {
        const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // --- Handlers ---
    const togglePlayPause = () => {
        const video = videoRef.current;
        if (video) video.paused ? video.play() : video.pause();
    };
    
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const video = videoRef.current;
        if (video) video.currentTime = (Number(e.target.value) / 100) * duration;
    };
    
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = Number(e.target.value);
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
        if (videoRef.current) videoRef.current.volume = newVolume;
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if(video){
            video.muted = !video.muted;
            setIsMuted(video.muted);
            if(!video.muted) setVolume(video.volume === 0 ? 0.5 : video.volume);
        }
    };

    const toggleFullscreen = () => {
        const container = playerContainerRef.current;
        if (!container) return;
        if (!document.fullscreenElement) container.requestFullscreen().catch(err => console.error(err));
        else document.exitFullscreen();
    };

    const handleMouseMove = () => {
        setIsControlsVisible(true);
        if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
        controlsTimeout.current = window.setTimeout(() => setIsControlsVisible(false), 3000);
    };

    const handleMouseLeave = () => {
        if (isPlaying) setIsControlsVisible(false);
    };

    const handleSubtitleChange = (lang: string | null) => {
        const video = videoRef.current;
        if (!video) return;
        for (let i = 0; i < video.textTracks.length; i++) {
            const track = video.textTracks[i];
            track.mode = track.language === lang ? 'showing' : 'hidden';
        }
        setIsSubtitleMenuOpen(false);
    };
    
    const handleAudioTrackChange = (track: {lang: string, url: string}) => {
        if (videoRef.current) {
            timeToSeekRef.current = videoRef.current.currentTime;
            setIsPlaying(!videoRef.current.paused);
        }
        setActiveTrack(track);
        setIsAudioMenuOpen(false);
    };

    const handlePlayerClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target !== e.currentTarget) return; // Ignore clicks on controls
        const now = Date.now();
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const side = clickX < rect.width / 2 ? 'left' : 'right';

        if (now - lastClickTimeRef.current < 300 && lastClickSideRef.current === side) { // Double click
            const video = videoRef.current;
            if (!video) return;
            if (side === 'left') {
                video.currentTime = Math.max(0, video.currentTime - 10);
                setSeekIndicator({ direction: 'backward', key: now });
            } else {
                video.currentTime += 10;
                setSeekIndicator({ direction: 'forward', key: now });
            }
            lastClickTimeRef.current = 0;
        } else { // Single click
            togglePlayPause();
            lastClickTimeRef.current = now;
            lastClickSideRef.current = side;
        }
    };

    // --- Formatting ---
    const formatTime = (timeInSeconds: number) => {
        const date = new Date(0);
        date.setSeconds(timeInSeconds);
        const timeString = date.toISOString().substr(11, 8);
        return timeString.startsWith("00:") ? timeString.substr(3) : timeString;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (!anime || !currentEpisode || !activeTrack) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h1 className="text-2xl text-white">Episode not found!</h1>
                    <button onClick={() => navigate(-1)} className="mt-4 text-purple-400 hover:underline">Go back</button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-slate-900 text-white">
            <style>{`
                @keyframes fadeOut {
                  from { opacity: 1; transform: scale(1); }
                  to { opacity: 0; transform: scale(1.3); }
                }
                .animate-fade-out {
                  animation: fadeOut 0.5s ease-out forwards;
                }
            `}</style>
            <div className="flex-grow lg:w-3/4">
                <div 
                    ref={playerContainerRef}
                    className="relative aspect-video bg-black w-full cursor-pointer"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={handlePlayerClick}
                >
                    <video ref={videoRef} src={activeTrack.url} autoPlay className="w-full h-full" key={activeTrack.url} crossOrigin="anonymous">
                        {currentEpisode.subtitles?.map(sub => (
                             <track key={sub.lang} kind="subtitles" srcLang={sub.lang.toLowerCase().substring(0, 2)} label={sub.lang} src={sub.url} />
                        ))}
                        Your browser does not support the video tag.
                    </video>

                    {isBuffering && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
                            <LoadingSpinner />
                        </div>
                    )}

                    {seekIndicator && (
                        <div key={seekIndicator.key} className={`absolute inset-y-0 flex items-center justify-center w-1/3 animate-fade-out ${seekIndicator.direction === 'backward' ? 'left-0' : 'right-0'}`}>
                            <div className="bg-black/50 rounded-full p-3 text-white">
                                {seekIndicator.direction === 'backward' ? <SeekBackwardIcon /> : <SeekForwardIcon />}
                            </div>
                        </div>
                    )}

                    <div 
                        onClick={e => e.stopPropagation()}
                        className={`absolute inset-0 transition-opacity duration-300 ${isControlsVisible ? 'opacity-100' : 'opacity-0'}`}
                    >
                       <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none"></div>
                       <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 text-white">
                            <div className="flex items-center gap-2 sm:gap-4">
                               <button onClick={togglePlayPause} className="w-8 h-8 flex-shrink-0">{isPlaying ? <PauseIcon /> : <PlayIcon />}</button>
                               <div className="text-xs sm:text-sm">{formatTime(currentTime)} / {formatTime(duration)}</div>
                               <input type="range" min="0" max="100" value={(currentTime/duration)*100 || 0} onChange={handleSeek} className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                               <div className="flex items-center gap-1 sm:gap-2 relative">
                                    <button onClick={toggleMute}>{isMuted || volume === 0 ? <VolumeOffIcon /> : <VolumeHighIcon />}</button>
                                    <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500 hidden md:block" />
                                     
                                    {currentEpisode.tracks.length > 1 && (
                                        <div className="relative">
                                            <button onClick={() => setIsAudioMenuOpen(o => !o)}><AudioTrackIcon /></button>
                                            {isAudioMenuOpen && (
                                                <div className="absolute bottom-full right-0 mb-2 bg-slate-800/90 rounded-md py-1 text-sm w-28">
                                                    {currentEpisode.tracks.map(track => (
                                                        <button key={track.lang} onClick={() => handleAudioTrackChange(track)} className={`block w-full text-left px-3 py-1 hover:bg-slate-700 ${activeTrack.lang === track.lang ? 'font-bold text-purple-300' : ''}`}>{track.lang}</button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {currentEpisode.subtitles && currentEpisode.subtitles.length > 0 && (
                                        <div className="relative">
                                            <button onClick={() => setIsSubtitleMenuOpen(o => !o)}><SubtitleIcon /></button>
                                            {isSubtitleMenuOpen && (
                                                <div className="absolute bottom-full right-0 mb-2 bg-slate-800/90 rounded-md py-1 text-sm w-28">
                                                    <button onClick={() => handleSubtitleChange(null)} className="block w-full text-left px-3 py-1 hover:bg-slate-700">Off</button>
                                                    {currentEpisode.subtitles.map(sub => (
                                                        <button key={sub.lang} onClick={() => handleSubtitleChange(sub.lang.toLowerCase().substring(0, 2))} className="block w-full text-left px-3 py-1 hover:bg-slate-700">{sub.lang}</button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <button onClick={toggleFullscreen}>{isFullscreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}</button>
                               </div>
                            </div>
                       </div>
                    </div>
                </div>
                <div className="p-4 sm:p-6 lg:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">{currentEpisode.title}</h1>
                    <p className="text-gray-400 mt-1">
                        <Link to={`/anime/${anime.id}`} className="hover:text-purple-400 transition-colors">{anime.title}</Link> - Episode {currentEpisode.episodeNumber}
                    </p>
                    <div className="mt-4 pt-4 border-t border-slate-700">
                        <h3 className="font-bold mb-2">Synopsis</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{anime.description}</p>
                    </div>
                </div>
            </div>
            
            <aside className="w-full lg:w-1/4 lg:max-w-sm flex-shrink-0 bg-slate-800/50 lg:border-l lg:border-slate-700">
                <div className="p-4"><h2 className="text-xl font-bold mb-4">Episodes</h2></div>
                <div className="lg:max-h-[calc(100vh-80px)] lg:overflow-y-auto px-4 pb-4">
                    <div className="flex flex-col gap-3">
                        {anime.episodes.map(ep => <EpisodeListItem key={ep.id} animeId={anime.id} episode={ep} isActive={ep.id === currentEpisode.id} />)}
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default WatchPage;