'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Package, LogOut, ArrowLeft, MapPin } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState({ name: '', mobile: '', address: '' });

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (!name) router.push('/login');
    setUser({
        name: name,
        mobile: localStorage.getItem('userMobile'),
        address: localStorage.getItem('userAddress') || 'No Address Saved'
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-4"><button onClick={()=>router.push('/')} className="bg-white p-2 rounded-full"><ArrowLeft/></button><h1 className="font-black text-xl">Profile</h1></div>
        
        <div className="text-center py-8">
            <div className="w-24 h-24 bg-black text-white rounded-full mx-auto flex items-center justify-center mb-4"><User size={40}/></div>
            <h2 className="text-2xl font-black">{user.name}</h2>
            <p className="text-gray-500 font-mono">{user.mobile}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2"><MapPin size={14}/> Address</h3>
            <p className="font-bold text-sm">{user.address}</p>
        </div>

        <button onClick={()=>router.push('/my-orders')} className="w-full bg-white p-4 rounded-xl font-bold flex items-center gap-3 shadow-sm"><Package className="text-blue-500"/> My Orders</button>
        <button onClick={()=>{localStorage.clear(); router.push('/login')}} className="w-full bg-red-50 text-red-500 p-4 rounded-xl font-bold flex items-center gap-3"><LogOut/> Logout</button>
      </div>
    </div>
  );
}