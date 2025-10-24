import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const SearchIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
    </svg>
);

const MenuIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const XMarkIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

const Header: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, isAdmin, logout } = useUser();
    
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsUserDropdownOpen(false);
    }, [location.pathname]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsUserDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };
    
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${isScrolled ? 'bg-slate-950/80 backdrop-blur-sm' : 'bg-transparent'}`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        <div className="flex items-center space-x-8">
                            <Link to="/" className="text-2xl font-black text-white">
                                <span className="text-purple-500">Ani</span>Verse
                            </Link>
                            <nav className="hidden md:flex space-x-6 text-sm font-medium">
                                <NavLink to="/" className={({isActive}) => `transition-colors hover:text-purple-400 ${isActive ? 'text-white' : 'text-gray-300'}`}>Home</NavLink>
                                <NavLink to="/browse" className={({isActive}) => `transition-colors hover:text-purple-400 ${isActive ? 'text-white' : 'text-gray-300'}`}>Browse</NavLink>
                                <NavLink to="/my-list" className={({isActive}) => `transition-colors hover:text-purple-400 ${isActive ? 'text-white' : 'text-gray-300'}`}>My List</NavLink>
                                {isAdmin && (
                                  <NavLink to="/admin" className={({isActive}) => `transition-colors hover:text-purple-400 ${isActive ? 'text-white' : 'text-gray-300'}`}>Admin</NavLink>
                                )}
                            </nav>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
                                <input
                                    type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="bg-slate-800/70 text-white placeholder:text-gray-400 rounded-full py-1.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-slate-800 transition-all w-40 focus:w-56"
                                />
                                <button type="submit" className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-white">
                                    <SearchIcon className="w-4 h-4" />
                                </button>
                            </form>

                            {currentUser && (
                                <div ref={dropdownRef} className="relative hidden md:block">
                                    <button onClick={() => setIsUserDropdownOpen(o => !o)} className="flex items-center gap-2">
                                        <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full" />
                                    </button>
                                    {isUserDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg py-1 text-sm">
                                            <div className="px-3 py-2 border-b border-slate-700">
                                                <p className="font-semibold text-white">{currentUser.name}</p>
                                                <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                                            </div>
                                            <Link to="/my-list" className="block px-3 py-2 text-gray-300 hover:bg-slate-700">My List</Link>
                                            {isAdmin && (
                                              <Link to="/admin" className="block px-3 py-2 text-gray-300 hover:bg-slate-700">Admin Panel</Link>
                                            )}
                                            <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-gray-300 hover:bg-slate-700">Sign Out</button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="md:hidden">
                                <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-300 hover:text-white" aria-label="Open menu">
                                    <MenuIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className={`fixed inset-0 z-50 transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsMobileMenuOpen(false)} aria-hidden={!isMobileMenuOpen}>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            </div>
            <div className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-slate-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <div className="p-4 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        {currentUser ? (
                            <div className="flex items-center gap-3">
                                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full" />
                                <span className="font-semibold">{currentUser.name}</span>
                            </div>
                        ) : (
                             <Link to="/" className="text-2xl font-black text-white"><span className="text-purple-500">Ani</span>Verse</Link>
                        )}
                        <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white" aria-label="Close menu"><XMarkIcon className="w-6 h-6" /></button>
                    </div>
                    
                    <form onSubmit={handleSearchSubmit} className="relative mb-6">
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full bg-slate-800 text-white placeholder:text-gray-400 rounded-md py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        <button type="submit" className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-white" aria-label="Search"><SearchIcon className="w-5 h-5" /></button>
                    </form>

                    <nav className="flex flex-col space-y-2 text-lg flex-grow">
                        <NavLink to="/" className={({isActive}) => `px-3 py-2 rounded-md ${isActive ? 'bg-slate-800 text-white' : 'text-gray-300 hover:bg-slate-800'}`}>Home</NavLink>
                        <NavLink to="/browse" className={({isActive}) => `px-3 py-2 rounded-md ${isActive ? 'bg-slate-800 text-white' : 'text-gray-300 hover:bg-slate-800'}`}>Browse</NavLink>
                        <NavLink to="/my-list" className={({isActive}) => `px-3 py-2 rounded-md ${isActive ? 'bg-slate-800 text-white' : 'text-gray-300 hover:bg-slate-800'}`}>My List</NavLink>
                        {isAdmin && (
                            <NavLink to="/admin" className={({isActive}) => `px-3 py-2 rounded-md ${isActive ? 'bg-slate-800 text-white' : 'text-gray-300 hover:bg-slate-800'}`}>Admin</NavLink>
                        )}
                    </nav>

                    <div className="mt-auto border-t border-slate-700 pt-4">
                         <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-md text-gray-300 hover:bg-slate-800 text-lg">Sign Out</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;