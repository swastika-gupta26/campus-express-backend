import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import MyProfile from './components/MyProfile';
import SellItem from './components/SellItem';
import BuyProduct from './components/BuyProduct'
import MyOrders from './components/MyOrders';
import BuyerOrders from './components/BuyerOrders';
import OrderHistory from './components/OrderHistory';
import Notifications from './components/Notifications.jsx';
function App() {
    return (
        <Router>
            <Routes>

                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<MyProfile />} />
                <Route path="/sell" element={<SellItem />} />
                <Route path="/buy/:productId" element={<BuyProduct />} />
                <Route path="/my-sales" element={<MyOrders />} />
                <Route path="/my-orders" element={<BuyerOrders />} />
                <Route path="/order-history" element={<OrderHistory />} />
                <Route path="/notifications" element={<Notifications />} />

            </Routes>
        </Router>
    );
}

export default App;