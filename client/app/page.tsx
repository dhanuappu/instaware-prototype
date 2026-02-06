'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, ChevronDown, ChevronUp, User, Package } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(true);

  const categories = ["All", "Sneakers", "Hoodies", "Watches", "T-Shirts", "Pants"];

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(err => setLoading(false));
    setUsername(localStorage.getItem('userName'));
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(query.toLowerCase()) || (p.brand && p.brand.toLowerCase().includes(query.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || p.name.toLowerCase().includes(selectedCategory.toLowerCase().slice(0, -1)); 
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-black font-sans pb-20">
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="bg-black text-white py-3 text-center"><h1 className="text-2xl font-black tracking-[0.2em] uppercase cursor-pointer" onClick={()=>window.location.reload()}>INSTAWARE.</h1></div>
        <div className="px-4 py-3 max-w-[1800px] mx-auto flex items-center justify-between gap-4">
            <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg flex gap-2 items-center font-bold text-sm"><Menu size={24}/><span className="hidden md:block">MENU</span></button>
            <div className="flex-1 max-w-2xl relative">
                <input className="w-full bg-gray-100 px-10 py-2.5 rounded-full font-bold text-sm outline-none focus:ring-2 focus:ring-black transition" placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)}/>
                <Search className="absolute left-3.5 top-2.5 text-gray-400" size={18}/>
            </div>
            <div className="flex items-center gap-4">
                <button onClick={() => router.push('/cart')} className="relative p-2 hover:bg-gray-100 rounded-full"><ShoppingBag size={24}/><span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white"></span></button>
                {username ? <Link href="/profile" className="hidden md:block font-bold text-xs bg-black text-white px-3 py-1.5 rounded-full">{username.split(' ')[0]}</Link> : <Link href="/login" className="font-bold text-sm">Login</Link>}
            </div>
        </div>
      </div>

      {/* SIDEBAR MENU */}
      <AnimatePresence>
        {isMenuOpen && (
            <>
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setIsMenuOpen(false)} className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"/>
                <motion.div initial={{x:'-100%'}} animate={{x:0}} exit={{x:'-100%'}} className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white z-[70] flex flex-col shadow-2xl">
                    <div className="p-6 bg-black text-white flex justify-between items-center"><h2 className="text-xl font-black tracking-widest">MENU</h2><button onClick={()=>setIsMenuOpen(false)}><X size={24}/></button></div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        <Link href="/" onClick={()=>setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 font-bold border border-gray-100">Home</Link>
                        <Link href="/my-orders" onClick={()=>setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl font-bold hover:bg-gray-50"><Package size={20}/> My Orders</Link>
                        <Link href="/profile" onClick={()=>setIsMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl font-bold hover:bg-gray-50"><User size={20}/> Profile</Link>
                        <div className="h-px bg-gray-100 my-4"></div>
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <button onClick={()=>setIsCategoryDropdownOpen(!isCategoryDropdownOpen)} className="w-full flex justify-between p-4 bg-gray-50 font-bold text-sm"><span>SHOP BY CATEGORY</span>{isCategoryDropdownOpen?<ChevronUp size={16}/>:<ChevronDown size={16}/>}</button>
                            {isCategoryDropdownOpen && <div className="bg-white">{categories.map(cat=><button key={cat} onClick={()=>{setSelectedCategory(cat);setIsMenuOpen(false)}} className="w-full text-left px-6 py-3 text-sm font-semibold border-b border-gray-50 hover:bg-blue-50 hover:text-blue-600">{cat}</button>)}</div>}
                        </div>
                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>

      {/* PRODUCT GRID */}
      <main className="max-w-[1800px] mx-auto px-4 md:px-8 pt-8">
        <div className="flex items-center gap-4 mb-8"><div className="bg-black text-white px-4 py-1.5 rounded text-sm font-bold uppercase">{selectedCategory}</div><div className="h-px bg-gray-200 flex-1"></div><p className="text-xs font-bold text-gray-400">{filteredProducts.length} Items</p></div>
        
        {loading ? <div className="text-center py-20 font-bold animate-pulse">Loading Inventory...</div> : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {filteredProducts.map((product) => (
                <Link href={`/product/${product._id}`} key={product._id} className="group block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="relative aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden mb-4"><img src={product.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/><button className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all"><ShoppingBag size={18}/></button></div>
                  <div>
                      <h3 className="text-gray-400 font-bold text-[10px] uppercase mb-1">{product.brand || "Instaware"}</h3>
                      <h2 className="font-bold text-sm md:text-base mb-2 truncate group-hover:text-blue-600 transition">{product.name}</h2>
                      <div className="flex justify-between items-center"><span className="font-black text-lg">₹{product.price}</span><span className="text-[10px] bg-green-50 text-green-700 font-bold px-2 py-1 rounded">In Stock</span></div>
                  </div>
                </Link>
              ))}
            </div>
        )}
      </main>
    </div>
  );
}