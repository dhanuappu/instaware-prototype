'use client';
import React, { useState, useEffect } from 'react';
import { Users, ShoppingBag, TrendingUp, Shield, Activity } from 'lucide-react';

export default function SuperAdmin() {
  const [shops, setShops] = useState([]);
  const [stats, setStats] = useState({ totalShops: 0, active: 0 });

  useEffect(() => {
    // Fetch all registered shops
    fetch('http://localhost:5000/api/shops')
      .then(res => res.json())
      .then(data => {
        setShops(data);
        setStats({
          totalShops: data.length,
          active: data.filter(s => s.status === 'active').length
        });
      });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans p-8">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10 border-b border-gray-800 pb-6 flex justify-between items-end">
        <div>
          <h4 className="text-red-500 font-bold tracking-widest text-xs mb-1">MASTER CONTROL</h4>
          <h1 className="text-4xl font-black">INSTAWARE HQ.</h1>
        </div>
        <div className="flex gap-4">
             <div className="text-right">
                <div className="text-2xl font-bold">{stats.totalShops}</div>
                <div className="text-xs text-gray-400 uppercase">Total Vendors</div>
             </div>
             <div className="text-right">
                <div className="text-2xl font-bold text-green-500">{stats.active}</div>
                <div className="text-xs text-gray-400 uppercase">Active</div>
             </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* STAT CARD 1 */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <div className="flex items-center gap-3 mb-2 text-gray-400">
                <Users size={20}/> <span className="text-xs font-bold uppercase">Total Users</span>
            </div>
            <div className="text-3xl font-black">1,240</div>
            <div className="text-green-500 text-xs mt-2">+12% this week</div>
        </div>

        {/* STAT CARD 2 */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <div className="flex items-center gap-3 mb-2 text-gray-400">
                <TrendingUp size={20}/> <span className="text-xs font-bold uppercase">Platform Revenue</span>
            </div>
            <div className="text-3xl font-black">₹45,000</div>
            <div className="text-gray-500 text-xs mt-2">Commission (10%)</div>
        </div>

        {/* STAT CARD 3 */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <div className="flex items-center gap-3 mb-2 text-gray-400">
                <Activity size={20}/> <span className="text-xs font-bold uppercase">System Status</span>
            </div>
            <div className="text-3xl font-black text-green-500">ONLINE</div>
            <div className="text-gray-500 text-xs mt-2">MongoDB Connected</div>
        </div>

      </div>

      {/* VENDOR LIST */}
      <div className="max-w-6xl mx-auto mt-10">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Shield className="text-gray-500"/> Registered Vendors
        </h3>

        <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                        <th className="p-4">Shop Name</th>
                        <th className="p-4">Owner</th>
                        <th className="p-4">Location</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-sm">
                    {shops.length > 0 ? shops.map((shop) => (
                        <tr key={shop._id} className="hover:bg-gray-800/50 transition">
                            <td className="p-4 font-bold">{shop.shopName}</td>
                            <td className="p-4 text-gray-400">{shop.ownerName}</td>
                            <td className="p-4 text-blue-400">{shop.location}</td>
                            <td className="p-4">
                                <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-bold">
                                    {shop.status || "ACTIVE"}
                                </span>
                            </td>
                            <td className="p-4">
                                <button className="text-red-500 hover:text-white transition text-xs font-bold">BAN</button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-gray-500">No vendors registered yet.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

    </div>
  );
}