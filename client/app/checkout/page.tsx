'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, CreditCard, CheckCircle, ArrowLeft, User, Smartphone } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    customerName: '',
    mobile: '',
    address: 'No. 12, KR Puram, Bangalore'
  });

  useEffect(() => {
    // 1. Load User Data
    const savedMobile = localStorage.getItem('userMobile');
    const savedName = localStorage.getItem('userName');
    const savedAddr = localStorage.getItem('userAddress');

    if (savedMobile) {
        setForm(prev => ({
            ...prev,
            mobile: savedMobile,
            customerName: savedName || '',
            address: savedAddr || prev.address
        }));
    }

    // 2. Load Cart Items
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
    const sum = savedCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotalPrice(sum);

  }, []);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if(cartItems.length === 0) return alert("Cart is empty!");
    setLoading(true);

    // --- THE FIX: FORMAT ITEMS CORRECTLY FOR SERVER ---
    const formattedItems = cartItems.map(item => ({
        productId: item.productId,
        productName: item.name, // MAP 'name' -> 'productName'
        price: item.price,
        shopId: item.shopId,
        quantity: item.quantity
    }));

    const orderData = {
      customerName: form.customerName,
      mobile: form.mobile,
      address: form.address,
      items: formattedItems, // Send the Fixed List
      totalAmount: totalPrice
    };

    const res = await fetch('https://instaware-prototype.onrender.com/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    if (res.ok) {
      alert("Order Placed Successfully!");
      localStorage.removeItem('cart'); 
      router.push('/my-orders');
    } else {
      alert("Order Failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black font-sans p-6 flex justify-center items-center">
      
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl">
        <button onClick={() => router.back()} className="mb-6 text-gray-400 hover:text-black">
             <ArrowLeft />
        </button>

        <h1 className="text-2xl font-black mb-1">CHECKOUT</h1>
        <p className="text-gray-400 text-sm mb-6">Review your {cartItems.length} items</p>

        {/* ORDER SUMMARY */}
        <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200 max-h-40 overflow-y-auto">
            {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center mb-2 border-b border-gray-200 pb-2 last:border-0">
                    <div className="flex items-center gap-2">
                         <span className="text-xs font-bold text-gray-500 bg-gray-200 w-5 h-5 flex items-center justify-center rounded-full">
                            {item.quantity}
                         </span>
                        <div className="text-xs font-bold">{item.name}</div>
                    </div>
                    <div className="text-sm font-mono">₹{item.price}</div>
                </div>
            ))}
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-black">
                <div className="font-bold text-sm uppercase">Total To Pay</div>
                <div className="text-xl font-black">₹{totalPrice}</div>
            </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="space-y-4">
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
            <User className="text-gray-400" size={20}/>
            <input className="w-full bg-transparent font-bold outline-none" placeholder="Your Name" value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} required />
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
            <Smartphone className="text-gray-400" size={20}/>
            <input className="w-full bg-transparent font-bold outline-none" placeholder="Mobile Number" value={form.mobile} readOnly={!!localStorage.getItem('userMobile')} onChange={e => setForm({...form, mobile: e.target.value})} required />
             {localStorage.getItem('userMobile') && <CheckCircle size={16} className="text-green-500"/>}
          </div>

          <div className="flex gap-2 items-start bg-gray-50 p-3 rounded-xl border border-gray-200">
             <MapPin className="text-gray-400 mt-1" size={20}/>
             <textarea className="w-full bg-transparent font-bold outline-none text-sm" value={form.address} onChange={e => setForm({...form, address: e.target.value})} rows={2} />
          </div>

          <div className="flex items-center gap-3 p-3 border border-green-500/30 bg-green-50 rounded-xl">
             <CreditCard className="text-green-600" size={20}/>
             <div>
                <div className="text-xs font-bold text-green-700">PAYMENT METHOD</div>
                <div className="font-bold text-sm">Cash on Delivery (COD)</div>
             </div>
             <CheckCircle className="ml-auto text-green-600" size={20}/>
          </div>

          <button disabled={loading} className="w-full bg-black text-white py-4 rounded-xl font-bold hover:scale-105 transition shadow-lg mt-4 disabled:opacity-50">
            {loading ? "PROCESSING..." : `CONFIRM ORDER (₹${totalPrice})`}
          </button>
        </form>

      </div>
    </div>
  );
}