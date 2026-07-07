import React, {useState, useEffect} from 'react';
import axios from 'axios';

function Dashboard() {


    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');


    const token = localStorage.getItem('campus_token');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:8080/api/products', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                console.log("Error fetching products:", err);
                setError("Could not load products.");
                setLoading(false);
            }
        };
        if (token) {
            fetchProducts();
        } else {
            setError("No token found. Please log in first.");
            setLoading(false);
        }
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('campus_token');
        window.location.href = '/';
    };




    const filteredProducts = products.filter((p) =>
        (p.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalItems = products.length;
    const inStockItems = products.filter((p) => (p.stockQuantity ?? 0) > 0).length;

    return (
        <div className="min-h-screen bg-orange-50 text-slate-800 antialiased">


            {/*Navigation Bar*/}
            <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                    {/* Brand */}
                    <div className="flex items-center gap-2.5 shrink-0">
                        <div
                            className="h-9 w-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-sm shadow-orange-500/30">
                            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" aria-hidden="true">
                                <path
                                    d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.4 5M7 13l-2.293 2.293A1 1 0 005.414 17H17M17 17a2 2 0 100 4 2 2 0 000-4zM9 19a2 2 0 11-4 0 2 2 0 014 0z"
                                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
                                    strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <span className="text-lg font-bold tracking-tight text-slate-900">
                            Campus<span className="text-orange-500">Express</span>
                        </span>
                    </div>

                    {/* Search (desktop) */}
                    <div className="hidden md:flex flex-1 max-w-md relative">
                        <svg viewBox="0 0 24 24" fill="none"
                             className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                             aria-hidden="true">
                            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                            <path d="M21 21l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search books, gear, essentials..."
                            className="w-full bg-slate-100 border border-transparent rounded-xl pl-10 pr-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                        />
                    </div>

                    {/* Actions */}
                    {/* Desktop nav links */}
                    <div className="hidden md:flex items-center gap-1">
                        <button
                            onClick={() => window.location.href = '/my-orders'}
                            className="text-sm font-semibold text-slate-600 hover:text-orange-500 px-3 py-2 rounded-xl hover:bg-orange-50 transition-colors"
                        >
                            My Orders
                        </button>
                        <button
                            onClick={() => window.location.href = '/order-history'}
                            className="text-sm font-semibold text-slate-600 hover:text-orange-500 px-3 py-2 rounded-xl hover:bg-orange-50 transition-colors"
                        >
                            History
                        </button>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <button
                            onClick={() => window.location.href = '/sell'}
                            className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-3.5 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-orange-500/30"
                        >
                            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <span className="hidden sm:inline">Switch to Seller mode</span>
                            <span className="sm:hidden">Sell</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="border border-slate-200 hover:bg-slate-100 text-slate-600 px-3.5 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                        >
                            Logout
                        </button>
                        {/* Profile icon */}
                        <button
                            type="button"
                            onClick={() => window.location.href = '/profile'} // 👈 Naye page par bhej dega
                            aria-label="Profile"
                            className="h-9 w-9 shrink-0 rounded-full bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center hover:bg-orange-100 hover:border-orange-300 transition-colors"
                        >
                            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                                <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8"/>
                                <path d="M5 19a7 7 0 0114 0" stroke="currentColor" strokeWidth="1.8"
                                      strokeLinecap="round"/>
                            </svg>
                        </button>

                    </div>
                </div>

                {/* Search (mobile) */}
                <div className="md:hidden px-4 pb-3">
                    <div className="relative">
                        <svg viewBox="0 0 24 24" fill="none"
                             className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                             aria-hidden="true">
                            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                            <path d="M21 21l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search items..."
                            className="w-full bg-slate-100 border border-transparent rounded-xl pl-10 pr-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                        />
                    </div>
                </div>
            </nav>

            {/*  Main Container  */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20 md:pb-8">

                {/* Header + Stats */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-balance">
                            College Marketplace
                        </h1>
                        <p className="text-slate-500 mt-1.5 text-pretty">
                            Sell what you don't need. Buy what you do.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div
                            className="flex-1 lg:flex-none bg-white border border-slate-200 rounded-2xl px-5 py-3 min-w-[120px]">
                            <p className="text-2xl font-extrabold text-slate-900 leading-none">{totalItems}</p>
                            <p className="text-xs font-medium text-slate-500 mt-1.5">Total Listings</p>
                        </div>
                        <div
                            className="flex-1 lg:flex-none bg-white border border-slate-200 rounded-2xl px-5 py-3 min-w-[120px]">
                            <p className="text-2xl font-extrabold text-orange-500 leading-none">{inStockItems}</p>
                            <p className="text-xs font-medium text-slate-500 mt-1.5">In Stock</p>
                        </div>
                    </div>
                </div>

                {/* Loading: skeleton grid */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 animate-pulse">
                                <div className="h-5 w-16 bg-slate-200 rounded-lg mb-4"/>
                                <div className="h-5 w-3/4 bg-slate-200 rounded mb-2"/>
                                <div className="h-6 w-1/3 bg-slate-200 rounded mb-5"/>
                                <div className="h-10 w-full bg-slate-200 rounded-xl"/>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div
                        className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-center font-medium max-w-md mx-auto">
                        {error}
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && products.length === 0 && (
                    <div className="text-center py-16">
                        <div
                            className="h-14 w-14 mx-auto rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
                            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-orange-500" aria-hidden="true">
                                <path d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.4 5M7 13l-2.293 2.293A1 1 0 005.414 17H17"
                                      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <p className="text-slate-900 font-semibold">No products available right now</p>
                        <p className="text-slate-500 text-sm mt-1">Be the first to list one for your campus!</p>
                        <button
                            onClick={() => window.location.href = '/sell'}
                            className="mt-5 inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                        >
                            List your first item
                        </button>
                    </div>
                )}

                {/* No search results */}
                {!loading && !error && products.length > 0 && filteredProducts.length === 0 && (
                    <div className="text-center py-16 text-slate-500 font-medium">
                        No items match &ldquo;{searchTerm}&rdquo;.
                    </div>
                )}

                {/*  Products Grid  */}
                {!loading && !error && filteredProducts.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredProducts.map((product) => {
                            const inStock = (product.stockQuantity ?? 0) > 0;
                            const lowStock = inStock && product.stockQuantity <= 3;
                            return (
                                <div
                                    key={product.id}
                                    className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-orange-300 hover:shadow-lg hover:shadow-slate-200/60 transition-all flex flex-col"
                                >
                                    {/* Stock badge */}
                                    <div className="flex items-center justify-between mb-4">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg ${
                                                inStock
                                                    ? lowStock
                                                        ? 'bg-amber-50 text-amber-600'
                                                        : 'bg-emerald-50 text-emerald-600'
                                                    : 'bg-slate-100 text-slate-400'
                                            }`}
                                        >
                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${inStock ? (lowStock ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-slate-400'}`}/>
                                            {inStock ? `${product.stockQuantity} in stock` : 'Out of stock'}
                                        </span>
                                    </div>

                                    {/* Name + price */}

                                    <div className="flex-1">
                                        <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug mb-2 group-hover:text-orange-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-sm font-semibold text-slate-400">&#8377;</span>
                                            <span
                                                className="text-2xl font-extrabold text-slate-900">{product.price}</span>
                                        </div>

                                    </div>

                                    {/* Buy button */}
                                    <button
                                        onClick={() => window.location.href = `/buy/${product.id}`}
                                        disabled={!inStock}
                                        className={`mt-4 w-full inline-flex items-center justify-center gap-1.5 text-sm font-semibold py-2.5 rounded-xl transition-colors ${
                                            inStock
                                                ? 'bg-slate-900 hover:bg-orange-500 text-white'
                                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        }`}
                                    >
                                        {inStock && (
                                            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                                                <path
                                                    d="M5 7h14l-1.5 9.5a2 2 0 01-2 1.5H8.5a2 2 0 01-2-1.5L5 7zM5 7l-.5-3H2"
                                                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
                                                    strokeLinejoin="round"/>
                                            </svg>
                                        )}
                                        {inStock ? 'Buy Now' : 'Out of Stock'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}


            </main>
            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40">
                <div className="flex items-center justify-around py-2">
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="flex flex-col items-center gap-1 px-4 py-2 text-orange-500"
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                            <path d="M3 12L12 3l9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-xs font-semibold">Home</span>
                    </button>
                    <button
                        onClick={() => window.location.href = '/my-orders'}
                        className="flex flex-col items-center gap-1 px-4 py-2 text-slate-400 hover:text-orange-500"
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                        <span className="text-xs font-semibold">My Orders</span>
                    </button>
                    <button
                        onClick={() => window.location.href = '/order-history'}
                        className="flex flex-col items-center gap-1 px-4 py-2 text-slate-400 hover:text-orange-500"
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                        <span className="text-xs font-semibold">History</span>
                    </button>
                    <button
                        onClick={() => window.location.href = '/sell'}
                        className="flex flex-col items-center gap-1 px-4 py-2 text-slate-400 hover:text-orange-500"
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span className="text-xs font-semibold">Sell</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}

export default Dashboard;