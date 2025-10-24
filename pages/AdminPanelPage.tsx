import React, { useState } from 'react';
import { useAnimeData } from '../context/AnimeDataContext';
import type { Anime, Episode } from '../types';
import { useUser } from '../context/UserContext';
import { Navigate } from 'react-router-dom';

// --- ICONS ---
const TrashIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}>
      <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.006a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.9h1.368c1.603 0 2.816 1.336 2.816 2.9ZM5.516 7.12v12.238a1.5 1.5 0 0 0 1.5 1.442h8.968a1.5 1.5 0 0 0 1.5-1.442V7.12H5.516ZM9 9.75a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5A.75.75 0 0 1 9 9.75Zm4.5 0a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </svg>
);
const RefreshIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}>
        <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-4.518a.75.75 0 0 0-.75.75v4.518l1.903-1.903a5.997 5.997 0 0 0-10.042 2.762.75.75 0 0 1-1.41-.534A7.5 7.5 0 0 1 4.755 10.059Zm14.49 3.89a7.5 7.5 0 0 1-12.548 3.364l-1.903-1.903h4.518a.75.75 0 0 0 .75-.75V11.48l-1.903 1.903a5.997 5.997 0 0 0 10.042-2.762.75.75 0 0 1 1.41.534A7.5 7.5 0 0 1 19.245 13.959Z" clipRule="evenodd" />
    </svg>
);
const PlusIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}><path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" /></svg>
);
const ChevronDownIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}><path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" /></svg>
);

// --- HELPER COMPONENTS ---
const StatCard: React.FC<{title: string, value: number | string}> = ({title, value}) => (
    <div className="bg-slate-800 p-4 rounded-lg shadow-md">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
    </div>
);

