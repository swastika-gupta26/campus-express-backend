import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPanel() {
    const token = localStorage.getItem('campus_token');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingProductId, setDeletingProductId] = useState(null);
    const [deleteError, setDeleteError] = useState('');

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://campus-express-backend-pnkl.onrender.com/api/products/all', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProducts(response.data);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Could not load products.");
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchAllProducts();
    }, [token]);

    const handleDelete = async (productId) => {
        try {
            await axios.delete(`https://campus-express-backend-pnkl.onrender.com/api/products/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(products.filter((p) => p.id !== productId));
            setDeletingProductId(null);
            setDeleteError('');
        } catch (err) {
            console.error("Error deleting product:", err);
            setDeleteError(err.response?.data?.message || "Failed to delete product.");
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
                <h1 className="text-2xl font-extrabold text-slate-900 mb-6">Admin — All Listings</h1>

                {loading && <p className="text-sm text-slate-500">Loading products...</p>}
                {error && <p className="text-sm text-red-600">{error}</p>}
                {!loading && !error && products.length === 0 && (
                    <p className="text-sm text-slate-500">No products found.</p>
                )}

                <div className="space-y-3">
                    {products.map((product) => (
                        <div key={product.id} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                            <div>
                                <p className="font-semibold text-slate-900">{product.name}</p>
                                <p className="text-sm text-slate-500">
                                    ₹{product.price} · {product.stockQuantity} in stock · by {product.createdByUsername}
                                </p>
                            </div>
                            <button
                                onClick={() => { setDeletingProductId(product.id); setDeleteError(''); }}
                                className="text-sm font-semibold text-red-500 hover:text-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {deletingProductId && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    onClick={() => { setDeletingProductId(null); setDeleteError(''); }}
                >
                    <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-bold text-slate-900 mb-1">Delete this listing?</h2>
                        <p className="text-sm text-slate-500 mb-4">This will permanently remove it, regardless of who posted it.</p>
                        {deleteError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{deleteError}</div>
                        )}
                        <div className="flex gap-3">
                            <button onClick={() => { setDeletingProductId(null); setDeleteError(''); }} className="flex-1 border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold py-2.5 rounded-xl text-sm">Cancel</button>
                            <button onClick={() => handleDelete(deletingProductId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl text-sm">Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPanel;