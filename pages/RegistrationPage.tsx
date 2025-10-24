import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const RegistrationPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const { register } = useUser();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError("Please enter your name.");
            return;
        }

        setIsLoading(true);
        const result = await register(email, password, name);
        setIsLoading(false);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-slate-800 rounded-lg shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-black text-white">Create an Account</h1>
                    <p className="mt-2 text-gray-400">Join AniVerse today</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                         <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="appearance-none relative block w-full px-3 py-2 border border-slate-600 bg-slate-700 text-gray-200 placeholder-gray-400 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="name" className="sr-only">Your Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="appearance-none relative block w-full px-3 py-2 border border-slate-600 bg-slate-700 text-gray-200 placeholder-gray-400 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                placeholder="Your Name"
                            />
                        </div>
                        <div>
                            <label htmlFor="password-address" className="sr-only">Password</label>
                             <input
                                id="password-address"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="appearance-none relative block w-full px-3 py-2 border border-slate-600 bg-slate-700 text-gray-200 placeholder-gray-400 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                    
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-slate-800 disabled:bg-purple-800 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating Account...' : 'Sign up'}
                        </button>
                    </div>
                </form>
                <p className="text-sm text-center text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-purple-400 hover:text-purple-300">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegistrationPage;