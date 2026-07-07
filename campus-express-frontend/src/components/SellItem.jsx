import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SellItem() {
    const token = localStorage.getItem('campus_token');

    const [newName, setNewName] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [newStockQuantity, setNewStockQuantity] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState('');
    const [deletingProductId, setDeletingProductId] = useState(null);
    const [deleteError, setDeleteError] = useState('');

    const [myProducts, setMyProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newDescription, setNewDescription] = useState('');

    useEffect(() => {
        const fetchMyProducts = async () => {
            try {
                setLoading(true);
                const profileRes = await axios.get('http://localhost:8080/api/user/my-profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const myUsername = profileRes.data.username;

                const productsRes = await axios.get('http://localhost:8080/api/products', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const mine = productsRes.data.filter(
                    (p) => p.createdByUsername === myUsername
                );
                setMyProducts(mine);
            } catch (err) {
                console.error("Error fetching your listings:", err);
                setError("Could not load your listings.");
            } finally {
                setLoading(false);
            }
        };

        const setupProducer = async () => {
            try {
                const response = await axios.put('http://localhost:8080/api/user/become-producer', {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.newlyGranted === true) {
                    localStorage.removeItem('campus_token');
                    localStorage.setItem('sell_redirect', 'true');
                    window.location.href = '/';
                    return;
                }

                fetchMyProducts();
            } catch (err) {
                console.error("Could not enable producer role:", err);
                fetchMyProducts();
            }
        };

        if (token) {
            setupProducer();
        } else {
            window.location.href = '/';
        }
    }, [token]);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setSubmitError('');
        setSubmitSuccess('');
        setSubmitting(true);

        try {
            const response = await axios.post('http://localhost:8080/api/products', {
                name: newName,
                price: parseFloat(newPrice),
                stockQuantity: parseInt(newStockQuantity),
                description: newDescription
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const updatedProduct = response.data;

            setMyProducts((prev) => {
                const existingIndex = prev.findIndex((p) => p.id === updatedProduct.id);
                if (existingIndex !== -1) {
                    const copy = [...prev];
                    copy[existingIndex] = updatedProduct;
                    return copy;
                }
                return [...prev, updatedProduct];
            });

            setNewName('');
            setNewPrice('');
            setNewStockQuantity('');
            setNewDescription('');
            setSubmitSuccess("Item listed successfully!");
        } catch (err) {
            console.error("Error creating product:", err);
            setSubmitError("Failed to add product. Please check your inputs.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`http://localhost:8080/api/products/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyProducts(myProducts.filter((p) => p.id !== productId));
            setDeletingProductId(null);
            setDeleteError('');
        } catch (err) {
            console.error("Error deleting product:", err);
            const msg = err.response?.data?.message || err.response?.data || "Failed to delete product.";
            setDeleteError(typeof msg === 'string' ? msg : "Failed to delete product.");
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
                <button
                    onClick={() => window.location.href = '/my-sales'}
                    className="mt-3 w-full flex items-center justify-between bg-white border border-orange-200 hover:border-orange-400 hover:bg-orange-50 rounded-2xl px-5 py-4 transition-all shadow-sm group"
                >
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-orange-600" aria-hidden="true">
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-slate-900">Orders Received</p>
                            <p className="text-xs text-slate-500">View and manage incoming orders</p>
                        </div>
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-orange-400 group-hover:text-orange-600 transition-colors" aria-hidden="true">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>

            <div className="bg-white w-full max-w-2xl rounded-3xl p-8 shadow-xl border border-slate-100 mb-6">
                <h1 className="text-2xl font-extrabold text-slate-900 mb-1">List an Item</h1>
                <p className="text-sm text-slate-500 mb-6">Sell to fellow students in seconds.</p>

                {submitError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{submitError}</div>
                )}
                {submitSuccess && (
                    <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl text-sm">{submitSuccess}</div>
                )}

                <form onSubmit={handleAddProduct} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Product Name</label>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition"
                            placeholder="e.g., Classmate Notebook"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Description <span className="text-slate-400 font-normal">(optional)</span>
                        </label>
                        <textarea
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            placeholder="e.g., Lightly used, bought last semester..."
                            rows={3}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Price (₹)</label>
                            <input
                                type="number"
                                value={newPrice}
                                onChange={(e) => setNewPrice(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition"
                                placeholder="40"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Stock Qty</label>
                            <input
                                type="number"
                                min="1"
                                value={newStockQuantity}
                                onChange={(e) => setNewStockQuantity(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition"
                                placeholder="50"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full mt-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm"
                    >
                        {submitting ? 'Submitting...' : 'Submit Listing'}
                    </button>
                </form>
            </div>

            <div className="bg-white w-full max-w-2xl rounded-3xl p-8 shadow-xl border border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Your Listings</h2>

                {loading && <p className="text-sm text-slate-500">Loading your listings...</p>}
                {error && <p className="text-sm text-red-600">{error}</p>}
                {!loading && !error && myProducts.length === 0 && (
                    <p className="text-sm text-slate-500">You haven't listed anything yet.</p>
                )}

                <div className="space-y-3">
                    {myProducts.map((product) => (
                        <div key={product.id} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                            <div>
                                <p className="font-semibold text-slate-900">{product.name}</p>
                                <p className="text-sm text-slate-500">₹{product.price} · {product.stockQuantity} in stock</p>
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

            {/* Delete Confirmation Modal */}
            {deletingProductId && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    onClick={() => { setDeletingProductId(null); setDeleteError(''); }}
                >
                    <div
                        className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-red-500" aria-hidden="true">
                                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 mb-1">Delete Listing?</h2>
                        <p className="text-sm text-slate-500 mb-4">This will permanently remove this item from the marketplace.</p>

                        {deleteError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                                {deleteError}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => { setDeletingProductId(null); setDeleteError(''); }}
                                className="flex-1 border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold py-2.5 rounded-xl text-sm transition-colors"
                            >
                                Keep It
                            </button>
                            <button
                                onClick={() => handleDeleteProduct(deletingProductId)}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SellItem;
