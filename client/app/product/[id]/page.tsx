'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Truck, MapPin, ShoppingBag, ShieldCheck, Star, Zap, ChevronRight, Heart, Share2, CheckCircle2, Tag, RotateCcw } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

/* ── Design tokens ── */
const T = {
  brand:    '#2874F0',
  brandDk:  '#1a5dc8',
  brandLt:  '#EBF2FF',
  yellow:   '#FFD60A',
  orange:   '#FF6B00',
  orangeBg: '#FFF3EB',
  green:    '#26A541',
  greenBg:  '#E8F8EE',
  greenBd:  '#B2DFC1',
  red:      '#F43F3F',
  redBg:    '#FFF0F0',
  bg:       '#F1F3F6',
  white:    '#FFFFFF',
  ink:      '#212121',
  sub:      '#535665',
  muted:    '#9E9E9E',
  border:   '#E0E0E0',
};

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct]         = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [wishlisted, setWishlisted]   = useState(false);
  const [addedBounce, setAddedBounce] = useState(false);

  useEffect(() => {
    fetch(`https://instaware-prototype.onrender.com/api/products/${params.id}`)
      .then(res => res.json())
      .then(setProduct);
  }, [params.id]);

  const addToBag = (redirect) => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({
      productId: product._id,
      name:      product.name,
      price:     product.price,
      image:     product.image,
      shopId:    product.shopId,
      size:      selectedSize,
      quantity:  1,
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    if (redirect) {
      router.push('/cart');
    } else {
      setAddedBounce(true);
      setTimeout(() => setAddedBounce(false), 600);
      alert('Added to Bag!');
    }
  };

  /* ── Loading state ── */
  if (!product) return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, fontFamily: "'Segoe UI','Helvetica Neue',sans-serif" }}>
      <style>{`@keyframes spin { to { transform:rotate(360deg) } }`}</style>
      <div style={{ width: 44, height: 44, border: `4px solid ${T.brandLt}`, borderTopColor: T.brand, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ fontSize: 14, fontWeight: 700, color: T.sub }}>Loading product…</p>
    </div>
  );

  /* ── Derived values ── */
  const discountPct   = 20;
  const originalPrice = Math.round(product.price * 100 / (100 - discountPct));
  const savings       = originalPrice - product.price;
  const rating        = 4.3;
  const reviewCount   = 1284;

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: "'Segoe UI','Helvetica Neue',sans-serif", color: T.ink, paddingBottom: 88 }}>
      <style>{`
        @keyframes spin      { to { transform:rotate(360deg) } }
        @keyframes fadeIn    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 4px 20px rgba(40,116,240,0.45)} 50%{box-shadow:0 4px 36px rgba(40,116,240,0.8)} }
        @keyframes bounce    { 0%,100%{transform:scale(1)} 50%{transform:scale(0.93)} }
        .page-body   { animation: fadeIn 0.3s ease both; }
        .size-btn    { transition: all 0.12s ease; }
        .size-btn:hover { border-color: ${T.brand} !important; color: ${T.brand} !important; }
        .add-btn     { animation: pulseGlow 2.2s ease-in-out infinite; transition: all 0.15s ease; }
        .add-btn:active { transform: scale(0.96); animation: none; }
        .buy-btn     { transition: all 0.15s ease; }
        .buy-btn:hover  { filter: brightness(1.07); }
        .buy-btn:active { transform: scale(0.96); }
        .wish-btn    { transition: all 0.15s ease; }
        .wish-btn:active { transform: scale(0.85); }
        .trust-pill  { transition: transform 0.15s; }
        .trust-pill:hover { transform: translateY(-2px); }
        .bouncing    { animation: bounce 0.3s ease; }
      `}</style>

      {/* ══ STICKY HEADER ══ */}
      <div style={{
        background: `linear-gradient(135deg, ${T.brandDk} 0%, ${T.brand} 100%)`,
        boxShadow: '0 2px 10px rgba(40,116,240,0.4)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        {/* Promo strip */}
        <div style={{ background: T.yellow, color: T.brandDk, textAlign: 'center', padding: '3px 12px', fontSize: 11, fontWeight: 900, letterSpacing: '0.06em' }}>
          ⚡ FREE Delivery on orders ₹499+ &nbsp;·&nbsp; <span style={{ textDecoration: 'underline' }}>INSTA20</span> → 20% off
        </div>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 12px', height: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => router.back()} style={{ background: 'rgba(255,255,255,0.14)', border: 'none', borderRadius: 8, padding: '7px 9px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={20} />
          </button>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 16, letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: 3 }}>
            <span style={{ color: T.yellow }}>⚡</span>Insta<span style={{ color: T.yellow }}>ware</span>
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              className="wish-btn"
              onClick={() => setWishlisted(w => !w)}
              style={{ background: 'rgba(255,255,255,0.14)', border: 'none', borderRadius: 8, padding: '7px 9px', cursor: 'pointer', color: wishlisted ? '#FF6B6B' : '#fff', display: 'flex', alignItems: 'center' }}
            >
              <Heart size={20} fill={wishlisted ? '#FF6B6B' : 'none'} />
            </button>
            <button onClick={() => router.push('/cart')} style={{ background: 'rgba(255,255,255,0.14)', border: 'none', borderRadius: 8, padding: '7px 9px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', position: 'relative' }}>
              <ShoppingBag size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ══ TWO-COLUMN LAYOUT (stacked on mobile, side-by-side on desktop) ══ */}
      <div className="page-body" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 0 }} className="product-layout">
          <style>{`
            @media (min-width: 768px) {
              .product-layout { grid-template-columns: 1fr 1fr !important; gap: 24px !important; padding: 20px 20px 0 !important; }
            }
          `}</style>

          {/* ══ LEFT: IMAGE PANEL ══ */}
          <div>
            {/* Main image */}
            <div style={{ background: '#F9FAFF', position: 'relative', overflow: 'hidden', aspectRatio: '1' }}>
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', transition: 'transform 0.5s ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />

              {/* Discount badge – top-left */}
              <div style={{ position: 'absolute', top: 0, left: 0, background: T.red, color: '#fff', fontSize: 11, fontWeight: 900, padding: '5px 10px', borderBottomRightRadius: 10, letterSpacing: '0.04em' }}>
                {discountPct}% OFF
              </div>

              {/* In Stock – top-right */}
              <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 4, background: T.greenBg, border: `1px solid ${T.greenBd}`, borderRadius: 20, padding: '3px 9px', fontSize: 10, fontWeight: 900, color: T.green }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.green, display: 'inline-block' }} />
                In Stock
              </div>
            </div>

            {/* Below-image trust strip – desktop only */}
            <div style={{ display: 'none' }} className="desktop-trust">
              <style>{`.desktop-trust { display: flex !important; gap: 8px; padding: 12px 0; flex-wrap: wrap; }`}
                {`@media(max-width:767px){ .desktop-trust { display:none !important; } }`}
              </style>
              {[
                { icon: '🔒', text: 'Secure Payment'  },
                { icon: '↩️', text: '7-Day Return'    },
                { icon: '⭐', text: '100% Genuine'    },
              ].map(b => (
                <div key={b.text} className="trust-pill" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, background: T.white, border: `1px solid ${T.border}`, borderRadius: 9, padding: '7px 10px', fontSize: 11, fontWeight: 700, color: T.sub, minWidth: 100 }}>
                  <span style={{ fontSize: 16 }}>{b.icon}</span>{b.text}
                </div>
              ))}
            </div>
          </div>

          {/* ══ RIGHT: DETAILS PANEL ══ */}
          <div style={{ padding: '14px 12px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Brand + name */}
            <div>
              <p style={{ fontSize: 10, fontWeight: 900, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 4px' }}>
                {product.brand || 'Instawear'}
              </p>
              <h1 style={{ fontSize: 'clamp(18px,4vw,26px)', fontWeight: 900, color: T.ink, margin: '0 0 8px', lineHeight: 1.25, letterSpacing: '-0.3px' }}>
                {product.name}
              </h1>

              {/* Rating row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: T.green, color: '#fff', fontSize: 12, fontWeight: 900, padding: '3px 8px', borderRadius: 6 }}>
                  <Star size={11} fill="#fff" /> {rating}
                </div>
                <span style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>
                  {reviewCount.toLocaleString('en-IN')} ratings
                </span>
                <span style={{ fontSize: 11, fontWeight: 900, color: T.brand, background: T.brandLt, padding: '2px 8px', borderRadius: 20 }}>
                  Flipkart Assured ✓
                </span>
              </div>
            </div>

            {/* Pricing card */}
            <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 10, padding: '12px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              {/* Special price label */}
              <p style={{ fontSize: 10, fontWeight: 900, color: T.green, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 5px', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Tag size={11} /> Special Price
              </p>
              {/* Price row */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                <span style={{ fontSize: 30, fontWeight: 900, color: T.ink, letterSpacing: '-1px', lineHeight: 1 }}>
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: 15, fontWeight: 600, color: T.muted, textDecoration: 'line-through' }}>
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: 14, fontWeight: 900, color: T.red }}>
                  {discountPct}% off
                </span>
              </div>
              {/* Savings notice */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: T.greenBg, borderRadius: 6, padding: '5px 10px', marginTop: 6 }}>
                <Zap size={12} color={T.green} />
                <span style={{ fontSize: 12, fontWeight: 800, color: T.green }}>
                  You save ₹{savings.toLocaleString('en-IN')} on this order!
                </span>
              </div>
            </div>

            {/* Delivery info card */}
            <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 10, padding: '10px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              {[
                { icon: <Truck size={15} color={T.brand} />,      text: 'Free delivery on this order',   sub: 'Arrives in 2–4 business days' },
                { icon: <RotateCcw size={15} color={T.orange} />, text: '7-day easy return & exchange',  sub: 'No questions asked returns'     },
                { icon: <ShieldCheck size={15} color={T.green} />, text: '100% Genuine Product',          sub: 'Verified by Instawear'          },
              ].map((row, i) => (
                <div key={row.text}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {row.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 800, color: T.ink, margin: 0 }}>{row.text}</p>
                      <p style={{ fontSize: 10, color: T.muted, margin: 0, fontWeight: 600 }}>{row.sub}</p>
                    </div>
                    <ChevronRight size={14} color={T.muted} style={{ marginLeft: 'auto', flexShrink: 0 }} />
                  </div>
                  {i < 2 && <div style={{ borderTop: `1px dashed ${T.border}` }} />}
                </div>
              ))}
            </div>

            {/* Size selector */}
            <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 10, padding: '12px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <p style={{ fontSize: 13, fontWeight: 900, color: T.ink, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Select Size
                </p>
                <span style={{ fontSize: 11, fontWeight: 900, color: T.brand, cursor: 'pointer', background: T.brandLt, padding: '3px 8px', borderRadius: 20 }}>
                  Size Guide
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {SIZES.map(s => (
                  <button
                    key={s}
                    className="size-btn"
                    onClick={() => setSelectedSize(s)}
                    style={{
                      width: 44, height: 44, borderRadius: 8, border: `2px solid ${selectedSize === s ? T.brand : T.border}`,
                      background: selectedSize === s ? T.brandLt : T.white,
                      color:      selectedSize === s ? T.brand   : T.sub,
                      fontWeight: 900, fontSize: 13, cursor: 'pointer',
                      boxShadow:  selectedSize === s ? `0 2px 10px rgba(40,116,240,0.25)` : 'none',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 10, padding: '12px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                <p style={{ fontSize: 13, fontWeight: 900, color: T.ink, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Product Details
                </p>
                <p style={{ fontSize: 13, color: T.sub, lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
                  {product.description}
                </p>
              </div>
            )}

            {/* Mobile-only: trust pills */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingBottom: 4 }} className="mobile-trust">
              <style>{`@media(min-width:768px){ .mobile-trust { display:none !important; } }`}</style>
              {[
                { icon: '🔒', text: 'Secure Pay'    },
                { icon: '↩️', text: '7-Day Return'  },
                { icon: '⭐', text: '100% Genuine'  },
              ].map(b => (
                <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 5, background: T.white, border: `1px solid ${T.border}`, borderRadius: 20, padding: '5px 10px', fontSize: 11, fontWeight: 700, color: T.sub }}>
                  <span>{b.icon}</span>{b.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          STICKY BOTTOM ACTION BAR
      ══════════════════════════════════════════ */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 50,
        background: T.white,
        boxShadow: '0 -6px 24px rgba(0,0,0,0.12)',
        borderTop: `1px solid ${T.border}`,
      }}>
        {/* Rainbow top strip */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${T.brand} 0%, #7C3AED 35%, ${T.orange} 65%, ${T.yellow} 100%)` }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '10px 12px', display: 'flex', gap: 10 }}>
          {/* Add to Bag */}
          <button
            className={`add-btn${addedBounce ? ' bouncing' : ''}`}
            onClick={() => addToBag(false)}
            style={{
              flex: 1, border: `2px solid ${T.brand}`, borderRadius: 10, padding: '13px 10px',
              background: T.brandLt, color: T.brand, fontWeight: 900, fontSize: 14,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              letterSpacing: '0.02em',
            }}
          >
            <ShoppingBag size={18} />
            Add to Bag
          </button>

          {/* Buy Now */}
          <button
            className="buy-btn"
            onClick={() => addToBag(true)}
            style={{
              flex: 1, border: 'none', borderRadius: 10, padding: '13px 10px',
              background: `linear-gradient(90deg, ${T.orange} 0%, #FF8C00 100%)`,
              color: '#fff', fontWeight: 900, fontSize: 14,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              boxShadow: '0 4px 18px rgba(255,107,0,0.42)', letterSpacing: '0.02em',
            }}
          >
            <Zap size={16} fill="#fff" />
            Buy Now
          </button>
        </div>

        {/* Micro-trust note */}
        <p style={{ textAlign: 'center', fontSize: 10, color: T.muted, margin: '0 0 6px', fontWeight: 600 }}>
          🔒 Safe & Secure Checkout · COD Available · 7-Day Returns
        </p>
      </div>

    </div>
  );
}