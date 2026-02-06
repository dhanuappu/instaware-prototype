'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const handleCheckout = async () => {
    const userId = localStorage.getItem('userId');
    const mobile = localStorage.getItem('userMobile');
    const name = localStorage.getItem('userName') || 'Guest';

    if (!userId || !mobile) { alert("Please Login to Order!"); router.push('/login'); return; }

    setLoading(true);
    const orderData = {
        customerName: name,
        mobile: mobile,
        address: localStorage.getItem('userAddress') || 'Default Address',
        items: cart,
        totalAmount: cart.reduce((sum, item) => sum + parseInt(item.price), 0),
        status: 'Pending'
    };

    await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    });

    localStorage.removeItem('cart');
    alert("Order Placed Successfully!");
    router.push('/my-orders');
  };

  const remove = (idx) => {
      const newCart = [...cart];
      newCart.splice(idx, 1);
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
  };

  if (cart.length === 0) return <div className="min-h-screen flex flex-col items-center justify-center"><h2 className="font-bold text-xl mb-4">Cart is Empty</h2><button onClick={()=>router.push('/')} className="bg-black text-white px-6 py-3 rounded-full font-bold">Start Shopping</button></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6"><button onClick={()=>router.back()}><ArrowLeft/></button><h1 className="text-2xl font-black">My Bag ({cart.length})</h1></div>
        
        <div className="space-y-4 mb-24">
            {cart.map((item, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl flex gap-4 shadow-sm">
                    <img src={item.image} className="w-20 h-20 object-cover rounded-lg bg-gray-100"/>
                    <div className="flex-1">
                        <h3 className="font-bold text-sm">{item.name}</h3>
                        <p className="text-xs text-gray-500 mb-2">Size: {item.size}</p>
                        <div className="font-black">₹{item.price}</div>
                    </div>
                    <button onClick={()=>remove(i)} className="text-red-500"><Trash2 size={18}/></button>
                </div>
            ))}
        </div>

        <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t border-gray-200">
            <div className="max-w-2xl mx-auto flex justify-between items-center">
                <div><div className="text-xs text-gray-500 font-bold uppercase">Total</div><div className="text-2xl font-black">₹{cart.reduce((a,b)=>a+parseInt(b.price),0)}</div></div>
                <button onClick={handleCheckout} disabled={loading} className="bg-black text-white px-8 py-3 rounded-xl font-bold shadow-lg">{loading?"Processing...":"Place Order"}</button>
            </div>
        </div>
      </div>
    </div>
  );
}