'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, User, ArrowRight, Zap, Tag, Star, TrendingUp, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/* ─────────────────────────────────────────
   DESIGN TOKENS  –  Edit here to retheme
───────────────────────────────────────── */
const T = {
  /* Brand */
  brand:      '#2874F0',   // Flipkart blue
  brandDk:    '#1a5dc8',
  brandLt:    '#e8f0ff',

  /* Accents */
  yellow:     '#FFD60A',
  orange:     '#FF6161',   // sale / discount
  green:      '#26A541',
  greenBg:    '#E8F8EE',

  /* Neutrals */
  bg:         '#F1F3F6',   // Flipkart page grey
  white:      '#FFFFFF',
  ink:        '#212121',
  muted:      '#878787',
  border:     '#E0E0E0',

  /* Shadows */
  cardShadow: '0 1px 4px rgba(0,0,0,0.12)',
  cardHover:  '0 4px 16px rgba(40,116,240,0.18)',
};

const catMeta = {
  All:        { emoji: '🛍️', color: '#2874F0' },
  Sneakers:   { emoji: '👟', color: '#FF6B00' },
  Hoodies:    { emoji: '🧥', color: '#9C27B0' },
  Watches:    { emoji: '⌚', color: '#26A541' },
  'T-Shirts': { emoji: '👕', color: '#E91E63' },
  Pants:      { emoji: '👖', color: '#FF5722' },
  Dress:      { emoji: '👗', color: '#x1F457' },
  Sandals:    { emoji: '👡', color: '#x1F461' },
  Saree:      { emoji: '🥻', color: '#x1F97B' },

};

const DISCOUNTS = [10, 15, 20, 25, 30, 40, 50];
const BADGES    = ['Bestseller', 'Top Rated', 'New', 'Trending', 'Hot Deal', 'Limited', 'Popular'];

