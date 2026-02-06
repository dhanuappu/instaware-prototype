'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Package, Upload, X, LogOut, Truck, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('orders'); // Default to orders to see this feature
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', image: '' });
  const [shopId, setShopId] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('shopId');
    if (!id) router.push('/login');
    setShopId(id);
    // Fetch Data
    fetch('http://localhost:5000/api/products').then(res=>res.json()).then(setProducts);
    fetch(`http://localhost:5000/api/orders/shop/${id}`).then(res=>res.json()).then(setOrders);
  }, []);

  // --- LOGIC: REQUEST 3RD PARTY DELIVERY ---
  const handleShipOrder = async (orderId) => {
      // 1. In a real app, this calls Shadowfax/Dunzo API
      // await fetch('https://api.shadowfax.in/v2/orders', { ... })
      
      alert("Request sent to Delivery Partner (Shadowfax)!");

      // 2. Update Status in Database
      // (For now, we simulate UI update)
      const updatedOrders = orders.map(o => 
          o._id === orderId ? { ...o, status: 'Out for Delivery' } : o
      );
      setOrders(updatedOrders);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/products', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({...form, shopId}) });
    window.location.reload();
  };

  const handleImage = (e) => {
      const reader = new FileReader();
      reader.onload = () => setForm({...form, image: reader.result});
      reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
            <h1 className="text-2xl font-black tracking-widest">VENDOR DASHBOARD</h1>
            <button onClick={()=>{localStorage.clear(); router.push('/login')}} className="text-red-500 font-bold text-sm flex gap-2"><LogOut size={18}/> Logout</button>
        </div>

        <div className="flex gap-4 mb-8">
            <button onClick={()=>setActiveTab('inventory')} className={`px-6 py-2 rounded-full font-bold ${activeTab==='inventory'?'bg-white text-black':'bg-gray-800 text-gray-400'}`}>Inventory</button>
            <button onClick={()=>setActiveTab('orders')} className={`px-6 py-2 rounded-full font-bold ${activeTab==='orders'?'bg-green-500 text-black':'bg-gray-800 text-gray-400'}`}>Orders ({orders.length})</button>
        </div>

        {activeTab === 'inventory' ? (
            <div className="space-y-6">
                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                    <h2 className="font-bold text-gray-400 uppercase text-xs mb-4">Add New Product</h2>
                    <form onSubmit={handleAdd} className="flex gap-4">
                        <div className="w-24 h-24 bg-black border border-gray-700 rounded-xl relative flex items-center justify-center overflow-hidden">
                            {form.image ? <img src={form.image} className="w-full h-full object-cover"/> : <Upload className="text-gray-600"/>}
                            <input type="file" onChange={handleImage} className="absolute inset-0 opacity-0 cursor-pointer"/>
                        </div>
                        <div className="flex-1 space-y-3">
                            <input className="w-full bg-black border border-gray-700 p-3 rounded-lg text-sm outline-none" placeholder="Product Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
                            <input className="w-full bg-black border border-gray-700 p-3 rounded-lg text-sm outline-none" placeholder="Price" type="number" value={form.price} onChange={e=>setForm({...form, price:e.target.value})}/>
                        </div>
                        <button className="bg-white text-black font-bold px-6 rounded-xl hover:bg-gray-200">Publish</button>
                    </form>
                </div>
                <div className="space-y-2">
                    {products.map(p => (
                        <div key={p._id} className="bg-gray-900 p-4 rounded-xl flex items-center justify-between border border-gray-800">
                            <div className="flex items-center gap-4"><img src={p.image} className="w-12 h-12 rounded bg-black object-cover"/><span className="font-bold">{p.name}</span></div>
                            <button className="text-red-500"><Trash2 size={18}/></button>
                        </div>
                    ))}
                </div>
            </div>
        ) : (
            <div className="space-y-4">
                {orders.length === 0 ? <div className="text-gray-500 text-center py-10">No Orders Yet</div> : orders.map(o => (
                    <div key={o._id} className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                        <div className="flex justify-between mb-4">
                            <div>
                                <span className="font-bold text-lg block">{o.customerName}</span>
                                <span className="text-xs text-gray-400">{o.mobile} | {o.address}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-green-500 font-mono text-lg block">₹{o.totalAmount}</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${o.status === 'Out for Delivery' ? 'bg-purple-500/20 text-purple-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                    {o.status || "Pending"}
                                </span>
                            </div>
                        </div>
                        
                        <div className="bg-black p-4 rounded-xl text-sm text-gray-400 space-y-1 mb-4">
                            {o.items.map((i, idx) => <div key={idx} className="flex justify-between"><span>{i.name}</span><span>x{i.quantity}</span></div>)}
                        </div>

                        {/* --- 3RD PARTY DELIVERY ACTIONS --- */}
                        <div className="flex gap-3">
                            {o.status !== 'Out for Delivery' && o.status !== 'Delivered' ? (
                                <button 
                                    onClick={() => handleShipOrder(o._id)}
                                    className="flex-1 bg-white text-black py-3 rounded-xl font-bold text-sm hover:bg-gray-200 flex items-center justify-center gap-2"
                                >
                                    <Truck size={16}/> Request Shadowfax Pickup
                                </button>
                            ) : (
                                <button disabled className="flex-1 bg-gray-800 text-gray-500 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                                    <CheckCircle size={16}/> Rider Assigned
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}