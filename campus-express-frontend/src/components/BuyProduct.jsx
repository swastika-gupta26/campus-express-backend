import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function BuyProduct() {
    const { productId } = useParams();
    const token = localStorage.getItem('campus_token');

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [quantity, setQuantity] = useState(1);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:8080/api/products', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const found = response.data.find((p) => String(p.id) === String(productId));
                if (!found) {
                    setError("Product not found.");
                } else {
                    setProduct(found);
                }
            } catch (err) {
                console.error("Error fetching product:", err);
                setError("Could not load product details.");
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchProduct();
        } else {
            window.location.href = '/';
        }
    }, [token, productId]);

    const handleConfirmPurchase = async (e) => {
        e.preventDefault();
        setSubmitError('');
        setSubmitSuccess('');

        if (quantity < 1) {
            setSubmitError("Quantity must be at least 1.");
            return;
        }
        if (product && quantity > product.stockQuantity) {
            setSubmitError(`Only ${product.stockQuantity} left in stock.`);
            return;
        }
        if (!deliveryAddress.trim() || !contactNumber.trim()) {
            setSubmitError("Please fill in both Delivery Address and Contact Number.");
            return;
        }

        setSubmitting(true);
        try {
            await axios.post(`http://localhost:8080/api/orders/product/${productId}`,
                { quantity: parseInt(quantity),
                    deliveryAddress: deliveryAddress,
                    contactNumber: contactNumber
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSubmitSuccess("Order placed successfully!");
            setProduct((prev) => ({ ...prev, stockQuantity: prev.stockQuantity - quantity }));
        } catch (err) {
            console.error("Error placing order:", err);
            setSubmitError(err.response?.data?.message || "Failed to place order. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center py-12 text-orange-500 font-bold">Loading product...</div>;

    return (
        <div className="min-h-screen bg-orange-50 p-6 flex flex-col items-center">
            <div className="w-full max-w-md mb-4">
                <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                    ← Back to Marketplace
                </button>
            </div>

            <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-xl border border-slate-100">
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">{error}</div>
                )}

                {!error && product && (
                    <>
                        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">{product.name}</h1>
                        <p className="text-sm text-slate-500 mb-6">
                            {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                        </p>


                        {product.description && (
                            <div className="mb-6 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">About this item</p>
                                <p className="text-sm text-slate-600">{product.description}</p>
                            </div>
                        )}

                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-base font-semibold text-slate-400">₹</span>
                            <span className="text-3xl font-extrabold text-slate-900">{product.price}</span>
                            <span className="text-sm text-slate-400 ml-1">/ item</span>
                        </div>

                        {submitError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{submitError}</div>
                        )}
                        {submitSuccess && (
                            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl text-sm">{submitSuccess}</div>
                        )}

                        {!submitSuccess && (
                            <form onSubmit={handleConfirmPurchase} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Quantity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={product.stockQuantity}
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        disabled={product.stockQuantity <= 0}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition"
                                    />
                                </div>


                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Delivery Address</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Maitreyi Hostel"
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Contact Number</label>
                                    <input
                                        type="tel"
                                        placeholder="Enter your 10-digit mobile number"
                                        value={contactNumber}
                                        onChange={(e) => setContactNumber(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition"
                                        required
                                    />
                                </div>

                                <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                                    <span className="text-sm font-medium text-slate-500">Total</span>
                                    <span className="text-lg font-extrabold text-slate-900">
                                        ₹{(product.price * (quantity || 0)).toFixed(2)}
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting || product.stockQuantity <= 0}
                                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors shadow-sm"
                                >
                                    {product.stockQuantity <= 0
                                        ? 'Out of Stock'
                                        : submitting
                                            ? 'Placing Order...'
                                            : 'Confirm Purchase'}
                                </button>
                            </form>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default BuyProduct;
