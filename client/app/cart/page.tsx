'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, ArrowLeft, ShoppingCart, Tag, Truck, Shield, ChevronRight, Sparkles } from 'lucide-react';

/* ── Design tokens – matches the main Instawear theme ── */
const T = {
  brand:      '#2874F0',
  brandDk:    '#1a5dc8',
  brandLt:    '#EBF2FF',
  yellow:     '#FFD60A',
  orange:     '#FF6B00',
  green:      '#26A541',
  greenBg:    '#E8F8EE',
  red:        '#F43F3F',
  redBg:      '#FFF0F0',
  bg:         '#F1F3F6',
  white:      '#FFFFFF',
  ink:        '#212121',
  sub:        '#535665',
  muted:      '#9E9E9E',
  border:     '#E0E0E0',
};

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
    const name   = localStorage.getItem('userName') || 'Guest';

    if (!userId || !mobile) { alert('Please Login to Order!'); router.push('/login'); return; }

    setLoading(true);
    const orderData = {
      customerName: name,
      mobile,
      address:      localStorage.getItem('userAddress') || 'Default Address',
      items:        cart,
      totalAmount:  cart.reduce((sum, item) => sum + parseInt(item.price), 0),
      status:       'Pending',
    };

    await fetch('https://instaware-prototype.onrender.com/api/orders', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(orderData),
    });

    localStorage.removeItem('cart');
    alert('Order Placed Successfully!');
    router.push('/my-orders');
  };

  const remove = (idx) => {
    const newCart = [...cart];
    newCart.splice(idx, 1);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  /* ── Derived totals ── */
  const itemTotal    = cart.reduce((a, b) => a + parseInt(b.price), 0);
  const deliveryFee  = itemTotal >= 499 ? 0 : 49;
  const discount     = Math.round(itemTotal * 0.05);   // 5% platform discount shown for conversion
  const grandTotal   = itemTotal + deliveryFee - discount;

  /* ─────────────────────────────────────────
     EMPTY STATE
  ───────────────────────────────────────── */
  if (cart.length === 0) return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', fontFamily: "'Segoe UI','Helvetica Neue',sans-serif" }}>
      <style>{`
        @keyframes floatBag { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .float-anim { animation: floatBag 2.4s ease-in-out infinite; }
        .cta-btn:hover  { filter: brightness(1.08); }
        .cta-btn:active { transform: scale(0.97); }
      `}</style>

      {/* Floating bag illustration */}
      <div className="float-anim" style={{ width: 120, height: 120, background: T.brandLt, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 8px 32px rgba(40,116,240,0.18)' }}>
        <ShoppingCart size={54} color={T.brand} strokeWidth={1.5} />
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 900, color: T.ink, margin: '0 0 8px', textAlign: 'center' }}>Your Cart is Empty!</h2>
      <p style={{ fontSize: 14, color: T.muted, margin: '0 0 28px', textAlign: 'center', maxWidth: 280, lineHeight: 1.5 }}>
        Looks like you haven't added anything yet. Discover amazing products!
      </p>

      {/* Perks strip */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { icon: '🚚', text: 'Free delivery ₹499+' },
          { icon: '↩️', text: 'Easy returns' },
          { icon: '🔒', text: 'Secure checkout' },
        ].map(p => (
          <div key={p.text} style={{ display: 'flex', alignItems: 'center', gap: 5, background: T.white, borderRadius: 20, padding: '5px 12px', fontSize: 11, fontWeight: 700, color: T.sub, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <span>{p.icon}</span>{p.text}
          </div>
        ))}
      </div>

      <button
        className="cta-btn"
        onClick={() => router.push('/')}
        style={{ background: `linear-gradient(90deg, ${T.brand} 0%, #1a7fe8 100%)`, color: '#fff', border: 'none', borderRadius: 10, padding: '13px 36px', fontWeight: 900, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 18px rgba(40,116,240,0.38)', transition: 'all 0.15s ease', letterSpacing: '0.02em' }}
      >
        Start Shopping →
      </button>
    </div>
  );

  /* ─────────────────────────────────────────
     MAIN CART  
  ───────────────────────────────────────── */
  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: "'Segoe UI','Helvetica Neue',sans-serif", color: T.ink, paddingBottom: 96 }}>
      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .cart-item  { animation: slideIn 0.22s ease both; }
        .qty-btn    { transition: all 0.12s ease; }
        .qty-btn:hover  { background: ${T.brand} !important; color: #fff !important; }
        .qty-btn:active { transform: scale(0.9); }
        .del-btn:hover  { background: ${T.redBg} !important; color: ${T.red} !important; }
        .checkout-btn:hover  { filter: brightness(1.07); }
        .checkout-btn:active { transform: scale(0.98); }
        .remove-row:hover { background: #fff5f5; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ background: `linear-gradient(135deg, ${T.brandDk} 0%, ${T.brand} 100%)`, boxShadow: '0 2px 10px rgba(40,116,240,0.4)', position: 'sticky', top: 0, zIndex: 40 }}>
        {/* Yellow promo strip */}
        <div style={{ background: T.yellow, color: T.brandDk, textAlign: 'center', padding: '3px 12px', fontSize: 11, fontWeight: 900, letterSpacing: '0.06em' }}>
          ⚡ FREE Delivery on orders ₹499+ &nbsp;·&nbsp; <span style={{ textDecoration: 'underline' }}>INSTA20</span> → 20% off
        </div>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 14px', height: 52, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => router.back()}
            style={{ background: 'rgba(255,255,255,0.14)', border: 'none', borderRadius: 8, padding: '7px 9px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', transition: 'background 0.15s' }}
          >
            <ArrowLeft size={19} />
          </button>
          <div>
            <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 17, margin: 0, letterSpacing: '-0.3px' }}>
              My Cart
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, margin: 0, fontWeight: 700 }}>
              {cart.length} item{cart.length !== 1 ? 's' : ''} in your bag
            </p>
          </div>
          {/* Savings badge */}
          {discount > 0 && (
            <div style={{ marginLeft: 'auto', background: T.greenBg, color: T.green, fontSize: 10, fontWeight: 900, padding: '4px 10px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 3 }}>
              <Sparkles size={10} />
              ₹{discount} saved!
            </div>
          )}
        </div>
      </div>

      {/* ── PAGE BODY ── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '12px 10px 0' }}>

        {/* ── DELIVERY BANNER ── */}
        <div style={{ background: T.greenBg, border: `1px solid rgba(38,165,65,0.25)`, borderRadius: 10, padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
          <Truck size={18} color={T.green} />
          <div>
            {deliveryFee === 0
              ? <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: T.green }}>🎉 Yay! You get <strong>FREE delivery</strong> on this order.</p>
              : <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: T.sub }}>Add ₹{499 - itemTotal} more for <strong style={{ color: T.green }}>FREE delivery</strong></p>
            }
          </div>
        </div>

        {/* ── CART ITEMS ── */}
        <div style={{ marginBottom: 12 }}>
          {cart.map((item, i) => (
            <div
              key={i}
              className="cart-item"
              style={{
                animationDelay: `${i * 0.05}s`,
                background: T.white,
                borderRadius: 10,
                border: `1px solid ${T.border}`,
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                padding: '10px 12px',
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              {/* Product image */}
              <div style={{ width: 76, height: 76, flexShrink: 0, background: '#F9FAFF', borderRadius: 8, border: `1px solid ${T.border}`, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                />
              </div>

              {/* Info block */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Brand + name */}
                {item.brand && (
                  <p style={{ fontSize: 9, fontWeight: 900, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px' }}>
                    {item.brand}
                  </p>
                )}
                <h3
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: T.ink,
                    margin: '0 0 2px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.35,
                  }}
                >
                  {item.name}
                </h3>

                {/* Size tag */}
                {item.size && (
                  <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, color: T.sub, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 4, padding: '1px 6px', marginBottom: 4 }}>
                    Size: {item.size}
                  </span>
                )}

                {/* Price + savings row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 15, fontWeight: 900, color: T.ink }}>₹{parseInt(item.price).toLocaleString('en-IN')}</span>
                  <span style={{ fontSize: 10, fontWeight: 900, color: T.green, background: T.greenBg, padding: '1px 6px', borderRadius: 4 }}>
                    5% off applied
                  </span>
                </div>
              </div>

              {/* Right controls: delete */}
              <button
                className="del-btn"
                onClick={() => remove(i)}
                style={{ background: 'transparent', border: 'none', borderRadius: 8, padding: '7px', cursor: 'pointer', color: T.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease' }}
                title="Remove item"
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>

        {/* ── COUPON STRIP ── */}
        <div
          style={{ background: T.white, borderRadius: 10, border: `1px solid ${T.border}`, padding: '11px 14px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        >
          <div style={{ width: 32, height: 32, background: T.brandLt, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Tag size={16} color={T.brand} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: T.ink, margin: 0 }}>Apply Coupon</p>
            <p style={{ fontSize: 11, color: T.muted, margin: 0 }}>Save more with INSTA20</p>
          </div>
          <ChevronRight size={18} color={T.muted} />
        </div>

        {/* ── BILL DETAILS ── */}
        <div style={{ background: T.white, borderRadius: 10, border: `1px solid ${T.border}`, padding: '14px 16px', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          {/* Section title */}
          <p style={{ fontSize: 13, fontWeight: 900, color: T.ink, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Shield size={14} color={T.brand} /> Bill Details
          </p>

          {/* Rows */}
          {[
            { label: 'Item Total',          value: `₹${itemTotal.toLocaleString('en-IN')}`,    color: T.ink    },
            { label: 'Platform Discount',   value: `− ₹${discount.toLocaleString('en-IN')}`,  color: T.green  },
            { label: 'Delivery Fee',        value: deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`, color: T.green },
          ].map((row, i) => (
            <div key={row.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                <span style={{ fontSize: 13, color: T.sub, fontWeight: 600 }}>{row.label}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: row.color }}>{row.value}</span>
              </div>
              {i < 2 && <div style={{ borderTop: `1px dashed ${T.border}` }} />}
            </div>
          ))}

          {/* Grand total */}
          <div style={{ borderTop: `2px solid ${T.ink}`, marginTop: 8, paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 15, fontWeight: 900, color: T.ink }}>Grand Total</span>
            <span style={{ fontSize: 17, fontWeight: 900, color: T.ink }}>₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>

          {/* Savings notice */}
          {discount > 0 && (
            <div style={{ background: T.greenBg, borderRadius: 7, padding: '7px 10px', marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={13} color={T.green} />
              <p style={{ fontSize: 12, fontWeight: 800, color: T.green, margin: 0 }}>
                You're saving ₹{discount.toLocaleString('en-IN')} on this order 🎉
              </p>
            </div>
          )}
        </div>

        {/* ── TRUST BADGES ── */}
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0 4px' }}>
          {[
            { icon: '🔒', text: 'Secure Pay' },
            { icon: '↩️', text: 'Easy Return' },
            { icon: '⭐', text: '100% Genuine' },
          ].map(b => (
            <div key={b.text} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <span style={{ fontSize: 20 }}>{b.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: T.muted }}>{b.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          STICKY BOTTOM CHECKOUT BAR
      ══════════════════════════════════════════ */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 50,
        background: T.white,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.12)',
        borderTop: `1px solid ${T.border}`,
      }}>
        {/* Thin brand strip at top of bar */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${T.brand} 0%, ${T.yellow} 50%, ${T.orange} 100%)` }} />

        <div style={{ maxWidth: 720, margin: '0 auto', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          {/* Total block */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: T.muted, margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Grand Total</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: T.ink, letterSpacing: '-0.5px' }}>
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
              {discount > 0 && (
                <span style={{ fontSize: 11, fontWeight: 700, color: T.green }}>
                  Saved ₹{discount}
                </span>
              )}
            </div>
            <p style={{ fontSize: 10, color: T.muted, margin: 0 }}>{cart.length} item{cart.length !== 1 ? 's' : ''} · {deliveryFee === 0 ? '🚚 Free delivery' : `Delivery ₹${deliveryFee}`}</p>
          </div>

          {/* Checkout CTA */}
          <button
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={loading}
            style={{
              background: loading
                ? '#9BB8F0'
                : `linear-gradient(90deg, ${T.brand} 0%, #1a7fe8 100%)`,
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '13px 24px',
              fontWeight: 900,
              fontSize: 14,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 18px rgba(40,116,240,0.42)',
              transition: 'all 0.15s ease',
              letterSpacing: '0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              whiteSpace: 'nowrap',
              minWidth: 160,
              justifyContent: 'center',
            }}
          >
            {loading ? (
              <>
                <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                Processing…
              </>
            ) : (
              <>Place Order <ChevronRight size={16} /></>
            )}
          </button>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>

    </div>
  );
}