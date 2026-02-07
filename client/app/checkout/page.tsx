'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, CreditCard, ShoppingBag } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: '', mobile: '', address: '' });
  const [total, setTotal] = useState(0);

  // --- SAFE DATA LOADING (Runs only in Browser) ---
  useEffect(() => {
    // 1. Check if we are in the browser
    if (typeof window !== 'undefined') {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const savedUser = {
            name: localStorage.getItem('userName') || '',
            mobile: localStorage.getItem('userMobile') || '',
            address: localStorage.getItem('userAddress') || ''
        };

        if (savedCart.length === 0) {
            router.push('/cart'); // Redirect if empty
        } else {
            setCart(savedCart);
            setUser(savedUser);
            setTotal(savedCart.reduce((sum: number, item: any) => sum + Number(item.price), 0));
        }
        setLoading(false);
    }
  }, []);

  const handlePlaceOrder = async () => {
    if (!user.mobile) { alert("Please Login first"); router.push('/login'); return; }

    try {
        const orderData = {
            customerName: user.name,
            mobile: user.mobile,
            address: user.address || "Bangalore, India", // Default if empty
            items: cart,
            totalAmount: total,
            status: 'Pending'
        };

        const res = await fetch('https://instaware-prototype.onrender.com/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (res.ok) {
            localStorage.removeItem('cart'); // Clear cart
            alert("Order Placed Successfully! 🎉");
            router.push('/my-orders');
        } else {
            alert("Failed to place order. Please try again.");
        }
    } catch (error) {
        console.error("Order Error:", error);
        alert("Something went wrong.");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">Loading Checkout...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans pb-24">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 bg-white rounded-full border border-gray-100"><ArrowLeft size={20}/></button>
            <h1 className="text-xl font-black uppercase tracking-wider">Checkout</h1>
        </div>

        {/* Address Section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3 text-gray-400 font-bold text-xs uppercase tracking-widest">
                <MapPin size={14}/> Delivery Address
            </div>
            <p className="font-bold text-gray-800">{user.address || "No Address Saved (Please update profile)"}</p>
            <p className="text-sm text-gray-500 mt-1">Mobile: {user.mobile}</p>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 mb-1 text-gray-400 font-bold text-xs uppercase tracking-widest">
                <ShoppingBag size={14}/> Order Summary
            </div>
            {cart.map((item: any, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-600">x{item.quantity} {item.name}</span>
                    <span className="font-bold">₹{item.price}</span>
                </div>
            ))}
            <div className="h-px bg-gray-100 my-2"></div>
            <div className="flex justify-between items-center text-lg font-black">
                <span>Total</span>
                <span>₹{total}</span>
            </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3 text-gray-400 font-bold text-xs uppercase tracking-widest">
                <CreditCard size={14}/> Payment Method
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="font-bold text-sm">Cash on Delivery (COD)</span>
            </div>
        </div>

        {/* Footer Button */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4">
            <button 
                onClick={handlePlaceOrder}
                className="w-full max-w-xl mx-auto bg-black text-white py-4 rounded-xl font-bold text-lg shadow-xl active:scale-95 transition flex items-center justify-center gap-2"
            >
                Confirm Order - ₹{total}
            </button>
        </div>

      </div>
    </div>
  );
}