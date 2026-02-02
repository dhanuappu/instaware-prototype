'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Getting data from your server
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log("Backend offline"));
  }, []);

  const addToCart = () => {
    setCartCount(cartCount + 1);
    alert("Item added!"); // This popup proves it works
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans p-6">
      
      {/* --- NAVBAR --- */}
      <div className="flex justify-between items-center h-20 border-b mb-10">
        <h1 className="text-3xl font-bold">INSTAWARE.</h1>
        <div className="flex items-center gap-4 border p-3 rounded-xl">
          <ShoppingBag />
          <span className="font-bold text-xl">Cart: {cartCount}</span>
        </div>
      </div>

      {/* --- BIG TITLE --- */}
      <h2 className="text-6xl font-black mb-10">FRESH DROPS</h2>

      {/* --- PRODUCT LIST --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-xl shadow-lg">
            
            {/* Image */}
            <Link href={`/product/${product.id}`}>
  <img 
    src={product.image} 
    alt={product.name}
    className="w-full h-80 object-cover rounded-lg mb-4 cursor-pointer hover:opacity-90 transition"
  />
</Link>
            {/* Title & Price */}
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p className="text-gray-500 mb-4">{product.brand} - ₹{product.price}</p>

            {/* BIG BLACK BUTTON */}
            <button 
              onClick={addToCart}
              className="w-full bg-black text-white py-4 rounded-lg font-bold hover:bg-gray-800 text-lg"
            >
              ADD TO BAG
            </button>

          </div>
        ))}
      </div>

    </div>
  );
}