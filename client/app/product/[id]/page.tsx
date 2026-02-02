'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Truck, ShieldCheck } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p.id == id);
        setProduct(found);
      })
      .catch(err => console.log("Error loading product"));
  }, [id]);

  if (!product) return <div className="p-10 text-center font-bold">LOADING LUXURY...</div>;

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      
      {/* Back Button (Top Left) */}
      <button 
        onClick={() => router.back()}
        className="fixed top-6 left-6 z-50 bg-black text-white p-3 rounded-full shadow-xl"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        
        {/* Left: Image Area */}
        <div className="bg-gray-100 relative h-[50vh] md:h-auto">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: Details Area */}
        <div className="p-8 md:p-20 flex flex-col justify-center">
          
          <h3 className="text-gray-500 uppercase tracking-widest font-bold mb-2">{product.brand}</h3>
          <h1 className="text-4xl md:text-5xl font-black mb-4">{product.name}</h1>
          <p className="text-3xl font-serif italic mb-8">₹{product.price}</p>

          {/* --- SIZE SELECTOR (High Contrast) --- */}
          <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <p className="font-bold mb-3 text-sm uppercase text-black">Select Size:</p>
            <div className="flex gap-4">
              {['S', 'M', 'L', 'XL'].map((size) => (
                <button 
                  key={size} 
                  className="w-14 h-14 bg-black text-white font-bold rounded-lg hover:bg-yellow-500 transition shadow-md flex items-center justify-center"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          {/* ------------------------------------- */}

          {/* Trust Badges */}
          <div className="flex gap-6 mb-10 text-sm text-gray-600 font-medium">
            <div className="flex items-center gap-2">
              <Truck size={18} /> <span>60 Min Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} /> <span>Authentic</span>
            </div>
          </div>

          {/* Big Add Button */}
          <button 
  onClick={() => router.push('/checkout')}
  className="w-full bg-black text-white py-5 rounded-xl font-bold text-xl hover:bg-gray-800 transition"
>
  ADD TO BAG — ₹{product.price}
</button>
        </div>
      </div>
    </div>
  );
}