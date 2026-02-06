'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, MapPin, User, Lock, Smartphone } from 'lucide-react';

export default function PartnerRegister() {
  const router = useRouter();
  const [form, setForm] = useState({
    shopName: '',
    ownerName: '',
    mobile: '',
    password: '',
    location: 'KR Puram' // Default for now
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch('https://instaware-prototype.onrender.com/api/shops/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    
    if (res.ok) {
      alert("Welcome to Instaware! Your Shop is Live.");
      // We will redirect to their dashboard later
      router.push('/admin'); 
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl border border-gray-800">
        
        <div className="text-center mb-8">
          <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-black">
            <Store size={32} />
          </div>
          <h1 className="text-2xl font-bold">Partner Onboarding</h1>
          <p className="text-gray-400 text-sm mt-2">Grow your business with Instaware</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          
          <div className="bg-gray-800 flex items-center p-3 rounded-xl gap-3">
            <Store className="text-gray-400" size={20}/>
            <input 
              className="bg-transparent outline-none w-full" 
              placeholder="Shop Name (e.g., Trends KR Puram)"
              value={form.shopName}
              onChange={e => setForm({...form, shopName: e.target.value})}
            />
          </div>

          <div className="bg-gray-800 flex items-center p-3 rounded-xl gap-3">
            <User className="text-gray-400" size={20}/>
            <input 
              className="bg-transparent outline-none w-full" 
              placeholder="Owner Name"
              value={form.ownerName}
              onChange={e => setForm({...form, ownerName: e.target.value})}
            />
          </div>

          <div className="bg-gray-800 flex items-center p-3 rounded-xl gap-3">
            <Smartphone className="text-gray-400" size={20}/>
            <input 
              className="bg-transparent outline-none w-full" 
              placeholder="Mobile Number"
              value={form.mobile}
              onChange={e => setForm({...form, mobile: e.target.value})}
            />
          </div>

          <div className="bg-gray-800 flex items-center p-3 rounded-xl gap-3">
            <MapPin className="text-gray-400" size={20}/>
            <select 
              className="bg-transparent outline-none w-full bg-gray-800"
              value={form.location}
              onChange={e => setForm({...form, location: e.target.value})}
            >
              <option>KR Puram</option>
              <option>Indiranagar</option>
              <option>Koramangala</option>
              <option>Whitefield</option>
            </select>
          </div>

          <div className="bg-gray-800 flex items-center p-3 rounded-xl gap-3">
            <Lock className="text-gray-400" size={20}/>
            <input 
              type="password"
              className="bg-transparent outline-none w-full" 
              placeholder="Set Password"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
            />
          </div>

          <button className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-4 rounded-xl mt-4 transition">
            REGISTER SHOP
          </button>

        </form>
      </div>
    </div>
  );
}