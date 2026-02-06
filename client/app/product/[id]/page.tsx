'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Truck, MapPin, ShoppingBag, ShieldCheck } from 'lucide-react'; 
import { useRouter, useParams } from 'next/navigation';

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');

  useEffect(() => {
    fetch(`https://instaware-prototype.onrender.com/api/products/${params.id}`).then(res=>res.json()).then(setProduct);
  }, [params.id]);

  const addToBag = (redirect) => {
    if(!product) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({ productId: product._id, name: product.name, price: product.price, image: product.image, shopId: product.shopId, size: selectedSize, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    redirect ? router.push('/cart') : alert("Added to Bag!");
  };

  if (!product) return <div className="min-h-screen flex items-center justify-center font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-20">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={24}/></button>
          <div className="font-black text-lg tracking-widest">INSTAWARE.</div>
          <button onClick={() => router.push('/cart')} className="p-2"><ShoppingBag size={24}/></button>
      </div>

      <div className="max-w-7xl mx-auto md:grid md:grid-cols-2 md:gap-10 md:p-8">
        <div className="bg-gray-100 w-full aspect-square md:rounded-3xl overflow-hidden"><img src={product.image} className="w-full h-full object-cover"/></div>
        <div className="p-5 space-y-6">
            <div>
                <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">{product.brand || "Brand New"}</h3>
                <h1 className="text-3xl font-black leading-tight mb-2">{product.name}</h1>
                <div className="flex items-center gap-3"><span className="text-3xl font-black">₹{product.price}</span><span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">In Stock</span></div>
            </div>

            <div>
                <div className="font-bold text-sm mb-3 uppercase">Select Size</div>
                <div className="flex gap-3">{['S', 'M', 'L', 'XL'].map(s=><button key={s} onClick={()=>setSelectedSize(s)} className={`w-12 h-12 rounded-lg border-2 font-bold transition ${selectedSize===s?'border-black bg-black text-white':'border-gray-200 text-gray-400'}`}>{s}</button>)}</div>
            </div>

            <div className="flex gap-3 py-4 border-t border-gray-100 mt-4">
                <button onClick={() => addToBag(false)} className="flex-1 py-4 rounded-xl border-2 border-black font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-50">Add to Bag</button>
                <button onClick={() => addToBag(true)} className="flex-1 py-4 rounded-xl bg-black text-white font-bold text-lg hover:shadow-xl">Buy Now</button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-bold text-gray-500">
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg"><Truck size={16}/> Fast Delivery</div>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg"><ShieldCheck size={16}/> Genuine Product</div>
            </div>
        </div>
      </div>
    </div>
  );
}