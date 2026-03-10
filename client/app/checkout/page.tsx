'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, CreditCard, ShoppingBag, Shield, CheckCircle2, ChevronRight, Package, Truck, Star, Zap, Lock } from 'lucide-react';

/* ── Design tokens – matches Instawear theme ── */
const T = {
  brand:     '#2874F0',
  brandDk:   '#1a5dc8',
  brandLt:   '#EBF2FF',
  yellow:    '#FFD60A',
  orange:    '#FF6B00',
  green:     '#26A541',
  greenBg:   '#E8F8EE',
  greenBd:   '#B2DFC1',
  red:       '#F43F3F',
  bg:        '#F1F3F6',
  white:     '#FFFFFF',
  ink:       '#212121',
  sub:       '#535665',
  muted:     '#9E9E9E',
  border:    '#E0E0E0',
};

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [user, setUser]         = useState({ name: '', mobile: '', address: '' });
  const [total, setTotal]       = useState(0);
  const [isTryAndBuy, setIsTryAndBuy] = useState(false);

  // --- SAFE DATA LOADING (Runs only in Browser) ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const savedUser = {
        name:    localStorage.getItem('userName')    || '',
        mobile:  localStorage.getItem('userMobile')  || '',
        address: localStorage.getItem('userAddress') || '',
      };

      if (savedCart.length === 0) {
        router.push('/cart');
      } else {
        setCart(savedCart);
        setUser(savedUser);
        setTotal(savedCart.reduce((sum: number, item: any) => sum + Number(item.price), 0));
      }
      setLoading(false);
    }
  }, []);

  const handlePlaceOrder = async () => {
    if (!user.mobile) { alert('Please Login first'); router.push('/login'); return; }

    try {
      const orderData = {
        customerName: user.name,
        mobile:       user.mobile,
        address:      user.address || 'Bangalore, India',
        items:        cart,
        totalAmount:  grandTotal,
        status:       'Pending',
      };

      const res = await fetch('https://instaware-prototype.onrender.com/api/orders', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(orderData),
      });

      if (res.ok) {
        localStorage.removeItem('cart');
        alert('Order Placed Successfully! 🎉');
        router.push('/my-orders');
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Order Error:', error);
      alert('Something went wrong.');
    }
  };

  /* ── Derived values ── */
  const TRY_AND_BUY_FEE = 99;
  const deliveryFee  = total >= 499 ? 0 : 49;
  const discount     = Math.round(total * 0.05);
  const grandTotal   = total + deliveryFee - discount + (isTryAndBuy ? TRY_AND_BUY_FEE : 0);

  /* ── Loading state ── */
  if (loading) return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, fontFamily: "'Segoe UI','Helvetica Neue',sans-serif" }}>
      <div style={{ width: 48, height: 48, border: `4px solid ${T.brandLt}`, borderTopColor: T.brand, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ fontSize: 14, fontWeight: 700, color: T.sub }}>Securing your checkout…</p>
      <style>{`@keyframes spin { to { transform:rotate(360deg) } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: "'Segoe UI','Helvetica Neue',sans-serif", color: T.ink, paddingBottom: 104 }}>
      <style>{`
        @keyframes spin      { to { transform:rotate(360deg) } }
        @keyframes slideUp   { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulseGlow { 0%,100% { box-shadow:0 4px 20px rgba(40,116,240,0.45); } 50% { box-shadow:0 4px 32px rgba(40,116,240,0.75); } }
        .section-card { animation: slideUp 0.25s ease both; }
        .place-btn    { animation: pulseGlow 2.2s ease-in-out infinite; }
        .place-btn:hover  { filter: brightness(1.08); }
        .place-btn:active { transform: scale(0.97) !important; }
      `}</style>

      {/* ══ HEADER ══ */}
      <div style={{
        background: `linear-gradient(135deg, ${T.brandDk} 0%, ${T.brand} 100%)`,
        boxShadow: '0 2px 10px rgba(40,116,240,0.4)',
        position: 'sticky', top: 0, zIndex: 40,
      }}>
        {/* Promo strip */}
        <div style={{ background: T.yellow, color: T.brandDk, textAlign: 'center', padding: '3px 12px', fontSize: 11, fontWeight: 900, letterSpacing: '0.06em' }}>
          ⚡ FREE Delivery on orders ₹499+ &nbsp;·&nbsp; <span style={{ textDecoration: 'underline' }}>INSTA20</span> → 20% off
        </div>

        <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 14px', height: 52, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => router.back()}
            style={{ background: 'rgba(255,255,255,0.14)', border: 'none', borderRadius: 8, padding: '7px 9px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', transition: 'background 0.15s' }}
          >
            <ArrowLeft size={19} />
          </button>

          <div style={{ flex: 1 }}>
            <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 17, margin: 0, letterSpacing: '-0.3px' }}>Checkout</h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, margin: 0, fontWeight: 700 }}>
              {cart.length} item{cart.length !== 1 ? 's' : ''} · ₹{grandTotal.toLocaleString('en-IN')} to pay
            </p>
          </div>

          {/* Secure badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.14)', borderRadius: 20, padding: '4px 10px' }}>
            <Lock size={11} color={T.yellow} />
            <span style={{ fontSize: 10, fontWeight: 900, color: T.yellow, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>100% SECURE</span>
          </div>
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '12px 10px 0' }}>

        {/* ── STEP TRACKER ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 16, background: T.white, borderRadius: 10, border: `1px solid ${T.border}`, padding: '10px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          {[
            { label: 'Cart',     icon: ShoppingBag, done: true  },
            { label: 'Checkout', icon: CreditCard,  done: false, active: true },
            { label: 'Ordered',  icon: Package,     done: false },
          ].map((step, i) => (
            <React.Fragment key={step.label}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: step.done ? T.green : step.active ? T.brand : T.border,
                  transition: 'all 0.2s',
                }}>
                  <step.icon size={14} color="#fff" />
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, color: step.done ? T.green : step.active ? T.brand : T.muted, letterSpacing: '0.04em' }}>
                  {step.label}
                </span>
              </div>
              {i < 2 && (
                <div style={{ flex: 1, height: 2, borderRadius: 2, background: step.done ? T.green : T.border, margin: '0 6px', marginBottom: 14, transition: 'background 0.3s' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── DELIVERY ADDRESS ── */}
        <div
          className="section-card"
          style={{ animationDelay: '0.05s', background: T.white, borderRadius: 10, border: `2px solid ${T.green}`, boxShadow: `0 2px 12px rgba(38,165,65,0.12)`, padding: '14px 16px', marginBottom: 10 }}
        >
          {/* Section label */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 28, height: 28, background: T.greenBg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={14} color={T.green} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 900, color: T.green, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Delivery Address</span>
            </div>
            {/* Active checkmark */}
            <CheckCircle2 size={18} color={T.green} fill={T.greenBg} />
          </div>

          {/* Address body */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            {/* Home tag */}
            <span style={{ flexShrink: 0, fontSize: 9, fontWeight: 900, background: T.brandLt, color: T.brand, padding: '3px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>
              🏠 Home
            </span>
            <div>
              <p style={{ fontSize: 14, fontWeight: 800, color: T.ink, margin: '0 0 3px', lineHeight: 1.4 }}>
                {user.address || 'No address saved — please update your profile'}
              </p>
              <p style={{ fontSize: 12, color: T.sub, margin: 0, fontWeight: 600 }}>
                📞 {user.mobile || 'Mobile not found'}
              </p>
            </div>
          </div>

          {/* Delivery ETA strip */}
          <div style={{ marginTop: 10, padding: '7px 10px', background: T.greenBg, borderRadius: 7, display: 'flex', alignItems: 'center', gap: 7 }}>
            <Truck size={14} color={T.green} />
            <span style={{ fontSize: 12, fontWeight: 800, color: T.green }}>
              Estimated delivery: <strong>2–4 business days</strong>
            </span>
          </div>
        </div>

        {/* ── ORDER SUMMARY ── */}
        <div
          className="section-card"
          style={{ animationDelay: '0.1s', background: T.white, borderRadius: 10, border: `1px solid ${T.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '14px 16px', marginBottom: 10 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, background: T.brandLt, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={14} color={T.brand} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 900, color: T.brand, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Order Summary</span>
            <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 900, background: T.brandLt, color: T.brand, padding: '2px 8px', borderRadius: 20 }}>
              {cart.length} item{cart.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Item rows */}
          <div style={{ marginBottom: 10 }}>
            {cart.map((item: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 9, marginBottom: idx < cart.length - 1 ? 9 : 0, borderBottom: idx < cart.length - 1 ? `1px dashed ${T.border}` : 'none' }}>
                {/* Thumb */}
                <div style={{ width: 44, height: 44, borderRadius: 7, background: '#F9FAFF', border: `1px solid ${T.border}`, overflow: 'hidden', flexShrink: 0 }}>
                  {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: T.ink, margin: '0 0 1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                  {item.size && <span style={{ fontSize: 10, color: T.muted, fontWeight: 600 }}>Size: {item.size}</span>}
                </div>
                <span style={{ fontSize: 14, fontWeight: 900, color: T.ink, flexShrink: 0 }}>₹{Number(item.price).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          {/* ── TRY & BUY TOGGLE ── */}
          <div
            onClick={() => setIsTryAndBuy(v => !v)}
            style={{
              marginBottom: 10,
              borderRadius: 10,
              border: `2px solid ${isTryAndBuy ? T.purple : T.border}`,
              background: isTryAndBuy ? '#F3EEFF' : T.white,
              padding: '12px 14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              transition: 'all 0.18s ease',
              boxShadow: isTryAndBuy ? '0 2px 14px rgba(124,58,237,0.14)' : 'none',
            }}
          >
            {/* Icon box */}
            <div style={{
              width: 42, height: 42, borderRadius: 10, flexShrink: 0,
              background: isTryAndBuy ? '#7C3AED' : '#EDE9FE',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.18s',
            }}>
              <span style={{ fontSize: 20 }}>👕</span>
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <p style={{ fontSize: 13, fontWeight: 900, color: isTryAndBuy ? '#7C3AED' : T.ink, margin: 0 }}>
                  Try &amp; Buy
                </p>
                <span style={{
                  fontSize: 9, fontWeight: 900, padding: '2px 7px', borderRadius: 20,
                  background: '#7C3AED', color: '#fff', letterSpacing: '0.06em',
                }}>
                  + ₹99
                </span>
                {isTryAndBuy && (
                  <span style={{ fontSize: 9, fontWeight: 900, padding: '2px 7px', borderRadius: 20, background: T.greenBg, color: T.green }}>
                    ADDED ✓
                  </span>
                )}
              </div>
              <p style={{ fontSize: 11, color: T.muted, margin: '2px 0 0', fontWeight: 600, lineHeight: 1.4 }}>
                Try the product at home before committing. Return if not satisfied.
              </p>
            </div>

            {/* Toggle switch */}
            <div style={{
              width: 42, height: 24, borderRadius: 12, flexShrink: 0,
              background: isTryAndBuy ? '#7C3AED' : T.border,
              position: 'relative',
              transition: 'background 0.2s ease',
            }}>
              <div style={{
                position: 'absolute',
                top: 3, left: isTryAndBuy ? 20 : 3,
                width: 18, height: 18, borderRadius: '50%',
                background: T.white,
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                transition: 'left 0.2s ease',
              }} />
            </div>
          </div>

          {/* Bill Details */}
          <div style={{ background: T.bg, borderRadius: 8, padding: '10px 12px' }}>
            <p style={{ fontSize: 11, fontWeight: 900, color: T.sub, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Bill Details</p>

            {[
              { label: 'Item Total',         val: `₹${total.toLocaleString('en-IN')}`,           color: T.ink   },
              { label: 'Platform Discount',  val: `− ₹${discount.toLocaleString('en-IN')}`,      color: T.green },
              { label: 'Delivery Charges',   val: deliveryFee === 0 ? 'FREE 🚚' : `₹${deliveryFee}`, color: T.green },
              ...(isTryAndBuy ? [{ label: 'Try & Buy Service', val: '+ ₹99', color: '#7C3AED' }] : []),
            ].map((row, i, arr) => (
              <div key={row.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                  <span style={{ fontSize: 12, color: T.sub, fontWeight: 600 }}>{row.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: row.color }}>{row.val}</span>
                </div>
                {i < arr.length - 1 && <div style={{ borderTop: `1px dashed ${T.border}` }} />}
              </div>
            ))}

            <div style={{ borderTop: `2px solid ${T.ink}`, marginTop: 8, paddingTop: 9, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 900, color: T.ink }}>To Pay</span>
              <span style={{ fontSize: 18, fontWeight: 900, color: T.brand }}>₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* ── PAYMENT METHOD ── */}
        <div
          className="section-card"
          style={{ animationDelay: '0.15s', background: T.white, borderRadius: 10, border: `1px solid ${T.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '14px 16px', marginBottom: 10 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, background: T.brandLt, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={14} color={T.brand} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 900, color: T.brand, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Payment Method</span>
          </div>

          {/* COD option – permanently selected */}
          <div style={{ background: T.greenBg, border: `2px solid ${T.greenBd}`, borderRadius: 9, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Green check circle */}
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: T.green, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(38,165,65,0.35)' }}>
              <CheckCircle2 size={18} color="#fff" fill={T.green} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 900, color: T.ink, margin: '0 0 1px' }}>Cash on Delivery</p>
              <p style={{ fontSize: 11, color: T.sub, margin: 0, fontWeight: 600 }}>Pay when your order arrives at door</p>
            </div>
            <span style={{ fontSize: 9, fontWeight: 900, background: T.green, color: '#fff', padding: '3px 8px', borderRadius: 20, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              SELECTED
            </span>
          </div>

          {/* Locked payment notice */}
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: T.brandLt, borderRadius: 7 }}>
            <Shield size={12} color={T.brand} />
            <span style={{ fontSize: 11, fontWeight: 700, color: T.brand }}>Payments powered by Instawear SecurePay™</span>
          </div>
        </div>

        {/* ── TRUST BADGES ── */}
        <div
          className="section-card"
          style={{ animationDelay: '0.2s', background: T.white, borderRadius: 10, border: `1px solid ${T.border}`, padding: '12px 16px', marginBottom: 10, display: 'flex', justifyContent: 'space-around', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
        >
          {[
            { icon: '🔒', title: 'Secure',   sub: '256-bit SSL'    },
            { icon: '↩️', title: 'Returns',  sub: '7-day easy'     },
            { icon: '⭐', title: 'Genuine',  sub: '100% authentic' },
            { icon: '🚚', title: 'Fast',     sub: '2-4 day ship'   },
          ].map(b => (
            <div key={b.title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <span style={{ fontSize: 20 }}>{b.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: T.ink }}>{b.title}</span>
              <span style={{ fontSize: 9, color: T.muted, fontWeight: 600, textAlign: 'center' }}>{b.sub}</span>
            </div>
          ))}
        </div>

      </div>{/* end body */}

      {/* ══════════════════════════════════════════
          STICKY CHECKOUT BAR
      ══════════════════════════════════════════ */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 50,
        background: T.white,
        boxShadow: '0 -6px 24px rgba(0,0,0,0.13)',
        borderTop: `1px solid ${T.border}`,
      }}>
        {/* Rainbow top strip */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${T.brand} 0%, #7C3AED 35%, ${T.orange} 65%, ${T.yellow} 100%)` }} />

        <div style={{ maxWidth: 680, margin: '0 auto', padding: '10px 14px' }}>
          {/* Savings banner above button */}
          {discount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 8, background: T.greenBg, borderRadius: 7, padding: '5px 12px' }}>
              <Zap size={11} color={T.green} />
              <span style={{ fontSize: 11, fontWeight: 800, color: T.green }}>
                You're saving ₹{discount.toLocaleString('en-IN')} on this order!
              </span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Price block */}
            <div style={{ flexShrink: 0 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: T.muted, margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total</p>
              <span style={{ fontSize: 22, fontWeight: 900, color: T.ink, letterSpacing: '-0.5px', lineHeight: 1.15 }}>
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
              <p style={{ fontSize: 10, color: T.green, fontWeight: 700, margin: 0 }}>
                {deliveryFee === 0 ? '+ Free delivery' : `+ ₹${deliveryFee} delivery`}
              </p>
            </div>

            {/* CTA button */}
            <button
              className="place-btn"
              onClick={handlePlaceOrder}
              style={{
                flex: 1,
                background: `linear-gradient(90deg, ${T.brand} 0%, #1a7fe8 100%)`,
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '14px 16px',
                fontWeight: 900,
                fontSize: 15,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                letterSpacing: '0.02em',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <Lock size={15} />
              Place Order • ₹{grandTotal.toLocaleString('en-IN')}
            </button>
          </div>

          {/* Micro-trust note */}
          <p style={{ textAlign: 'center', fontSize: 10, color: T.muted, margin: '7px 0 0', fontWeight: 600 }}>
            🔒 256-bit encrypted · COD · 7-day returns guaranteed
          </p>
        </div>
      </div>

    </div>
  );
}