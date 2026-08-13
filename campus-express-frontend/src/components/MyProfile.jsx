import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyProfile() {
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        phoneNo: '',
        gender: '',
        dob: '',
        course: '',
        year: '',
        hostelName: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [saving, setSaving] = useState(false);

    const token = localStorage.getItem('campus_token');

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                setError('');

                console.log("Fetching profile with token:", token); // Control check for console

                const response = await axios.get('https://campus-express-backend-pnkl.onrender.com/api/user/my-profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("Backend Response Data:", response.data); // Dekhein backend ne kya bheja
                const data = response.data;

                setProfile({
                    username: data.username || '',
                    email: data.email || 'student@knit.ac.in',
                    gender: data.gender || 'Not Provided',
                    dob: data.dob || 'Not Provided',
                    phoneNo: data.phoneNumber || '',
                    hostelName: data.hostelName || '',
                    course: data.course || '',
                    year: data.year || ''
                });

            } catch (err) {
                console.error("Full Error Object:", err);

                setError(`Failed to load profile details. Status: ${err.response?.status || 'Unknown'}`);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchProfileData();
        } else {
            window.location.href = '/';
        }
    }, [token]);

    const handleSave = async (e) => {
        e.preventDefault();

        if (profile.phoneNo && profile.phoneNo.length !== 10) {
            setError("Phone number must be exactly 10 digits.");
            return;
        }

        setSaving(true);
        setError('');
        setSuccess('');
        try {
            await axios.put('https://campus-express-backend-pnkl.onrender.com/api/user/my-profile', {
                email: profile.email,
                phoneNumber: profile.phoneNo,
                hostelName: profile.hostelName,
                course: profile.course,
                year: profile.year
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess("Profile updated successfully!");
        } catch (err) {
            setError("Failed to update profile. Try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-12 text-orange-500 font-bold">Loading your Campus ID...</div>;

    return (
        <div className="min-h-screen bg-orange-50 p-6 flex flex-col items-center">
            {/* Back Button */}
            <div className="w-full max-w-2xl mb-4">
                <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                    ← Back to Marketplace
                </button>
            </div>

            <div className="bg-white w-full max-w-2xl rounded-3xl p-8 shadow-xl border border-slate-100">
                <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Campus Profile Card</h1>
                <p className="text-sm text-slate-500 mb-6">Your registration details are locked, other campus info can be edited.</p>

                {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>}
                {success && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl text-sm">{success}</div>}

                <form onSubmit={handleSave} className="space-y-6">
                    {/* Locked Registration Fields */}
                    <div className="bg-slate-50 p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 border border-slate-100">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Username (Locked)</label>
                            <input type="text" value={profile.username} disabled className="w-full bg-transparent font-medium text-slate-700 outline-none" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Gender (From Registration)</label>
                            <input type="text" value={profile.gender || 'Not Provided'} disabled className="w-full bg-transparent font-medium text-slate-700 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date of Birth (From Registration)</label>
                            <input type="text" value={profile.dob || 'Not Provided'} disabled className="w-full bg-transparent font-medium text-slate-700 outline-none" />
                        </div>
                    </div>

                    {/* Editable Campus Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
                            <input
                                type="tel"
                                value={profile.phoneNo || ''}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    setProfile({...profile, phoneNo: value});
                                }}
                                maxLength={10}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition"
                                placeholder="10-digit number"
                            />
                            {profile.phoneNo && profile.phoneNo.length !== 10 && (
                                <p className="text-xs text-red-500 mt-1">Phone number must be exactly 10 digits.</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hostel Name</label>
                            <input
                                type="text"
                                value={profile.hostelName || ''}
                                onChange={(e) => setProfile({...profile, hostelName: e.target.value})}
                                placeholder="e.g., Maitreyi Hostel"
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Course / Branch</label>
                            <input
                                type="text"
                                value={profile.course || ''}
                                onChange={(e) => setProfile({...profile, course: e.target.value})}
                                placeholder="e.g., B.Tech IT"
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Year</label>
                            <input
                                type="text"
                                value={profile.year || ''}
                                onChange={(e) => setProfile({...profile, year: e.target.value})}
                                placeholder="e.g., 3rd Year"
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm"
                    >
                        {saving ? 'Saving...' : 'Update Campus Card'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default MyProfile;