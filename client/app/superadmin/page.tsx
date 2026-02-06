'use client';
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingBag, Users, DollarSign, Package, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SuperAdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0 });
  const [allOrders, setAllOrders] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            // 1. Fetch Orders
            const ordersRes = await fetch('https://instaware-prototype.onrender.com/api/admin/orders');
            const ordersData = await ordersRes.json();
            
            // Safety Check: Is it an array?
            if (Array.isArray(ordersData)) {
                setAllOrders(ordersData);
                const totalRev = ordersData.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
                setStats(prev => ({ ...prev, revenue: totalRev, orders: ordersData.length }));
            }

            // 2. Fetch Products
            const prodRes = await fetch('https://instaware-prototype.onrender.com/api/products');
            const prodData = await prodRes.json();
            
            if (Array.isArray(prodData)) {
                setAllProducts(prodData);
                setStats(prev => ({ ...prev, products: prodData.length }));
            }
            
            setLoading(false);
        } catch (err) {
            console.error("Failed to load admin data:", err);
            setLoading(false);
        }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-bold">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-black border-r border-gray-800 p-6 flex flex-col fixed h-full">
        <h1 className="text-2xl font-black tracking-widest text-blue-500 mb-10">
            SUPER ADMIN
        </h1>
        
        <nav className="flex-1 space-y-2">
            <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-800'}`}>
                <LayoutDashboard size={20}/> Overview
            </button>
            <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition ${activeTab === 'orders' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-800'}`}>
                <ShoppingBag size={20}/> All Orders
            </button>
            <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-800'}`}>
                <Package size={20}/> All Inventory
            </button>
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-bold hover:text-red-400 transition">
            <LogOut size={20}/> Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 ml-64">
        
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold capitalize">{activeTab} Dashboard</h2>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-mono text-gray-400">LIVE</span>
            </div>
        </div>

        {/* VIEW 1: OVERVIEW */}
        {activeTab === 'overview' && (
            <div className="space-y-8">
                <div className="grid grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-green-500/20 rounded-lg text-green-500"><DollarSign size={24}/></div>
                            <span className="text-gray-400 font-bold text-xs uppercase">Total Revenue</span>
                        </div>
                        <div className="text-3xl font-black">₹{stats.revenue.toLocaleString()}</div>
                    </div>
                    
                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-500"><ShoppingBag size={24}/></div>
                            <span className="text-gray-400 font-bold text-xs uppercase">Total Orders</span>
                        </div>
                        <div className="text-3xl font-black">{stats.orders}</div>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-purple-500/20 rounded-lg text-purple-500"><Package size={24}/></div>
                            <span className="text-gray-400 font-bold text-xs uppercase">Total Products</span>
                        </div>
                        <div className="text-3xl font-black">{stats.products}</div>
                    </div>
                </div>

                {/* RECENT ORDERS TABLE */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-700 font-bold">Recent Activity</div>
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-gray-900 text-gray-500 font-bold uppercase text-xs">
                            <tr>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {allOrders.slice(0, 5).map(order => (
                                <tr key={order._id}>
                                    <td className="p-4 font-bold text-white">{order.customerName}</td>
                                    <td className="p-4 text-green-400">₹{order.totalAmount}</td>
                                    <td className="p-4"><span className="bg-gray-700 px-2 py-1 rounded text-xs">{order.status || 'Pending'}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* VIEW 2: ALL ORDERS */}
        {activeTab === 'orders' && (
            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-gray-900 text-gray-500 font-bold uppercase text-xs">
                        <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Items</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {allOrders.map(order => (
                            <tr key={order._id} className="hover:bg-gray-700/50">
                                <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <div className="font-bold text-white">{order.customerName}</div>
                                    <div className="text-xs">{order.mobile}</div>
                                </td>
                                <td className="p-4">{order.items ? order.items.length : 0} Items</td>
                                <td className="p-4 text-green-400 font-bold">₹{order.totalAmount}</td>
                                <td className="p-4"><span className="bg-gray-700 px-2 py-1 rounded text-xs text-white">{order.status || 'Pending'}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {/* VIEW 3: INVENTORY */}
        {activeTab === 'products' && (
            <div className="grid grid-cols-4 gap-4">
                {allProducts.map(p => (
                    <div key={p._id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex gap-4">
                        <img src={p.image} className="w-12 h-12 rounded bg-black object-cover"/>
                        <div>
                            <div className="font-bold text-sm text-white truncate w-32">{p.name}</div>
                            <div className="text-green-400 text-xs">₹{p.price}</div>
                        </div>
                    </div>
                ))}
            </div>
        )}

      </main>
    </div>
  );
}