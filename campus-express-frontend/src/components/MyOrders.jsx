import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyOrders() {
    const token = localStorage.getItem('campus_token');

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:8080/api/orders/my-sales', {
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

    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdatingOrderId(orderId);
        try {
            await axios.put(`http://localhost:8080/api/orders/${orderId}/status`,
                null,
                {
                    params: { newStatus },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setOrders(orders.map((o) =>
                o.id === orderId ? { ...o, status: newStatus } : o
            ));
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Failed to update order status.");
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const getNextStatus = (currentStatus) => {
        if (!currentStatus || currentStatus === 'PENDING') return 'PROCESSING';
        if (currentStatus === 'PROCESSING') return 'DELIVERED';
        return null;
    };

    const getNextStatusLabel = (currentStatus) => {
        if (!currentStatus || currentStatus === 'PENDING') return 'Mark as Processing';
        if (currentStatus === 'PROCESSING') return 'Mark as Delivered';
        return null;
    };

    return (
        <div className="min-h-screen bg-orange-50 p-6 flex flex-col items-center">
            <div className="w-full max-w-2xl mb-4">
                <button
                    onClick={() => window.location.href = '/sell'}
                    className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                    ← Back to Sell Item
                </button>
            </div>

            <div className="bg-white w-full max-w-2xl rounded-3xl p-8 shadow-xl border border-slate-100">
                <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Orders Received</h1>
                <p className="text-sm text-slate-500 mb-6">Orders placed for the items you're selling.</p>

                {loading && <p className="text-sm text-slate-500">Loading orders...</p>}
                {error && <p className="text-sm text-red-600">{error}</p>}
                {!loading && !error && orders.length === 0 && (
                    <p className="text-sm text-slate-500">No orders yet.</p>
                )}

                <div className="space-y-3">
                    {orders.map((order) => {
                        const nextStatus = getNextStatus(order.status);
                        const nextLabel = getNextStatusLabel(order.status);
                        const isUpdating = updatingOrderId === order.id;

                        return (
                            <div key={order.id} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold text-slate-900">
                                        {order.productSnapshot || order.productName || 'Unknown item'}
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
                                        🕐 {new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                )}

                                {order.buyerUsername && (
                                    <div className="mt-2 space-y-0.5">
                                        <p className="text-xs text-slate-400">👤 {order.buyerUsername}</p>
                                        {order.contactNumber && (
                                            <p className="text-xs text-slate-400">📞 {order.contactNumber}</p>
                                        )}
                                        {order.deliveryAddress && (
                                            <p className="text-xs text-slate-400">📍 {order.deliveryAddress}</p>
                                        )}
                                    </div>
                                )}

                                {order.cancelReason && (
                                    <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded-lg">
                                        <p className="text-xs text-red-500 font-semibold">Cancellation Reason:</p>
                                        <p className="text-xs text-red-400 mt-0.5">{order.cancelReason}</p>
                                    </div>
                                )}

                                {/* Status update button — sirf PENDING/PROCESSING pe dikhao */}
                                {nextStatus && (
                                    <button
                                        onClick={() => handleStatusUpdate(order.id, nextStatus)}
                                        disabled={isUpdating}
                                        className="mt-2 text-xs font-semibold px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white rounded-lg transition-colors"
                                    >
                                        {isUpdating ? 'Updating...' : nextLabel}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default MyOrders;