export default function Home() {
  const router = useRouter();
  const [products, setProducts]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [username, setUsername]             = useState(null);
  const [query, setQuery]                   = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMenuOpen, setIsMenuOpen]         = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(true);

  const categories = ['All', 'Sneakers', 'Hoodies', 'Watches', 'T-Shirts', 'Pants'];

  useEffect(() => {
    fetch('https://instaware-prototype.onrender.com/api/products')
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
    setUsername(localStorage.getItem('userName'));
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch   = p.name.toLowerCase().includes(query.toLowerCase()) ||
                            (p.brand && p.brand.toLowerCase().includes(query.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' ||
                            p.name.toLowerCase().includes(selectedCategory.toLowerCase().slice(0, -1));
    return matchesSearch && matchesCategory;
  });

  /* ── helpers ── */
  const disc  = (idx) => DISCOUNTS[idx % DISCOUNTS.length];
  const orig  = (price, idx) => Math.round(price * 100 / (100 - disc(idx)));
  const badge = (idx) => BADGES[idx % BADGES.length];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: T.bg, fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif", color: T.ink }}>

      {/* ══════════════════════════════════════════
          STICKY HEADER
      ══════════════════════════════════════════ */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: `linear-gradient(135deg, ${T.brandDk} 0%, ${T.brand} 100%)`, boxShadow: '0 2px 8px rgba(40,116,240,0.4)' }}>

        {/* Promo strip */}
        <div style={{ background: T.yellow, color: T.brandDk, textAlign: 'center', padding: '4px 12px', fontSize: '11px', fontWeight: 900, letterSpacing: '0.06em' }}>
          ⚡ FREE Delivery on orders ₹499+ &nbsp;·&nbsp; Code <span style={{ textDecoration: 'underline' }}>INSTA20</span> → 20% off &nbsp;·&nbsp; New arrivals every Monday!
        </div>

        {/* Main nav */}
        <div style={{ maxWidth: 1700, margin: '0 auto', padding: '0 12px', height: 52, display: 'flex', alignItems: 'center', gap: 10 }}>

          {/* Hamburger */}
          <button
            onClick={() => setIsMenuOpen(true)}
            style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}
          >
            <Menu size={20} />
          </button>

          {/* Wordmark */}
          <h1
            onClick={() => window.location.reload()}
            style={{ cursor: 'pointer', fontWeight: 900, fontSize: 22, color: '#fff', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: 3, userSelect: 'none', whiteSpace: 'nowrap', margin: 0 }}
          >
            <span style={{ color: T.yellow }}>⚡</span>
            Insta<span style={{ color: T.yellow }}>wear</span>
          </h1>

          {/* Search bar */}
          <div style={{ flex: 1, position: 'relative', maxWidth: 560, margin: '0 8px' }}>
            <Search size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: T.muted, pointerEvents: 'none' }} />
            <input
              style={{ width: '100%', borderRadius: 8, border: '2px solid transparent', outline: 'none', padding: '8px 12px 8px 32px', fontSize: 13, fontWeight: 600, background: 'rgba(255,255,255,0.96)', color: T.ink, boxSizing: 'border-box' }}
              placeholder="Search for products, brands and more..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          {/* Right icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
            {username ? (
              <Link href="/profile" style={{ display: 'none' }} className="md-show">
                <button style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#fff', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <User size={16} />{username.split(' ')[0]}
                </button>
              </Link>
            ) : (
              <Link href="/login">
                <button style={{ background: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', color: T.brand, fontWeight: 800, fontSize: 13 }}>
                  Login
                </button>
              </Link>
            )}
            <button
              onClick={() => router.push('/cart')}
              style={{ position: 'relative', background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <ShoppingBag size={20} />
              <span style={{ position: 'absolute', top: 2, right: 2, background: T.orange, color: '#fff', borderRadius: '50%', width: 15, height: 15, fontSize: 9, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>0</span>
            </button>
          </div>
        </div>

        {/* Category pill row */}
        <div style={{ maxWidth: 1700, margin: '0 auto', padding: '0 12px 8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          <div style={{ display: 'flex', gap: 7, width: 'max-content' }}>
            {categories.map(cat => {
              const m      = catMeta[cat] || { emoji: '🛒', color: T.brand };
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    flexShrink: 0,
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '4px 12px',
                    borderRadius: 20,
                    border: active ? `2px solid ${T.yellow}` : '2px solid rgba(255,255,255,0.2)',
                    background: active ? T.yellow : 'rgba(255,255,255,0.1)',
                    color: active ? T.brandDk : '#fff',
                    fontWeight: 800,
                    fontSize: 11,
                    cursor: 'pointer',
                    letterSpacing: '0.04em',
                    transform: active ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span>{m.emoji}</span>
                  <span style={{ textTransform: 'uppercase' }}>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          SIDEBAR MENU
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 60, backdropFilter: 'blur(3px)' }}
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.28 }}
              style={{ position: 'fixed', top: 0, left: 0, height: '100%', width: '82%', maxWidth: 310, zIndex: 70, display: 'flex', flexDirection: 'column', background: `linear-gradient(160deg, ${T.brandDk} 0%, #1e6bdb 100%)`, boxShadow: '4px 0 30px rgba(0,0,0,0.3)' }}
            >
              {/* Sidebar header */}
              <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 900, fontSize: 18, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: T.yellow }}>⚡</span>Instawear
                </span>
                <button onClick={() => setIsMenuOpen(false)} style={{ color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  <X size={22} />
                </button>
              </div>

              {/* User card */}
              {username && (
                <div style={{ margin: '14px 16px 0', padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: T.yellow, color: T.brandDk, fontWeight: 900, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {username[0].toUpperCase()}
                  </div>
                  <div>
                    <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, margin: 0 }}>{username}</p>
                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, margin: 0 }}>Premium Member</p>
                  </div>
                </div>
              )}

              {/* Nav */}
              <nav style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 0' }}>
                {[
                  { href: '/', label: 'Home', emoji: '🏠' },
                  { href: '/my-orders', label: 'My Orders', emoji: '📦' },
                  { href: '/profile', label: 'Profile', emoji: '👤' },
                ].map(item => (
                  <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10, color: 'rgba(255,255,255,0.8)', fontWeight: 700, fontSize: 14, cursor: 'pointer', marginBottom: 2 }}>
                      <span style={{ fontSize: 16 }}>{item.emoji}</span>{item.label}
                    </div>
                  </Link>
                ))}

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', marginTop: 10, paddingTop: 12 }}>
                  <p style={{ color: T.yellow, fontSize: 10, fontWeight: 900, letterSpacing: '0.28em', textTransform: 'uppercase', padding: '0 14px', marginBottom: 8 }}>
                    Categories
                  </p>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setIsMenuOpen(false); }}
                      style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, background: selectedCategory === cat ? 'rgba(255,255,255,0.14)' : 'transparent', color: selectedCategory === cat ? '#fff' : 'rgba(255,255,255,0.6)', marginBottom: 1, transition: 'background 0.15s' }}
                    >
                      <span>{catMeta[cat]?.emoji}</span>{cat}
                      {selectedCategory === cat && <span style={{ marginLeft: 'auto', background: T.yellow, color: T.brandDk, fontSize: 9, fontWeight: 900, padding: '2px 6px', borderRadius: 20 }}>✓</span>}
                    </button>
                  ))}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          HERO BANNER  –  compact, app-like
      ══════════════════════════════════════════ */}
      <section style={{ background: `linear-gradient(118deg, ${T.brand} 0%, #1565C0 55%, #0D47A1 100%)`, position: 'relative', overflow: 'hidden' }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,214,10,0.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -30, left: '30%', width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,97,97,0.12)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1700, margin: '0 auto', padding: '20px 14px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14, position: 'relative' }}>
          {/* Left: copy */}
          <div style={{ flex: '1 1 260px', minWidth: 0 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: T.yellow, color: T.brandDk, padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 900, letterSpacing: '0.08em', marginBottom: 10, textTransform: 'uppercase' }}>
              <Zap size={11} /> New Season Arrivals
            </div>
            <h2 style={{ color: '#fff', fontSize: 'clamp(22px, 4vw, 42px)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 8px', letterSpacing: '-0.5px' }}>
              Discover <span style={{ color: T.yellow }}>Premium</span> Products.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: '0 0 14px', lineHeight: 1.5, maxWidth: 320 }}>
              Top brands · Lightning delivery · Best prices — guaranteed.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <button
                onClick={() => document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: T.yellow, color: T.brandDk, border: 'none', borderRadius: 8, padding: '9px 20px', fontWeight: 900, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 18px rgba(255,214,10,0.45)', letterSpacing: '0.02em' }}
              >
                Shop Now <ArrowRight size={15} />
              </button>
              <button
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.35)', borderRadius: 8, padding: '9px 20px', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}
              >
                View Deals <Tag size={14} />
              </button>
            </div>
          </div>

          {/* Right: stat pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { icon: '🛍️', num: '500+', label: 'Products' },
              { icon: '🏷️', num: '50+',  label: 'Brands'   },
              { icon: '😊', num: '10k+', label: 'Customers' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', minWidth: 70 }}>
                <div style={{ fontSize: 18, lineHeight: 1 }}>{s.icon}</div>
                <div style={{ color: T.yellow, fontWeight: 900, fontSize: 16, lineHeight: 1.2 }}>{s.num}</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom wave */}
        <svg viewBox="0 0 1440 28" style={{ display: 'block', width: '100%', marginBottom: -2 }} preserveAspectRatio="none">
          <path d="M0,14 C360,32 1080,-4 1440,14 L1440,28 L0,28 Z" fill={T.bg} />
        </svg>
      </section>

      {/* ══════════════════════════════════════════
          PRODUCT SECTION
      ══════════════════════════════════════════ */}
      <main id="product-grid" style={{ maxWidth: 1700, margin: '0 auto', padding: '10px 8px 40px' }}>

        {/* Section label row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: '0 2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 4, height: 20, borderRadius: 4, background: `linear-gradient(to bottom, ${T.brand}, ${T.orange})` }} />
            <div>
              <p style={{ fontSize: 9, fontWeight: 900, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, lineHeight: 1 }}>Now Showing</p>
              <h3 style={{ fontSize: 15, fontWeight: 900, color: T.ink, margin: 0, lineHeight: 1.2 }}>{selectedCategory} Collection</h3>
            </div>
          </div>
          <span style={{ background: T.brandLt, color: T.brand, fontWeight: 900, fontSize: 11, padding: '3px 10px', borderRadius: 20 }}>
            {filteredProducts.length} items
          </span>
        </div>

        {/* ── SKELETON ── */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}
               className="sm-grid-4 md-grid-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} style={{ background: T.white, borderRadius: 8, overflow: 'hidden', border: `1px solid ${T.border}` }}>
                <div style={{ aspectRatio: '1', background: '#f0f0f0', animation: 'pulse 1.5s ease-in-out infinite' }} />
                <div style={{ padding: 8 }}>
                  {[60, 90, 45].map((w, j) => (
                    <div key={j} style={{ height: j === 0 ? 8 : j === 1 ? 11 : 14, width: `${w}%`, background: '#f0f0f0', borderRadius: 4, marginBottom: 5, animation: 'pulse 1.5s ease-in-out infinite' }} />
                  ))}
                  <div style={{ height: 26, background: '#f0f0f0', borderRadius: 6, marginTop: 6, animation: 'pulse 1.5s ease-in-out infinite' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ══ PRODUCT GRID ══  2-col mobile → 4 tablet → 6 desktop */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 8,
          }}
          className="product-grid"
          >
            <style>{`
              @media (min-width: 480px)  { .product-grid { grid-template-columns: repeat(3, 1fr); } }
              @media (min-width: 640px)  { .product-grid { grid-template-columns: repeat(4, 1fr); } }
              @media (min-width: 900px)  { .product-grid { grid-template-columns: repeat(5, 1fr); } }
              @media (min-width: 1100px) { .product-grid { grid-template-columns: repeat(6, 1fr); } }
              @media (min-width: 1400px) { .product-grid { grid-template-columns: repeat(7, 1fr); } }
              @keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.45 } }
              .prod-card:hover { box-shadow: 0 4px 18px rgba(40,116,240,0.18) !important; border-color: rgba(40,116,240,0.25) !important; transform: translateY(-2px); }
              .cart-btn:hover  { filter: brightness(1.1); }
              .cart-btn:active { transform: scale(0.95); }
            `}</style>

            {filteredProducts.map((product, idx) => {
              const discountPct   = disc(idx);
              const originalPrice = orig(product.price, idx);
              const badgeLabel    = badge(idx);
              const isHot         = discountPct >= 30;

              return (
                <Link
                  href={`/product/${product._id}`}
                  key={product._id}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    className="prod-card"
                    style={{
                      background: T.white,
                      borderRadius: 8,
                      border: `1px solid ${T.border}`,
                      boxShadow: T.cardShadow,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* ── IMAGE BLOCK ── */}
                    <div style={{ position: 'relative', aspectRatio: '1', background: '#f9faff', overflow: 'hidden' }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.4s ease', display: 'block' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      />

                      {/* Discount ribbon — top-left, flush corner */}
                      <div style={{
                        position: 'absolute', top: 0, left: 0,
                        background: isHot ? T.orange : T.brand,
                        color: '#fff',
                        fontSize: 9,
                        fontWeight: 900,
                        padding: '3px 7px',
                        borderBottomRightRadius: 7,
                        letterSpacing: '0.04em',
                        lineHeight: 1,
                      }}>
                        {discountPct}% OFF
                      </div>

                      {/* Badge label — top-right */}
                      <div style={{
                        position: 'absolute', top: 5, right: 5,
                        background: isHot ? '#FFF3E0' : T.brandLt,
                        color: isHot ? T.orange : T.brand,
                        fontSize: 8,
                        fontWeight: 900,
                        padding: '2px 6px',
                        borderRadius: 20,
                        letterSpacing: '0.03em',
                        lineHeight: 1.4,
                        display: 'flex', alignItems: 'center', gap: 2,
                      }}>
                        {isHot ? '🔥' : '⭐'} {badgeLabel}
                      </div>

                      {/* Bottom green in-stock pill */}
                      <div style={{
                        position: 'absolute', bottom: 5, left: '50%', transform: 'translateX(-50%)',
                        background: T.greenBg,
                        color: T.green,
                        fontSize: 8,
                        fontWeight: 900,
                        padding: '2px 8px',
                        borderRadius: 20,
                        whiteSpace: 'nowrap',
                        display: 'flex', alignItems: 'center', gap: 3,
                        letterSpacing: '0.04em',
                      }}>
                        <span style={{ width: 5, height: 5, background: T.green, borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
                        IN STOCK
                      </div>
                    </div>

                    {/* ── CARD BODY ── */}
                    <div style={{ padding: '7px 8px 8px', flex: 1, display: 'flex', flexDirection: 'column' }}>

                      {/* Brand */}
                      <p style={{ fontSize: 9, fontWeight: 900, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {product.brand || 'Instawear'}
                      </p>

                      {/* Product name — 2-line clamp */}
                      <h2
                        title={product.name}
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: T.ink,
                          margin: '0 0 5px',
                          lineHeight: 1.35,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: 32,
                          flex: 1,
                        }}
                      >
                        {product.name}
                      </h2>

                      {/* Rating strip */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 5 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: T.green, color: '#fff', fontSize: 9, fontWeight: 900, padding: '1px 5px', borderRadius: 4 }}>
                          <Star size={8} fill="#fff" />
                          {(3.8 + (idx % 12) * 0.1).toFixed(1)}
                        </div>
                        <span style={{ fontSize: 9, color: T.muted, fontWeight: 600 }}>
                          ({(200 + idx * 37).toLocaleString('en-IN')})
                        </span>
                      </div>

                      {/* Price row */}
                      <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '2px 6px', marginBottom: 7 }}>
                        <span style={{ fontSize: 15, fontWeight: 900, color: T.ink, letterSpacing: '-0.3px' }}>
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 600, color: T.muted, textDecoration: 'line-through' }}>
                          ₹{originalPrice.toLocaleString('en-IN')}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 900, color: T.green }}>
                          {discountPct}% off
                        </span>
                      </div>

                      {/* ADD TO CART – Flipkart-blue pill, full width */}
                      <button
                        className="cart-btn"
                        onClick={e => { e.preventDefault(); router.push('/cart'); }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 5,
                          padding: '7px 6px',
                          background: `linear-gradient(90deg, ${T.brand} 0%, #1a7fe8 100%)`,
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 900,
                          cursor: 'pointer',
                          letterSpacing: '0.04em',
                          boxShadow: '0 2px 10px rgba(40,116,240,0.35)',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <ShoppingBag size={12} />
                        <span>ADD TO CART</span>
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 18, fontWeight: 900, color: T.ink, margin: '0 0 6px' }}>No products found</p>
            <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>Try a different search term or category</p>
          </div>
        )}
      </main>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer style={{ background: `linear-gradient(135deg, ${T.brandDk}, #0D47A1)`, padding: '20px 16px' }}>
        <div style={{ maxWidth: 1700, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <p style={{ color: '#fff', fontWeight: 900, fontSize: 18, margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: T.yellow }}>⚡</span>Insta<span style={{ color: T.yellow }}>wear</span>
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0 }}>Premium products, delivered fast.</p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700, margin: 0 }}>© {new Date().getFullYear()} Instwear</p>
        </div>
      </footer>
    </div>
  );
}