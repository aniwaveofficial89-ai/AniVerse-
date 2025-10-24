import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const PlusIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-12 h-12"}>
      <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </svg>
);


const ProfileSelectionPage: React.FC = () => {
    const { profiles, setActiveProfile } = useUser();
    const navigate = useNavigate();

    const handleProfileSelect = (profileId: string) => {
        setActiveProfile(profileId);
        navigate('/');
    };

    if (!profiles) {
        return null; // Or a loading spinner
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-medium mb-8">Who's watching?</h1>
                <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
                    {profiles.map(profile => (
                        <div key={profile.id} onClick={() => handleProfileSelect(profile.id)} className="group cursor-pointer">
                            <div className="w-24 h-24 md:w-36 md:h-36 rounded-md overflow-hidden bg-slate-700 group-hover:ring-4 ring-purple-500 transition-all">
                                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                            </div>
                            <p className="mt-2 text-gray-400 group-hover:text-white transition-colors text-center">{profile.name}</p>
                        </div>
                    ))}
                     {profiles.length < 5 && (
                        <Link to="/profiles/manage" className="group cursor-pointer">
                             <div className="w-24 h-24 md:w-36 md:h-36 rounded-md bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-gray-400 group-hover:text-white transition-all">
                                <PlusIcon />
                            </div>
                            <p className="mt-2 text-gray-400 group-hover:text-white transition-colors text-center">Add Profile</p>
                        </Link>
                    )}
                </div>
                <Link to="/profiles/manage" className="border border-gray-500 text-gray-400 hover:text-white hover:border-white px-6 py-2 rounded-md transition-colors">
                    Manage Profiles
                </Link>
            </div>
        </div>
    );
};

export default ProfileSelectionPage;