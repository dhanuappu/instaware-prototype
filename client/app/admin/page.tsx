'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', image: '' });

  // Load products
  const fetchProducts = () => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  useEffect(() => { fetchProducts(); }, []);

  // Handle Adding New Item
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return alert("Fill in details!");

    await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    setForm({ name: '', price: '', image: '' }); // Clear form
    fetchProducts(); // Refresh list
  };

  // Handle Deleting Item
  const handleDelete = async (id) => {
    if(!confirm("Are you sure you want to delete this?")) return;
    
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'DELETE'
    });
    
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-8">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700">
            <ArrowLeft />
          </Link>
          <h1 className="text-3xl font-bold">Store Manager</h1>
        </div>
        <div className="text-gray-400 text-sm">Admin Access Granted</div>
      </div>

      <div className="max-w-4xl mx-auto grid gap-10 md:grid-cols-2">
        
        {/* LEFT: ADD NEW PRODUCT FORM */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 h-fit">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Plus className="text-green-400" /> Add New Drop
          </h2>
          
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-1">Product Name</label>
              <input 
                type="text" 
                placeholder="Ex: Black Hoodie"
                className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white focus:outline-none focus:border-green-500"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-gray-400 mb-1">Price (₹)</label>
              <input 
                type="number" 
                placeholder="999"
                className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white focus:outline-none focus:border-green-500"
                value={form.price}
                onChange={e => setForm({...form, price: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-gray-400 mb-1">Image Link (Optional)</label>
              <input 
                type="text" 
                placeholder="https://..."
                className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white focus:outline-none focus:border-green-500"
                value={form.image}
                onChange={e => setForm({...form, image: e.target.value})}
              />
            </div>

            <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-lg transition">
              PUBLISH PRODUCT
            </button>
          </form>
        </div>

        {/* RIGHT: INVENTORY LIST */}
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">Live Inventory</h2>
                <button onClick={fetchProducts}><RefreshCw size={16} /></button>
            </div>

            {products.map((product) => (
                <div key={product.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                        <img src={product.image} className="w-12 h-12 rounded-md object-cover bg-gray-700" />
                        <div>
                            <div className="font-bold">{product.name}</div>
                            <div className="text-green-400 font-mono">₹{product.price}</div>
                        </div>
                    </div>
                    <button 
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500/10 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
}