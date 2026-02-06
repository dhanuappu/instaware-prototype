'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Clock, CheckCircle, Truck, ShoppingBag } from 'lucide-react';

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userMobile, setUserMobile] = useState('');

  useEffect(() => {
    // 1. Get User Info
    const mobile = localStorage.getItem('userMobile');
    
    if (!mobile) {
        alert("Please login to view orders");
        router.push('/login');
        return;
    }

    setUserMobile(mobile);

    // 2. Fetch Orders for this Mobile Number
    fetch(`https://instaware-prototype.onrender.com/api/orders/user/${mobile}`)
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status) => {
      switch(status) {
          case 'Delivered': return 'text-green-600 bg-green-50 border-green-100';
          case 'Out for Delivery': return 'text-purple-600 bg-purple-50 border-purple-100';
          case 'Packed': return 'text-blue-600 bg-blue-50 border-blue-100';
          default: return 'text-yellow-600 bg-yellow-50 border-yellow-100';
      }
  };

  const getStatusIcon = (status) => {
      if (status === 'Delivered') return <CheckCircle size={16}/>;
      if (status === 'Out for Delivery') return <Truck size={16}/>;
      return <Clock size={16}/>;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black font-sans pb-10">
      
      {/* HEADER */}
      <div className="bg-white sticky top-0 z-10 border-b border-gray-200 px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft size={24}/>
          </button>
          <div>
              <h1 className="text-xl font-black uppercase tracking-wider">My Orders</h1>
              <p className="text-xs text-gray-400 font-bold">{userMobile}</p>
          </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        
        {loading ? (
             <div className="space-y-4">
                 {[1,2,3].map(i => (
                     <div key={i} className="h-40 bg-gray-200 rounded-xl animate-pulse"></div>
                 ))}
             </div>
        ) : (
            <div className="space-y-6">
                {orders.length > 0 ? orders.map((order) => (
                    <div key={order._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 overflow-hidden">
                        
                        {/* Order Header */}
                        <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-3">
                            <div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</div>
                                <div className="font-mono text-sm font-bold text-gray-600">#{order._id.slice(-6).toUpperCase()}</div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 border ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                {order.status || "Pending"}
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="space-y-4">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                        {/* Since order history might not save images in DB, we use placeholder or item image if saved */}
                                        <img src={item.image || "https://via.placeholder.com/100"} className="w-full h-full object-cover"/>
                                        <div className="absolute bottom-0 right-0 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-tl-lg">
                                            x{item.quantity}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-sm line-clamp-2">{item.productName || item.name}</h3>
                                        <div className="text-xs text-gray-500 font-medium mt-1">Size: {item.size || 'M'}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-sm">₹{item.price}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer Totals */}
                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                            <div className="text-xs text-gray-400 font-bold">
                                Ordered on {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-lg font-black">
                                ₹{order.totalAmount}
                            </div>
                        </div>

                    </div>
                )) : (
                    <div className="text-center py-20">
                        <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <Package size={40}/>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">No orders yet</h2>
                        <p className="text-sm text-gray-500 mb-6">Start shopping to fill this page!</p>
                        <button onClick={() => router.push('/')} className="bg-black text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition">
                            Start Shopping
                        </button>
                    </div>
                )}
            </div>
        )}

      </div>
    </div>
  );
}