import React, { useState, useEffect } from 'react';
import axios from 'axios';

function OrderHistory() {
    const token = localStorage.getItem('campus_token');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://campus-express-backend-pnkl.onrender.com/api/orders/my-orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const delivered = response.data.filter(
                    (o) => o.status === 'DELIVERED'
                );
                setOrders(delivered);
            } catch (err) {
                console.error("Error fetching order history:", err);
                setError("Could not load order history.");
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchOrders();
        } else {
            window.location.href = '/';
        }
    }, [token]);

    return (
        <div className="min-h-screen bg-orange-50 p-6 flex flex-col items-center pb-24 md:pb-6">
            <div className="w-full max-w-2xl mb-4">
                <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                    ← Back to Marketplace
                </button>
            </div>

            <div className="bg-white w-full max-w-2xl rounded-3xl p-8 shadow-xl border border-slate-100">
                <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Order History</h1>
                <p className="text-sm text-slate-500 mb-6">Your delivered / completed orders.</p>

                {loading && <p className="text-sm text-slate-500">Loading history...</p>}
                {error && <p className="text-sm text-red-600">{error}</p>}
                {!loading && !error && orders.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-slate-500 font-medium">No completed orders yet.</p>
                        <button
                            onClick={() => window.location.href = '/dashboard'}
                            className="mt-4 inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                        >
                            Browse Marketplace
                        </button>
                    </div>
                )}

                <div className="space-y-3">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                            <div className="flex items-center justify-between">
                                <p className="font-semibold text-slate-900">
                                    {order.productSnapshot || order.productName || 'Unknown item'}
                                </p>


                                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600">
                                    {order.status}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">
                                Qty: {order.quantity} · ₹{order.totalPrice}
                            </p>
                            {order.orderDate && (
                                <p className="text-xs text-slate-400 mt-0.5">
                                    📦 Ordered: {new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                            )}
                            {order.deliveredAt && (
                                <p className="text-xs text-slate-400 mt-0.5">
                                    ✅ Delivered: {new Date(order.deliveredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default OrderHistory;
