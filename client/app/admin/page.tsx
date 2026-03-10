'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Smartphone, Lock, User, ShieldCheck, AlertCircle, Zap, Eye, EyeOff, Store } from 'lucide-react';

/* ── Design tokens ── */
const T = {
  brand:    '#2874F0',
  brandDk:  '#1a5dc8',
  brandLt:  '#EBF2FF',
  yellow:   '#FFD60A',
  orange:   '#FF6B00',
  green:    '#26A541',
  greenBg:  '#E8F8EE',
  red:      '#F43F3F',
  redBg:    '#FFF0F0',
  white:    '#FFFFFF',
  ink:      '#212121',
  sub:      '#535665',
  muted:    '#9E9E9E',
  bg:       '#F1F3F6',
  border:   '#E0E0E0',
};

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin]   = useState(true);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({ name: '', mobile: '', password: '', role: 'customer' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const endpoint = isLogin
      ? 'https://instaware-prototype.onrender.com/api/auth/login'
      : 'https://instaware-prototype.onrender.com/api/auth/signup';

    try {
      const res  = await fetch(endpoint, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      if (isLogin) {
        localStorage.setItem('userName',   data.user.name);
        localStorage.setItem('userMobile', data.user.mobile);
        localStorage.setItem('role',       data.user.role);
        localStorage.setItem('userId',     data.user._id);

        const role = data.user.role;

        if (role === 'superadmin') {
          setLoading(false);
          router.push('/superadmin');
        } else if (role === 'vendor' || role === 'partner') {
          localStorage.setItem('shopId',   data.user._id);
          localStorage.setItem('shopName', data.user.name + "'s Store");
          setLoading(false);
          router.push('/admin');
        } else {
          // role === 'customer' or any other default
          setLoading(false);
          router.push('/');
        }
      } else {
        alert('Account Created! Please Login.');
        setIsLogin(true); setLoading(false);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const switchMode = () => { setIsLogin(!isLogin); setError(''); };

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: "'Segoe UI','Helvetica Neue',sans-serif", display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes slideDown { from { opacity:0; transform:translateY(-16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideUp   { from { opacity:0; transform:translateY(16px);  } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse     { 0%,100%{box-shadow:0 4px 20px rgba(40,116,240,0.45)} 50%{box-shadow:0 4px 32px rgba(40,116,240,0.75)} }
        @keyframes spin      { to { transform:rotate(360deg) } }
        .hero-section { animation: slideDown 0.35s ease both; }
        .form-card    { animation: slideUp  0.35s ease both; }
        .input-field:focus { outline: none; border-color: ${T.brand} !important; box-shadow: 0 0 0 3px rgba(40,116,240,0.15) !important; }
        .cta-btn      { animation: pulse 2.4s ease-in-out infinite; transition: all 0.15s ease; }
        .cta-btn:hover  { filter: brightness(1.07); }
        .cta-btn:active { transform: scale(0.97); animation: none; }
        .role-btn { transition: all 0.15s ease; }
        .switch-link:hover { text-decoration: underline; }
        .trust-badge { transition: transform 0.15s; }
        .trust-badge:hover { transform: translateY(-2px); }
      `}</style>

      {/* ══════════════════════════════════════════
          HERO HEADER  –  colorful top section
      ══════════════════════════════════════════ */}
      <div
        className="hero-section"
        style={{
          background: `linear-gradient(135deg, ${T.brandDk} 0%, ${T.brand} 60%, #4A90E2 100%)`,
          padding: '40px 20px 80px',
          position: 'relative',
          overflow: 'hidden',
          /* Rounded bottom edge */
          borderBottomLeftRadius: '32px',
          borderBottomRightRadius: '32px',
        }}
      >
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,214,10,0.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 10, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,107,0,0.12)', pointerEvents: 'none' }} />

        {/* Yellow promo strip at very top */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          background: T.yellow, color: T.brandDk,
          textAlign: 'center', padding: '4px 12px',
          fontSize: 11, fontWeight: 900, letterSpacing: '0.06em',
        }}>
          ⚡ New users get <span style={{ textDecoration: 'underline' }}>INSTA20</span> — 20% off first order!
        </div>

        {/* Logo */}
        <div style={{ marginTop: 28, textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div
            onClick={() => router.push('/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
          >
            <div style={{ width: 40, height: 40, background: T.yellow, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(255,214,10,0.45)' }}>
              <Zap size={22} color={T.brandDk} fill={T.brandDk} />
            </div>
            <span style={{ fontSize: 26, fontWeight: 900, color: T.white, letterSpacing: '-0.5px' }}>
              Insta<span style={{ color: T.yellow }}>ware</span>
            </span>
          </div>
        </div>

        {/* Welcome copy */}
        <div style={{ marginTop: 20, textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <h1 style={{ color: T.white, fontSize: 'clamp(22px, 5vw, 30px)', fontWeight: 900, margin: '0 0 6px', letterSpacing: '-0.5px' }}>
            {isLogin ? 'Welcome back! 🚀' : 'Create your account 🎉'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 14, margin: 0, fontWeight: 600 }}>
            {isLogin
              ? 'Sign in to continue shopping on Instawear'
              : 'Join thousands of happy Instawear customers'}
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          FORM CARD  –  overlaps the hero
      ══════════════════════════════════════════ */}
      <div style={{ flex: 1, padding: '0 16px 32px', marginTop: -40, maxWidth: 480, width: '100%', margin: '-40px auto 0', boxSizing: 'border-box' }}>
        <div
          className="form-card"
          style={{
            background: T.white,
            borderRadius: 20,
            boxShadow: '0 8px 40px rgba(40,116,240,0.14)',
            padding: '28px 24px 24px',
            border: `1px solid ${T.border}`,
          }}
        >
          {/* Tab switcher: Login / Sign Up */}
          <div style={{ display: 'flex', background: T.bg, borderRadius: 12, padding: 4, marginBottom: 22, gap: 4 }}>
            {[
              { key: true,  label: 'Login'   },
              { key: false, label: 'Sign Up' },
            ].map(tab => (
              <button
                key={String(tab.key)}
                type="button"
                onClick={() => switchMode()}
                className="role-btn"
                style={{
                  flex: 1, border: 'none', borderRadius: 9, padding: '9px 0', cursor: 'pointer', fontWeight: 900, fontSize: 13, letterSpacing: '0.04em',
                  background: isLogin === tab.key ? T.brand : 'transparent',
                  color:      isLogin === tab.key ? T.white  : T.muted,
                  boxShadow:  isLogin === tab.key ? '0 2px 10px rgba(40,116,240,0.3)' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Error banner */}
          {error && (
            <div style={{ background: T.redBg, border: `1px solid rgba(244,63,63,0.25)`, borderRadius: 9, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={15} color={T.red} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: T.red }}>{error}</span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* ── Signup-only fields ── */}
              {!isLogin && (
                <>
                  {/* Full name */}
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: T.muted, pointerEvents: 'none' }} />
                    <input
                      className="input-field"
                      style={{ width: '100%', boxSizing: 'border-box', padding: '13px 14px 13px 42px', fontSize: 15, fontWeight: 600, borderRadius: 10, border: `1.5px solid ${T.border}`, background: T.bg, color: T.ink, transition: 'border 0.15s, box-shadow 0.15s' }}
                      placeholder="Full Name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>

                  {/* Role selector */}
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 900, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Account Type</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[
                        { val: 'customer', icon: '🛍️', label: 'Customer' },
                        { val: 'vendor',   icon: '🏪', label: 'Vendor'   },
                      ].map(r => (
                        <button
                          key={r.val}
                          type="button"
                          onClick={() => setForm({ ...form, role: r.val })}
                          className="role-btn"
                          style={{
                            flex: 1, border: `2px solid ${form.role === r.val ? T.brand : T.border}`, borderRadius: 10, padding: '10px 8px', cursor: 'pointer', fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            background: form.role === r.val ? T.brandLt : T.white,
                            color:      form.role === r.val ? T.brand   : T.sub,
                          }}
                        >
                          <span style={{ fontSize: 16 }}>{r.icon}</span>{r.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Mobile number */}
              <div style={{ position: 'relative' }}>
                {/* +91 prefix */}
                <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 6, pointerEvents: 'none' }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: T.sub }}>🇮🇳</span>
                  <span style={{ fontSize: 13, fontWeight: 900, color: T.sub }}>+91</span>
                  <div style={{ width: 1, height: 16, background: T.border }} />
                </div>
                <input
                  className="input-field"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '13px 14px 13px 68px', fontSize: 15, fontWeight: 600, borderRadius: 10, border: `1.5px solid ${T.border}`, background: T.bg, color: T.ink, transition: 'border 0.15s, box-shadow 0.15s' }}
                  placeholder="Mobile Number"
                  type="tel"
                  value={form.mobile}
                  onChange={e => setForm({ ...form, mobile: e.target.value })}
                  required
                />
              </div>

              {/* Password */}
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: T.muted, pointerEvents: 'none' }} />
                <input
                  className="input-field"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '13px 44px 13px 42px', fontSize: 15, fontWeight: 600, borderRadius: 10, border: `1.5px solid ${T.border}`, background: T.bg, color: T.ink, transition: 'border 0.15s, box-shadow 0.15s' }}
                  placeholder="Password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: T.muted, padding: 4, display: 'flex' }}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* CTA button */}
              <button
                type="submit"
                disabled={loading}
                className="cta-btn"
                style={{
                  width: '100%', border: 'none', borderRadius: 12, padding: '15px', fontWeight: 900, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer',
                  background: loading ? '#9BB8F0' : `linear-gradient(90deg, ${T.brand} 0%, #1a7fe8 100%)`,
                  color: T.white, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, letterSpacing: '0.02em',
                }}
              >
                {loading ? (
                  <>
                    <span style={{ display: 'inline-block', width: 16, height: 16, border: '2.5px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    Processing…
                  </>
                ) : (
                  <>
                    {isLogin ? 'Login to Instawear' : 'Create Account'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Switch mode link */}
          <p style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: T.sub, fontWeight: 600 }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={switchMode}
              className="switch-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 900, color: T.brand, padding: 0 }}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0 16px' }}>
            <div style={{ flex: 1, height: 1, background: T.border }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: T.muted, whiteSpace: 'nowrap' }}>SECURED BY</span>
            <div style={{ flex: 1, height: 1, background: T.border }} />
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {[
              { icon: '🔒', label: '256-bit SSL'   },
              { icon: '🛡️', label: 'Privacy Safe'  },
              { icon: '✅', label: 'Verified App'  },
            ].map(b => (
              <div key={b.label} className="trust-badge" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <span style={{ fontSize: 20 }}>{b.icon}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: T.muted }}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof strip below card */}
        <div style={{ textAlign: 'center', marginTop: 20, display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
          {[
            { emoji: '⭐', text: '4.8 Rating' },
            { emoji: '👥', text: '10k+ Users' },
            { emoji: '🚀', text: 'Fast Delivery' },
          ].map(s => (
            <div key={s.text} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: T.white, borderRadius: 20, padding: '5px 12px', fontSize: 11, fontWeight: 700, color: T.sub, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: `1px solid ${T.border}` }}>
              <span>{s.emoji}</span>{s.text}
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: T.muted, lineHeight: 1.5, padding: '0 8px' }}>
          By continuing, you agree to Instawear's <span style={{ color: T.brand, fontWeight: 700 }}>Terms of Service</span> and <span style={{ color: T.brand, fontWeight: 700 }}>Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}