import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Notifications() {
    const token = localStorage.getItem('campus_token');
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://campus-express-backend-pnkl.onrender.com/api/notifications', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotifications(response.data);
            } catch (err) {
                console.error("Error fetching notifications:", err);
                setError("Could not load notifications.");
            } finally {
                setLoading(false);
            }
        };
        if (token) {
            fetchNotifications();
        }
    }, [token]);

    const handleMarkAsRead = async (id) => {
        try {
            await axios.put(`https://campus-express-backend-pnkl.onrender.com/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
            ));
        } catch (err) {
            console.error("Error marking as read:", err);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 p-6 flex flex-col items-center">
            <div className="w-full max-w-2xl mb-4">
                <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                    ← Back to Marketplace
                </button>
            </div>

            <div className="bg-white w-full max-w-2xl rounded-3xl p-8 shadow-xl border border-slate-100">
                <h1 className="text-2xl font-extrabold text-slate-900 mb-6">Notifications</h1>

                {loading && <p className="text-sm text-slate-500">Loading notifications...</p>}
                {error && <p className="text-sm text-red-600">{error}</p>}
                {!loading && !error && notifications.length === 0 && (
                    <p className="text-sm text-slate-500">No notifications yet.</p>
                )}

                <div className="space-y-3">
                    {notifications.map((n) => (
                        <div
                            key={n.id}
                            onClick={() => !n.read && handleMarkAsRead(n.id)}
                            className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                                n.read
                                    ? 'bg-slate-50 border-slate-200'
                                    : 'bg-orange-50 border-orange-200 hover:bg-orange-100'
                            }`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <p className={`text-sm ${n.read ? 'text-slate-600' : 'text-slate-900 font-semibold'}`}>
                                    {n.message}
                                </p>
                                {!n.read && (
                                    <span className="h-2 w-2 rounded-full bg-orange-500 mt-1.5 shrink-0"/>
                                )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1.5">
                                {new Date(n.createdAt).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Notifications;