const FileInputField: React.FC<{label: string, file: File | null, onFileChange: (file: File | null) => void, helpText?: string, accept?: string}> = ({label, file, onFileChange, helpText, accept}) => (
    <div className="w-full">
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <div className="flex items-center">
            <input type="file" onChange={(e) => onFileChange(e.target.files ? e.target.files[0] : null)} accept={accept} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"/>
        </div>
        {file && <p className="text-xs text-gray-500 mt-1">Selected: {file.name}</p>}
        {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
    </div>
);

// --- MAIN COMPONENT ---
const AdminPanelPage: React.FC = () => {
    const { isAdmin } = useUser();
    const { animeList, addAnime, deleteAnimeSeries, deleteAnimeEpisode, resetAnimeData } = useAnimeData();
    
    const [isAddFormVisible, setIsAddFormVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // --- State for the new series form ---
    const initialSeriesState = {
        title: '',
        releaseYear: new Date().getFullYear(),
        description: '',
        genres: '',
        rating: 0,
        posterFile: null as File | null,
        bannerFile: null as File | null,
        episodes: [] as any[],
    };
    const [newSeriesData, setNewSeriesData] = useState(initialSeriesState);

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    // --- Handlers ---
    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleResetData = () => {
        if (window.confirm('Are you sure you want to reset all anime data to the default catalog? This cannot be undone.')) {
            resetAnimeData();
            showToast("Anime catalog has been reset to default.");
        }
    };
    
    const handleDeleteSeries = (anime: Anime) => {
        if (window.confirm(`Are you sure you want to delete the entire series "${anime.title}"? This cannot be undone.`)) {
            deleteAnimeSeries(anime.id);
            showToast(`Series "${anime.title}" deleted.`);
        }
    };

    const handleDeleteEpisode = (animeId: string, episodeId: string, episodeTitle: string) => {
        if (window.confirm(`Are you sure you want to delete the episode "${episodeTitle}"?`)) {
            deleteAnimeEpisode(animeId, episodeId);
            showToast(`Episode "${episodeTitle}" deleted.`);
        }
    };
    
    // --- Form Handlers ---
    const handleSeriesInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewSeriesData(prev => ({ ...prev, [name]: value }));
    };

    const handleEpisodeChange = (epIndex: number, field: string, value: any) => {
        const updatedEpisodes = [...newSeriesData.episodes];
        updatedEpisodes[epIndex][field] = value;
        setNewSeriesData(prev => ({ ...prev, episodes: updatedEpisodes }));
    };

    const handleTrackChange = (epIndex: number, trackIndex: number, field: string, value: any) => {
        const updatedEpisodes = [...newSeriesData.episodes];
        updatedEpisodes[epIndex].tracks[trackIndex][field] = value;
        setNewSeriesData(prev => ({ ...prev, episodes: updatedEpisodes }));
    };

    const handleSubtitleChange = (epIndex: number, subIndex: number, field: string, value: any) => {
        const updatedEpisodes = [...newSeriesData.episodes];
        updatedEpisodes[epIndex].subtitles[subIndex][field] = value;
        setNewSeriesData(prev => ({ ...prev, episodes: updatedEpisodes }));
    };

    const addEpisode = () => {
        setNewSeriesData(prev => ({ ...prev, episodes: [...prev.episodes, { title: '', thumbnailFile: null, tracks: [{ lang: 'Japanese', videoFile: null }], subtitles: [] }] }));
    };
    
    const removeEpisode = (epIndex: number) => {
        setNewSeriesData(prev => ({ ...prev, episodes: prev.episodes.filter((_, i) => i !== epIndex) }));
    };

    const addTrack = (epIndex: number) => {
        const updatedEpisodes = [...newSeriesData.episodes];
        updatedEpisodes[epIndex].tracks.push({ lang: 'English', videoFile: null });
        setNewSeriesData(prev => ({ ...prev, episodes: updatedEpisodes }));
    };

    const removeTrack = (epIndex: number, trackIndex: number) => {
        const updatedEpisodes = [...newSeriesData.episodes];
        updatedEpisodes[epIndex].tracks = updatedEpisodes[epIndex].tracks.filter((_: any, i: number) => i !== trackIndex);
        setNewSeriesData(prev => ({ ...prev, episodes: updatedEpisodes }));
    };
    
    const addSubtitle = (epIndex: number) => {
        const updatedEpisodes = [...newSeriesData.episodes];
        updatedEpisodes[epIndex].subtitles.push({ lang: 'English', subtitleFile: null });
        setNewSeriesData(prev => ({ ...prev, episodes: updatedEpisodes }));
    };

    const removeSubtitle = (epIndex: number, subIndex: number) => {
        const updatedEpisodes = [...newSeriesData.episodes];
        updatedEpisodes[epIndex].subtitles = updatedEpisodes[epIndex].subtitles.filter((_: any, i: number) => i !== subIndex);
        setNewSeriesData(prev => ({ ...prev, episodes: updatedEpisodes }));
    };

    const handleUploadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            const posterUrl = newSeriesData.posterFile ? await readFileAsDataURL(newSeriesData.posterFile) : './posters/placeholder.jpg';
            const bannerUrl = newSeriesData.bannerFile ? await readFileAsDataURL(newSeriesData.bannerFile) : './banners/placeholder.jpg';
            
            const episodesWithDataUrls = await Promise.all(
                newSeriesData.episodes.map(async (ep, index) => {
                    const thumbnailUrl = ep.thumbnailFile ? await readFileAsDataURL(ep.thumbnailFile) : './thumbnails/placeholder.jpg';
                    const tracks = await Promise.all(
                        ep.tracks.map(async (track: any) => ({
                            lang: track.lang,
                            url: track.videoFile ? await readFileAsDataURL(track.videoFile) : './videos/placeholder.mp4'
                        }))
                    );
                    const subtitles = await Promise.all(
                        ep.subtitles.map(async (sub: any) => ({
                            lang: sub.lang,
                            url: sub.subtitleFile ? await readFileAsDataURL(sub.subtitleFile) : './subtitles/placeholder.vtt'
                        }))
                    );

                    return {
                        id: `ep-${Date.now()}-${index}`,
                        episodeNumber: index + 1,
                        title: ep.title,
                        thumbnailUrl,
                        tracks,
                        subtitles,
                    };
                })
            );

            const newAnime: Anime = {
                id: `anime-${Date.now()}`,
                title: newSeriesData.title,
                description: newSeriesData.description,
                posterUrl,
                bannerUrl,
                releaseYear: Number(newSeriesData.releaseYear),
                rating: Number(newSeriesData.rating),
                genres: newSeriesData.genres.split(',').map(g => g.trim()),
                episodes: episodesWithDataUrls,
            };
            
            addAnime(newAnime);
            setNewSeriesData(initialSeriesState);
            setIsAddFormVisible(false);
            showToast(`Series "${newAnime.title}" was added successfully.`);

        } catch (error) {
            console.error("Error processing files for upload:", error);
            showToast("Error uploading files. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const totalEpisodes = animeList.reduce((sum, anime) => sum + anime.episodes.length, 0);

    return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* --- Header --- */}
        <div className="mb-8">
            <h1 className="text-4xl font-black text-white">Admin Panel</h1>
            <p className="text-gray-400 mt-1">Manage the AniVerse catalog.</p>
        </div>

        {/* --- Stat Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Series" value={animeList.length} />
            <StatCard title="Total Episodes" value={totalEpisodes} />
            <StatCard title="Admin User" value="admin@aniverse.io" />
        </div>

        {/* --- Add New Series Section --- */}
        <div className="bg-slate-800 rounded-lg shadow-lg mb-8">
            <button onClick={() => setIsAddFormVisible(prev => !prev)} className="w-full flex justify-between items-center p-4 text-left">
                <h2 className="text-xl font-bold">Add New Series</h2>
                <ChevronDownIcon className={`w-6 h-6 transition-transform ${isAddFormVisible ? 'rotate-180' : ''}`} />
            </button>
            {isAddFormVisible && (
                <form onSubmit={handleUploadSubmit} className="p-4 md:p-6 border-t border-slate-700 space-y-6">
                    {/* Series Details */}
                    <div className="p-4 border border-slate-700 rounded-md">
                        <h3 className="text-lg font-semibold mb-4">Series Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" name="title" placeholder="Series Title" value={newSeriesData.title} onChange={handleSeriesInputChange} required className="input-style" />
                            <input type="number" name="releaseYear" placeholder="Release Year" value={newSeriesData.releaseYear} onChange={handleSeriesInputChange} required className="input-style" />
                            <input type="text" name="genres" placeholder="Genres (comma-separated)" value={newSeriesData.genres} onChange={handleSeriesInputChange} required className="input-style" />
                            <input type="number" name="rating" placeholder="Rating (e.g., 8.9)" step="0.1" value={newSeriesData.rating} onChange={handleSeriesInputChange} required className="input-style" />
                            <textarea name="description" placeholder="Description" value={newSeriesData.description} onChange={handleSeriesInputChange} required className="input-style md:col-span-2 h-24"></textarea>
                            <FileInputField label="Poster Image" file={newSeriesData.posterFile} onFileChange={file => setNewSeriesData(p => ({...p, posterFile: file}))} accept="image/*" />
                            <FileInputField label="Banner Image" file={newSeriesData.bannerFile} onFileChange={file => setNewSeriesData(p => ({...p, bannerFile: file}))} accept="image/*" />
                        </div>
                    </div>
                    
                    {/* Episodes Section */}
                    <div className="p-4 border border-slate-700 rounded-md space-y-4">
                        <h3 className="text-lg font-semibold">Episodes</h3>
                        {newSeriesData.episodes.map((ep, epIndex) => (
                            <div key={epIndex} className="p-3 bg-slate-900/50 border border-slate-600 rounded-md space-y-3">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold">Episode {epIndex + 1}</p>
                                    <button type="button" onClick={() => removeEpisode(epIndex)} className="text-red-500 hover:text-red-400 text-sm">Remove Episode</button>
                                </div>
                                <input type="text" placeholder="Episode Title" value={ep.title} onChange={e => handleEpisodeChange(epIndex, 'title', e.target.value)} required className="input-style" />
                                <FileInputField label="Episode Thumbnail" file={ep.thumbnailFile} onFileChange={file => handleEpisodeChange(epIndex, 'thumbnailFile', file)} accept="image/*"/>
                                
                                <div className="pl-4 border-l-2 border-slate-600 space-y-2">
                                    <h4 className="text-sm font-semibold text-gray-300">Audio/Video Tracks</h4>
                                    {ep.tracks.map((track: any, trackIndex: number) => (
                                        <div key={trackIndex} className="flex gap-2 items-end">
                                            <input type="text" placeholder="Language (e.g., Japanese)" value={track.lang} onChange={e => handleTrackChange(epIndex, trackIndex, 'lang', e.target.value)} required className="input-style flex-1"/>
                                            <div className="flex-1"><FileInputField label="" file={track.videoFile} onFileChange={file => handleTrackChange(epIndex, trackIndex, 'videoFile', file)} helpText="Video File (.mp4)" accept="video/mp4"/></div>
                                            {ep.tracks.length > 1 && <button type="button" onClick={() => removeTrack(epIndex, trackIndex)} className="text-red-500 hover:text-red-400 p-1 mb-1"><TrashIcon /></button>}
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addTrack(epIndex)} className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"><PlusIcon className="w-4 h-4"/> Add Audio Track</button>
                                </div>

                                <div className="pl-4 border-l-2 border-slate-600 space-y-2">
                                    <h4 className="text-sm font-semibold text-gray-300">Subtitle Tracks</h4>
                                    {ep.subtitles.map((sub: any, subIndex: number) => (
                                        <div key={subIndex} className="flex gap-2 items-end">
                                            <input type="text" placeholder="Language (e.g., English)" value={sub.lang} onChange={e => handleSubtitleChange(epIndex, subIndex, 'lang', e.target.value)} required className="input-style flex-1"/>
                                            <div className="flex-1"><FileInputField label="" file={sub.subtitleFile} onFileChange={file => handleSubtitleChange(epIndex, subIndex, 'subtitleFile', file)} helpText="Subtitle File (.vtt)" accept=".vtt"/></div>
                                            <button type="button" onClick={() => removeSubtitle(epIndex, subIndex)} className="text-red-500 hover:text-red-400 p-1 mb-1"><TrashIcon /></button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addSubtitle(epIndex)} className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"><PlusIcon className="w-4 h-4"/> Add Subtitle Track</button>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addEpisode} className="bg-purple-600/50 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-md w-full flex items-center justify-center gap-2"><PlusIcon /> Add Episode</button>
                    </div>

                    <button type="submit" disabled={isUploading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg disabled:bg-purple-800 disabled:cursor-not-allowed">
                        {isUploading ? 'Uploading...' : 'Upload Series'}
                    </button>
                </form>
            )}
        </div>

        {/* --- Manage Content Section --- */}
        <div className="bg-slate-800 rounded-lg shadow-lg p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Manage Content</h2>
                <button onClick={handleResetData} className="flex items-center gap-2 bg-red-800/80 hover:bg-red-700 text-white text-sm font-semibold py-1.5 px-3 rounded-md transition-colors"><RefreshIcon className="w-4 h-4" /> Reset Catalog</button>
            </div>
            <div className="space-y-4">
                {animeList.length > 0 ? animeList.map(anime => (
                    <details key={anime.id} className="bg-slate-900/50 rounded-lg group">
                        <summary className="flex justify-between items-center p-3 cursor-pointer">
                            <div className="flex items-center gap-4">
                                <img src={anime.posterUrl} alt={anime.title} className="w-12 h-auto aspect-[2/3] object-cover rounded-sm" />
                                <div>
                                    <p className="font-bold">{anime.title}</p>
                                    <p className="text-xs text-gray-400">{anime.episodes.length} Episodes</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                               <button onClick={(e) => { e.stopPropagation(); handleDeleteSeries(anime); }} className="text-gray-400 hover:text-red-400 transition-colors"><TrashIcon /></button>
                               <ChevronDownIcon className="w-5 h-5 group-open:rotate-180 transition-transform"/>
                            </div>
                        </summary>
                        <div className="border-t border-slate-700 p-3 space-y-2">
                            {anime.episodes.length > 0 ? (
                                anime.episodes.map(ep => (
                                    <div key={ep.id} className="flex justify-between items-center bg-slate-700/50 p-2 rounded-md">
                                        <p className="text-sm text-gray-300">E{ep.episodeNumber}: {ep.title}</p>
                                        <button onClick={() => handleDeleteEpisode(anime.id, ep.id, ep.title)} className="text-gray-400 hover:text-red-400 transition-colors" aria-label={`Delete episode ${ep.title}`}><TrashIcon /></button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 italic text-center p-2">This series has no episodes.</p>
                            )}
                        </div>
                    </details>
                )) : (
                    <div className="text-center py-10"><p className="text-gray-500">The catalog is empty.</p></div>
                )}
            </div>
        </div>
        
        {/* Toast Notification */}
        {toastMessage && (
            <div className="fixed bottom-5 right-5 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-out">
                {toastMessage}
            </div>
        )}
    </div>
  );
};

export default AdminPanelPage;
<style>
{`
.input-style {
    width: 100%;
    background-color: #334155; /* bg-slate-700 */
    color: white;
    padding: 0.75rem;
    border-radius: 0.375rem;
    border: 1px solid #475569; /* border-slate-600 */
}
.input-style::placeholder {
    color: #94a3b8; /* placeholder-gray-400 */
}
.input-style:focus {
    outline: none;
    box-shadow: 0 0 0 2px #a855f7; /* ring-2 ring-purple-500 */
    border-color: #a855f7; /* border-purple-500 */
}
@keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes fade-out {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(10px); }
}
.animate-fade-in-out {
    animation: fade-in 0.3s ease-out forwards, fade-out 0.3s ease-in 2.7s forwards;
}
`}
</style>