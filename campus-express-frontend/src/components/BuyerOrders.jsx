import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BuyerOrders() {
    const token = localStorage.getItem('campus_token');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    const [cancellingOrderId, setCancellingOrderId] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelling, setCancelling] = useState(false);
    const [cancelError, setCancelError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:8080/api/orders/my-orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError("Could not load your orders.");
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

    const handleCancelOrder = async () => {
        if (!cancelReason.trim()) {
            setCancelError("Please provide a reason for cancellation.");
            return;
        }
        setCancelling(true);
        setCancelError('');
        try {
            await axios.put(`http://localhost:8080/api/orders/${cancellingOrderId}/cancel`,
                { reason: cancelReason },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setOrders(orders.filter((o) => o.id !== cancellingOrderId));
            setCancellingOrderId(null);
            setCancelReason('');
        } catch (err) {
            setCancelError(err.response?.data || "Failed to cancel order.");
        } finally {
            setCancelling(false);
        }
    };

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
                <h1 className="text-2xl font-extrabold text-slate-900 mb-1">My Orders</h1>
                <p className="text-sm text-slate-500 mb-6">All your orders and their current status.</p>

                {loading && <p className="text-sm text-slate-500">Loading orders...</p>}
                {error && <p className="text-sm text-red-600">{error}</p>}
                {!loading && !error && orders.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-slate-500 font-medium">No pending orders.</p>
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
                                    {order.productName || 'Unknown item'}
                                </p>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                                    order.status === 'CANCELLED'
                                        ? 'bg-red-50 text-red-500'
                                        : order.status === 'DELIVERED'
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : order.status === 'PROCESSING'
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'bg-amber-50 text-amber-600'
                                }`}>
                                    {order.status || 'PENDING'}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">
                                Qty: {order.quantity} · ₹{order.totalPrice}
                            </p>
                            {order.orderDate && (
                                <p className="text-xs text-slate-400 mt-0.5">
                                    🕐 Ordered: {new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                            )}
                            <button
                                onClick={() => {
                                    setCancellingOrderId(order.id);
                                    setCancelReason('');
                                    setCancelError('');
                                }}
                                className="mt-2 text-xs font-semibold text-red-500 hover:text-red-600"
                            >
                                Cancel Order
                            </button>
                        </div>
                    ))}
                </div>
            </div>


            {cancellingOrderId && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    onClick={() => setCancellingOrderId(null)}
                >
                    <div
                        className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-lg font-bold text-slate-900 mb-1">Cancel Order</h2>
                        <p className="text-sm text-slate-500 mb-4">Please tell us why you're cancelling.</p>

                        {cancelError && (
                            <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                                {cancelError}
                            </div>
                        )}

                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="e.g., Found a better price elsewhere..."
                            rows={3}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-red-400 transition resize-none mb-4"
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => setCancellingOrderId(null)}
                                className="flex-1 border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold py-2.5 rounded-xl text-sm transition-colors"
                            >
                                Keep Order
                            </button>
                            <button
                                onClick={handleCancelOrder}
                                disabled={cancelling}
                                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                            >
                                {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BuyerOrders;