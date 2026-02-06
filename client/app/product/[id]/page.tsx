'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Truck, MapPin, ShoppingBag, Star, ShieldCheck, RotateCcw, Share2, Heart, Check } from 'lucide-react'; 
import { useRouter, useParams } from 'next/navigation';

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('M');
  const [address, setAddress] = useState("Login to see saved address");

  useEffect(() => {
    if (params.id) {
      fetch(`http://localhost:5000/api/products/${params.id}`)
        .then(res => res.json())
        .then(data => { setProduct(data); setLoading(false); })
        .catch(err => setLoading(false));
    }
    const savedAddress = localStorage.getItem('userAddress');
    if (savedAddress) setAddress(savedAddress);
  }, [params.id]);

  const addToBag = (redirect = false) => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    // Safety check for product data
    if (!product) return; 

    const newItem = {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        shopId: product.shopId,
        size: selectedSize,
        quantity: 1
    };
    currentCart.push(newItem);
    localStorage.setItem('cart', JSON.stringify(currentCart));
    
    if (redirect) {
        router.push('/cart');
    } else {
        alert(`Added ${product.name} to Bag!`);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="font-bold text-xl animate-pulse">Loading Product...</div>
    </div>
  );

  if (!product) return <div className="p-10 text-center font-bold text-red-500">Product not found. Check API.</div>;

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-32">
      
      {/* --- HEADER --- */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={24}/>
          </button>
          <div className="font-black text-lg tracking-widest">INSTAWARE.</div>
          <button onClick={() => router.push('/cart')} className="relative p-2">
              <ShoppingBag size={24}/>
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white"></span>
          </button>
      </div>

      <div className="max-w-7xl mx-auto md:grid md:grid-cols-2 md:gap-10 md:p-8">
        
        {/* --- IMAGE --- */}
        <div className="relative bg-gray-100 w-full aspect-square md:rounded-3xl overflow-hidden">
            <img 
                src={product.image || "https://via.placeholder.com/600"} 
                className="w-full h-full object-cover" 
                alt={product.name}
            />
        </div>

        {/* --- DETAILS --- */}
        <div className="p-5 space-y-6">
            
            {/* Title & Price */}
            <div>
                <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">{product.brand || "Brand New"}</h3>
                <h1 className="text-3xl font-black leading-tight mb-2">{product.name}</h1>
                <div className="flex items-center gap-3">
                    <span className="text-3xl font-black">₹{product.price}</span>
                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">In Stock</span>
                </div>
            </div>

            {/* Size */}
            <div>
                <div className="font-bold text-sm mb-3 uppercase">Select Size</div>
                <div className="flex gap-3">
                    {['S', 'M', 'L', 'XL'].map(size => (
                        <button 
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`w-12 h-12 rounded-lg border-2 font-bold flex items-center justify-center transition ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-400'}`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- MAIN BUTTONS (VISIBLE TO EVERYONE) --- */}
            {/* This div is NOT hidden on any screen size now */}
            <div className="flex gap-3 py-4 border-t border-gray-100 mt-4">
                <button 
                    onClick={() => addToBag(false)}
                    className="flex-1 py-4 rounded-xl border-2 border-black font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition"
                >
                    <ShoppingBag size={20}/> Add to Bag
                </button>
                <button 
                    onClick={() => addToBag(true)}
                    className="flex-1 py-4 rounded-xl bg-black text-white font-bold text-lg hover:shadow-xl transition"
                >
                    Buy Now
                </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 text-xs font-bold text-gray-500">
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <Truck size={16}/> Fast Delivery
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <ShieldCheck size={16}/> Genuine Product
                </div>
            </div>

            {/* Address */}
            <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3">
                <MapPin size={20} className="text-gray-400"/>
                <div className="flex-1">
                    <div className="text-[10px] uppercase font-bold text-gray-400">Delivering To</div>
                    <div className="text-sm font-bold truncate">{address}</div>
                </div>
            </div>

        </div>
      </div>

    </div>
  );
}