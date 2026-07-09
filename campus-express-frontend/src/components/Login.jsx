import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const sellRedirect = localStorage.getItem('sell_redirect');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {

            const response = await axios.post('https://campus-express-backend-pnkl.onrender.com/api/auth/login', null, {
                params: {
                    username: username,
                    password: password
                }
            });

            console.log("Backend Se Response Aaya:", response.data);


            if (response.data === "Invalid Username or password!" || response.data.toString().includes("Error:")) {
                setError(response.data);
            } else {

                localStorage.setItem('campus_token', response.data);

                localStorage.setItem('campus_token', response.data);
                localStorage.removeItem('sell_redirect'); // clear karo

                if (sellRedirect) {
                    navigate('/sell'); // seedha sell page pe bhej do
                } else {
                    navigate('/dashboard');
                }
            }

        } catch (err) {
            console.error("Login Error:", err);
            setError("Kuch toh gadbad hai bhai! Check karo backend chalu hai ya nahi.");
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Brand */}
                <div className="flex items-center justify-center gap-2.5 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-white" aria-hidden="true">
                            <path d="M3 7h13l1.5 9H4.5L3 7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                            <path d="M16 9h3.2a1 1 0 01.96.73L21 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="8" cy="19" r="1.6" stroke="currentColor" strokeWidth="1.8" />
                            <circle cx="16" cy="19" r="1.6" stroke="currentColor" strokeWidth="1.8" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-slate-800">
                        Campus<span className="text-orange-500">Express</span>
                    </span>
                </div>

                <div className="bg-white w-full rounded-2xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100">

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
                        <p className="text-slate-500 mt-2">Log in to your Campus Express account</p>
                    </div>

                    {sellRedirect && (
                        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 text-orange-700 rounded-xl text-sm text-center font-medium">
                            Seller access activated! Please login again to continue.
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-colors"
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-colors pr-12"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? (
                                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                                            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                                            <path d="M1 1l22 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-200"
                        >
                            Sign In
                        </button>
                    </form>
                    <div className="text-center mt-6 text-sm text-slate-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-orange-500 font-semibold hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;