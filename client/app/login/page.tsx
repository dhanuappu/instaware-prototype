'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Smartphone, Lock, User, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({ name: '', mobile: '', password: '', role: 'customer' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const endpoint = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/signup';

    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Something went wrong');

        if (isLogin) {
            localStorage.setItem('userName', data.user.name);
            localStorage.setItem('userMobile', data.user.mobile);
            localStorage.setItem('role', data.user.role);
            localStorage.setItem('userId', data.user._id);

            if (data.user.role === 'superadmin') router.push('/superadmin');
            else if (data.user.role === 'vendor') {
                localStorage.setItem('shopId', data.user._id);
                localStorage.setItem('shopName', data.user.name + "'s Store");
                router.push('/admin');
            } else {
                router.push('/');
            }
        } else {
            alert("Account Created! Please Login.");
            setIsLogin(true); setLoading(false);
        }
    } catch (err) {
        setError(err.message);
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* LEFT: BRANDING */}
      <div className="hidden lg:flex w-1/2 bg-black relative items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover opacity-50"/>
        <div className="relative z-10 text-white p-16">
            <h1 className="text-6xl font-black mb-4 tracking-tighter">INSTAWARE.</h1>
            <p className="text-xl text-gray-300">The next generation of streetwear.</p>
        </div>
      </div>

      {/* RIGHT: FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
            <div className="mb-8">
                <h1 className="text-3xl font-black mb-2">{isLogin ? 'Welcome Back' : 'Get Started'}</h1>
                <p className="text-gray-500">Enter your credentials to access your account.</p>
            </div>
            
            {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm font-bold mb-4 flex gap-2"><AlertCircle size={16}/>{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <>
                        <div className="relative"><User className="absolute left-4 top-3.5 text-gray-400" size={20}/><input className="w-full bg-gray-50 p-3 pl-12 rounded-xl font-bold outline-none focus:ring-2 focus:ring-black" placeholder="Full Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/></div>
                        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                            {['customer', 'vendor'].map(r => (
                                <button key={r} type="button" onClick={()=>setForm({...form, role:r})} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase ${form.role===r?'bg-black text-white':'text-gray-500'}`}>{r}</button>
                            ))}
                        </div>
                    </>
                )}
                <div className="relative"><Smartphone className="absolute left-4 top-3.5 text-gray-400" size={20}/><input className="w-full bg-gray-50 p-3 pl-12 rounded-xl font-bold outline-none focus:ring-2 focus:ring-black" placeholder="Mobile Number" type="tel" value={form.mobile} onChange={e=>setForm({...form, mobile:e.target.value})} required/></div>
                <div className="relative"><Lock className="absolute left-4 top-3.5 text-gray-400" size={20}/><input className="w-full bg-gray-50 p-3 pl-12 rounded-xl font-bold outline-none focus:ring-2 focus:ring-black" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required/></div>

                <button disabled={loading} className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition flex justify-center items-center gap-2">
                    {loading ? "Processing..." : (isLogin ? "Login" : "Sign Up")} <ArrowRight size={20}/>
                </button>
            </form>

            <div className="mt-6 text-center text-sm font-bold text-gray-400">
                <button onClick={() => {setIsLogin(!isLogin); setError('')}} className="underline hover:text-black">
                    {isLogin ? "Create an Account" : "Back to Login"}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}