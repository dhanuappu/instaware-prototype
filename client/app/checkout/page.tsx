'use client';
import React, { useState } from 'react';
import { ArrowLeft, CreditCard, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  
  // SIMULATION: Imagine the user added these 2 items
  const cartItems = [
    { id: 1, name: "Oversized Street Tee", price: 899, size: "L" },
    { id: 2, name: "Vintage Cargo Pants", price: 1499, size: "32" }
  ];

  const subtotal = 2398;
  const deliveryFee = 40; // Quick Commerce standard
  const platformFee = 10;
  const total = subtotal + deliveryFee + platformFee;

  return (
    <div className="min-h-screen bg-gray-50 text-black font-sans pb-20">
      
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => router.back()}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Checkout</h1>
      </div>

      <div className="p-4 max-w-lg mx-auto">
        
        {/* Delivery Address Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gray-100 p-2 rounded-full">
              <MapPin size={20} />
            </div>
            <h3 className="font-bold">Delivery to Home</h3>
          </div>
          <p className="text-gray-500 text-sm ml-10">
            No. 402, Green Avenue, Indiranagar, Bangalore - 560038
          </p>
          <p className="text-green-600 text-xs font-bold ml-10 mt-1">
            ⚡ Arriving in 38 mins
          </p>
        </div>

        {/* Item Summary */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
          <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-400">Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
              <div>
                <div className="font-bold">{item.name}</div>
                <div className="text-xs text-gray-400">Size: {item.size}</div>
              </div>
              <div className="font-mono">₹{item.price}</div>
            </div>
          ))}
        </div>

        {/* Bill Details (The Receipt) */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-400">Bill Details</h3>
          
          <div className="flex justify-between mb-2 text-sm text-gray-600">
            <span>Item Total</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between mb-2 text-sm text-gray-600">
            <span>Delivery Fee</span>
            <span>₹{deliveryFee}</span>
          </div>
          <div className="flex justify-between mb-2 text-sm text-gray-600">
            <span>Platform Fee</span>
            <span>₹{platformFee}</span>
          </div>
          <div className="border-t border-dashed border-gray-300 my-3"></div>
          <div className="flex justify-between font-black text-lg">
            <span>TO PAY</span>
            <span>₹{total}</span>
          </div>
        </div>

        {/* Payment Button (Sticky Bottom) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200">
          <div className="max-w-lg mx-auto">
            <button className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg flex justify-between px-6 hover:bg-gray-800">
              <span className="flex items-center gap-2"><CreditCard size={20}/> Pay Now</span>
              <span>₹{total}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}