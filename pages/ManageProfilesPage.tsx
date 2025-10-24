
import React, { useState, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import type { UserProfile } from '../types';

const AVATARS = [
    './avatars/avatar1.png',
    './avatars/avatar2.png',
    './avatars/avatar3.png',
    './avatars/avatar4.png',
    './avatars/avatar5.png',
];

const PencilIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-8 h-8"}>
      <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
    </svg>
);

const PlusIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-12 h-12"}>
      <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </svg>
);

interface ProfileFormProps {
    profile?: UserProfile | null;
    onSave: (name: string, avatarUrl: string) => void;
    onCancel: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onSave, onCancel }) => {
    const [name, setName] = useState(profile?.name || '');
    const [avatar, setAvatar] = useState(profile?.avatarUrl || AVATARS[0]);
    const [error, setError] = useState('');
    const { deleteProfile, profiles } = useUser();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const isLastProfile = !!profile && profiles?.length === 1;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Name cannot be empty.');
            return;
        }
        onSave(name, avatar);
    };

    const handleDelete = async () => {
        if (profile && !isLastProfile && window.confirm(`Are you sure you want to delete the profile "${profile.name}"?`)) {
            const result = await deleteProfile(profile.id);
            if (!result.success) {
                alert(result.message);
            } else {
                onCancel(); // Close form after delete
            }
        }
    };
    
    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 p-8 rounded-lg w-full max-w-lg shadow-2xl">
                <h2 className="text-3xl font-bold mb-6">{profile ? 'Edit Profile' : 'Add Profile'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                        <div className="relative group w-36 h-36 flex-shrink-0">
                            <img src={avatar} alt="Selected Avatar" className="w-full h-full object-cover rounded-md bg-slate-700" />
                            <button
                                type="button"
                                onClick={handleAvatarClick}
                                className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
                                aria-label="Change avatar"
                            >
                                <PencilIcon className="w-8 h-8"/>
                                <span className="sr-only">Change Avatar</span>
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/png, image/jpeg, image/webp"
                            />
                        </div>
                        <div className="flex-grow w-full">
                            <label htmlFor="profileName" className="sr-only">Profile Name</label>
                            <input
                                id="profileName"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Profile Name"
                                className="w-full bg-slate-700 text-white placeholder-gray-400 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                             {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                        </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-3">Or choose a default avatar</h3>
                    <div className="flex flex-wrap gap-4 mb-8">
                        {AVATARS.map(avatarUrl => (
                            <button
                                type="button"
                                key={avatarUrl}
                                onClick={() => setAvatar(avatarUrl)}
                                className={`w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden transition-all transform hover:scale-105 ${avatar === avatarUrl ? 'ring-4 ring-purple-500' : 'ring-2 ring-transparent'}`}
                            >
                                <img src={avatarUrl} alt="Avatar option" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">Save</button>
                        <button type="button" onClick={onCancel} className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded-lg transition-colors">Cancel</button>
                        {profile && (
                             <button 
                                type="button" 
                                onClick={handleDelete}
                                disabled={isLastProfile}
                                className="flex-1 bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-red-900/50 disabled:cursor-not-allowed"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                    {isLastProfile && (
                        <p className="text-center text-sm text-gray-400 mt-4">
                            You cannot delete your only profile.
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

const ManageProfilesPage: React.FC = () => {
    const { profiles, addProfile, updateProfile } = useUser();
    const navigate = useNavigate();
    const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const handleSaveProfile = async (name: string, avatarUrl: string) => {
        let result;
        if (editingProfile) {
            result = await updateProfile(editingProfile.id, name, avatarUrl);
        } else {
            result = await addProfile(name, avatarUrl);
        }

        if (result.success) {
            setEditingProfile(null);
            setIsAdding(false);
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-medium mb-8">Manage Profiles</h1>
                <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
                    {profiles?.map(profile => (
                        <div key={profile.id} onClick={() => setEditingProfile(profile)} className="group cursor-pointer">
                             <div className="relative w-24 h-24 md:w-36 md:h-36 rounded-md overflow-hidden bg-slate-700">
                                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <PencilIcon />
                                </div>
                            </div>
                            <p className="mt-2 text-gray-400 group-hover:text-white transition-colors text-center">{profile.name}</p>
                        </div>
                    ))}
                     {(profiles?.length || 0) < 5 && (
                        <div onClick={() => setIsAdding(true)} className="group cursor-pointer">
                             <div className="w-24 h-24 md:w-36 md:h-36 rounded-md bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-gray-400 group-hover:text-white transition-all">
                                <PlusIcon />
                            </div>
                            <p className="mt-2 text-gray-400 group-hover:text-white transition-colors text-center">Add Profile</p>
                        </div>
                    )}
                </div>
                <button onClick={() => navigate('/profiles')} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-md transition-colors text-lg font-semibold">
                    Done
                </button>
            </div>
            
            {(isAdding || editingProfile) && (
                <ProfileForm 
                    profile={editingProfile}
                    onSave={handleSaveProfile}
                    onCancel={() => {
                        setIsAdding(false);
                        setEditingProfile(null);
                    }}
                />
            )}

        </div>
    );
};

export default ManageProfilesPage;