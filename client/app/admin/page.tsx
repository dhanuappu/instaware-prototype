'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Package, Upload, X, LogOut, Truck, CheckCircle, LayoutDashboard, ShoppingBag, BarChart2, Zap, TrendingUp, Clock, AlertCircle, ChevronRight, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  purple:   '#7C3AED',
  purpleBg: '#F3EEFF',
  red:      '#F43F3F',
  redBg:    '#FFF0F0',
  bg:       '#F1F3F6',
  white:    '#FFFFFF',
  ink:      '#212121',
  sub:      '#535665',
  muted:    '#9E9E9E',
  border:   '#E0E0E0',
};

/* Status badge config */
const STATUS = {
  'Delivered':         { bg: T.greenBg,  text: T.green,  border: T.greenBd                    },
  'Out for Delivery':  { bg: T.purpleBg, text: T.purple, border: 'rgba(124,58,237,.3)'         },
  'Packed':            { bg: T.brandLt,  text: T.brand,  border: 'rgba(40,116,240,.3)'         },
  'Pending':           { bg: T.orangeBg, text: T.orange, border: 'rgba(255,107,0,.3)'          },
  'Rider Assigned':    { bg: T.greenBg,  text: T.green,  border: T.greenBd                    },
};
const getStatus = (s) => STATUS[s] || STATUS['Pending'];

export default function AdminPage() {
  const router   = useRouter();
  const [activeTab, setActiveTab] = useState('orders');
  const [products, setProducts]   = useState([]);
  const [orders, setOrders]       = useState([]);
  const [form, setForm]           = useState({ name: '', price: '', image: '' });
  const [shopId, setShopId]       = useState('');
  const [shopName, setShopName]   = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const id   = localStorage.getItem('shopId');
    const name = localStorage.getItem('shopName') || 'Your Store';
    if (!id) router.push('/login');
    setShopId(id);
    setShopName(name);
    fetch('https://instaware-prototype.onrender.com/api/products').then(r => r.json()).then(setProducts);
    fetch(`https://instaware-prototype.onrender.com/api/orders/shop/${id}`).then(r => r.json()).then(setOrders);
  }, []);

  const handleShipOrder = async (orderId) => {
    alert('Request sent to Delivery Partner (Shadowfax)!');
    setOrders(orders.map(o => o._id === orderId ? { ...o, status: 'Out for Delivery' } : o));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await fetch('https://instaware-prototype.onrender.com/api/products', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ...form, shopId }),
    });
    window.location.reload();
  };

  const handleImage = (e) => {
    const reader = new FileReader();
    reader.onload = () => setForm({ ...form, image: reader.result });
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `https://instaware-prototype.onrender.com/api/products/${productId}`,
        {
          method:  'DELETE',
          headers: {
            'Content-Type':  'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
        }
      );

      if (res.ok) {
        // Instantly remove from UI without a page reload
        setProducts(prev => prev.filter(p => p._id !== productId));
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.message || 'Failed to delete product. Please try again.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Something went wrong while deleting.');
    }
  };

  /* Derived metrics */
  const totalRevenue   = orders.reduce((s, o) => s + Number(o.totalAmount || 0), 0);
  const pendingOrders  = orders.filter(o => !o.status || o.status === 'Pending').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;

  const TABS = [
    { key: 'orders',    label: 'Orders',    icon: ShoppingBag,      count: orders.length   },
    { key: 'inventory', label: 'Inventory', icon: Package,          count: products.length },
  ];

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: "'Segoe UI','Helvetica Neue',sans-serif", color: T.ink }}>
      <style>{`
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .page-body { animation: fadeUp 0.3s ease both; }
        .input-wrap:focus-within { border-color: ${T.brand} !important; box-shadow: 0 0 0 3px rgba(40,116,240,0.14) !important; background: ${T.white} !important; }
        .input-wrap:focus-within .field-icon { color: ${T.brand} !important; }
        .dash-input { outline: none; border: none; background: transparent; width: 100%; font-size: 14px; font-weight: 600; color: ${T.ink}; }
        .dash-input::placeholder { color: ${T.muted}; font-weight: 500; }
        .tab-btn    { transition: all 0.15s ease; }
        .order-row  { transition: background 0.1s ease; }
        .order-row:hover { background: #f7f9ff !important; }
        .prod-row   { transition: background 0.1s ease; }
        .prod-row:hover { background: #f7f9ff !important; }
        .ship-btn:hover  { filter: brightness(1.06); }
        .ship-btn:active { transform: scale(0.97); }
        .pub-btn:hover   { filter: brightness(1.08); }
        .pub-btn:active  { transform: scale(0.97); }
        .stat-card:hover { box-shadow: 0 4px 20px rgba(40,116,240,0.13) !important; transform: translateY(-1px); }
        .stat-card { transition: all 0.2s ease; }
      `}</style>

      {/* ══ TOP NAV ══ */}
      <nav style={{ background: T.white, borderBottom: `1px solid ${T.border}`, boxShadow: '0 1px 6px rgba(0,0,0,0.07)', position: 'sticky', top: 0, zIndex: 50 }}>
        {/* Yellow promo strip */}
        <div style={{ background: T.yellow, color: T.brandDk, textAlign: 'center', padding: '3px 12px', fontSize: 11, fontWeight: 900, letterSpacing: '0.06em' }}>
          ⚡ Instaware Vendor Dashboard &nbsp;·&nbsp; Powered by Instaware Partner Hub
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          {/* Left: Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, background: T.brand, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={19} color="#fff" fill="#fff" />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 900, color: T.ink, margin: 0, letterSpacing: '-0.3px' }}>
                Instaware <span style={{ color: T.brand }}>Vendor Hub</span>
              </p>
              <p style={{ fontSize: 10, color: T.muted, margin: 0, fontWeight: 600 }}>{shopName}</p>
            </div>
          </div>

          {/* Right: actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => window.location.reload()}
              style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: T.sub, display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700 }}
            >
              <RefreshCw size={14} /> Refresh
            </button>
            <button
              onClick={() => { localStorage.clear(); router.push('/login'); }}
              style={{ background: T.redBg, border: `1px solid rgba(244,63,63,0.2)`, borderRadius: 8, padding: '6px 12px', cursor: 'pointer', color: T.red, display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 800 }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="page-body" style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 12px 40px' }}>

        {/* ══ STAT CARDS ══ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 18 }} className="stats-grid">
          <style>{`@media(min-width:640px){ .stats-grid{ grid-template-columns: repeat(4, 1fr) !important; } }`}</style>

          {[
            { icon: ShoppingBag, color: T.brand,  bg: T.brandLt,  label: 'Total Orders',    value: orders.length,                           sub: 'All time'            },
            { icon: AlertCircle, color: T.orange, bg: T.orangeBg, label: 'Pending',          value: pendingOrders,                           sub: 'Needs action'        },
            { icon: CheckCircle, color: T.green,  bg: T.greenBg,  label: 'Delivered',        value: deliveredCount,                          sub: 'Completed'           },
            { icon: TrendingUp,  color: T.purple, bg: T.purpleBg, label: 'Revenue',          value: `₹${totalRevenue.toLocaleString('en-IN')}`, sub: 'Total earned'     },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="stat-card"
                style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, padding: '14px 14px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <p style={{ fontSize: 10, fontWeight: 900, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{s.label}</p>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={15} color={s.color} />
                  </div>
                </div>
                <p style={{ fontSize: 26, fontWeight: 900, color: T.ink, margin: '0 0 2px', letterSpacing: '-0.5px', lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 10, color: T.muted, margin: 0, fontWeight: 600 }}>{s.sub}</p>
              </div>
            );
          })}
        </div>

        {/* ══ TAB BAR ══ */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {TABS.map(tab => {
            const Icon   = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                className="tab-btn"
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: active ? T.brand : T.white,
                  color:      active ? '#fff'   : T.sub,
                  fontWeight: 800, fontSize: 13,
                  boxShadow:  active ? '0 3px 12px rgba(40,116,240,0.3)' : `0 1px 4px rgba(0,0,0,0.07)`,
                  border: active ? 'none' : `1px solid ${T.border}`,
                }}
              >
                <Icon size={15} />
                {tab.label}
                <span style={{
                  fontSize: 10, fontWeight: 900, padding: '1px 7px', borderRadius: 20,
                  background: active ? 'rgba(255,255,255,0.25)' : T.bg,
                  color:      active ? '#fff' : T.muted,
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ══════════════════════════════════════
            INVENTORY TAB
        ══════════════════════════════════════ */}
        {activeTab === 'inventory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Add Product Form */}
            <div style={{ background: T.white, borderRadius: 14, border: `1px solid ${T.border}`, boxShadow: '0 1px 8px rgba(0,0,0,0.07)', padding: '18px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, background: T.brandLt, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={17} color={T.brand} />
                </div>
                <div>
                  <h2 style={{ fontSize: 15, fontWeight: 900, color: T.ink, margin: 0 }}>Add New Product</h2>
                  <p style={{ fontSize: 11, color: T.muted, margin: 0, fontWeight: 600 }}>Fill in details and upload an image to publish</p>
                </div>
              </div>

              <form onSubmit={handleAdd}>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  {/* Image upload */}
                  <div style={{ position: 'relative', width: 88, height: 88, borderRadius: 12, border: `2px dashed ${form.image ? T.green : T.border}`, background: form.image ? T.greenBg : T.bg, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', transition: 'all 0.15s' }}>
                    {form.image
                      ? <img src={form.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                          <Upload size={20} color={T.muted} />
                          <span style={{ fontSize: 9, fontWeight: 700, color: T.muted, textAlign: 'center', lineHeight: 1.3 }}>Upload Image</span>
                        </div>
                    }
                    <input type="file" accept="image/*" onChange={handleImage} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                    {form.image && (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, image: '' })}
                        style={{ position: 'absolute', top: 3, right: 3, background: T.red, border: 'none', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <X size={10} color="#fff" />
                      </button>
                    )}
                  </div>

                  {/* Fields */}
                  <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 800, color: T.sub, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }}>Product Name</label>
                      <div className="input-wrap" style={{ display: 'flex', alignItems: 'center', background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: 9, padding: '9px 12px', gap: 8, transition: 'all 0.15s' }}>
                        <Package size={15} color={T.muted} className="field-icon" style={{ flexShrink: 0, transition: 'color 0.15s' }} />
                        <input className="dash-input" placeholder="e.g., Nike Air Max 90" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 800, color: T.sub, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }}>Price (₹)</label>
                      <div className="input-wrap" style={{ display: 'flex', alignItems: 'center', background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: 9, padding: '9px 12px', gap: 8, transition: 'all 0.15s' }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: T.muted, flexShrink: 0 }}>₹</span>
                        <input className="dash-input" type="number" placeholder="0.00" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                      </div>
                    </div>
                  </div>

                  {/* Publish button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="pub-btn"
                    style={{
                      background: submitting ? '#9BB8F0' : `linear-gradient(135deg, ${T.brandDk}, ${T.brand})`,
                      color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px',
                      fontWeight: 900, fontSize: 13, cursor: submitting ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', gap: 6, alignSelf: 'flex-end',
                      transition: 'all 0.15s', boxShadow: '0 3px 12px rgba(40,116,240,0.3)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {submitting
                      ? <><span style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />Publishing…</>
                      : <><Plus size={15} /> Publish Product</>
                    }
                  </button>
                </div>
              </form>
            </div>

            {/* Products table */}
            <div style={{ background: T.white, borderRadius: 14, border: `1px solid ${T.border}`, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              {/* Table header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: `1px solid ${T.border}`, background: T.bg }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 900, color: T.ink, margin: 0 }}>Your Products</p>
                  <p style={{ fontSize: 11, color: T.muted, margin: 0, fontWeight: 600 }}>{products.length} items listed</p>
                </div>
                <span style={{ fontSize: 10, fontWeight: 900, background: T.brandLt, color: T.brand, padding: '3px 10px', borderRadius: 20 }}>
                  {products.length} Active
                </span>
              </div>

              {/* Column labels */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 80px', padding: '8px 16px', background: '#FAFAFA', borderBottom: `1px solid ${T.border}` }}>
                {['Image', 'Product', 'Price', ''].map(h => (
                  <span key={h} style={{ fontSize: 10, fontWeight: 800, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</span>
                ))}
              </div>

              {/* Rows */}
              <div style={{ overflowX: 'auto' }}>
                {products.map((p, i) => (
                  <div key={p._id} className="prod-row" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 80px', alignItems: 'center', padding: '10px 16px', borderBottom: i < products.length - 1 ? `1px solid ${T.border}` : 'none', background: T.white }}>
                    <div style={{ width: 44, height: 44, borderRadius: 8, background: T.bg, border: `1px solid ${T.border}`, overflow: 'hidden' }}>
                      <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <div style={{ paddingRight: 8 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: T.ink, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                      <span style={{ fontSize: 10, fontWeight: 900, background: T.greenBg, color: T.green, padding: '2px 8px', borderRadius: 20 }}>Active</span>
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 900, color: T.ink, margin: 0 }}>₹{Number(p.price).toLocaleString('en-IN')}</p>
                    <button
                      onClick={() => handleDelete(p._id)}
                      style={{ background: T.redBg, border: `1px solid rgba(244,63,63,0.2)`, borderRadius: 7, padding: '5px 10px', fontSize: 11, fontWeight: 800, color: T.red, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.12s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FFD5D5'}
                      onMouseLeave={e => e.currentTarget.style.background = T.redBg}
                    >
                      <Trash2 size={12} /> Del
                    </button>
                  </div>
                ))}

                {products.length === 0 && (
                  <div style={{ padding: '36px 20px', textAlign: 'center' }}>
                    <Package size={36} color={T.muted} style={{ margin: '0 auto 10px' }} />
                    <p style={{ fontSize: 14, fontWeight: 700, color: T.sub, margin: '0 0 4px' }}>No products yet</p>
                    <p style={{ fontSize: 12, color: T.muted, margin: 0 }}>Add your first product above to start selling</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            ORDERS TAB
        ══════════════════════════════════════ */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

            {orders.length === 0 ? (
              <div style={{ background: T.white, borderRadius: 14, border: `1px solid ${T.border}`, padding: '48px 24px', textAlign: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                <ShoppingBag size={42} color={T.muted} style={{ margin: '0 auto 12px' }} />
                <p style={{ fontSize: 16, fontWeight: 800, color: T.sub, margin: '0 0 4px' }}>No orders yet</p>
                <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>When customers order from your shop, they'll appear here.</p>
              </div>
            ) : orders.map((o, cardIdx) => {
              const st = getStatus(o.status || 'Pending');
              return (
                <div key={o._id} style={{ background: T.white, borderRadius: 14, border: `1px solid ${T.border}`, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                  {/* Colour accent top stripe */}
                  <div style={{ height: 3, background: `linear-gradient(90deg, ${st.text}, ${st.text}55)` }} />

                  <div style={{ padding: '14px 16px' }}>

                    {/* ── Order header row ── */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                          <p style={{ fontSize: 15, fontWeight: 900, color: T.ink, margin: 0 }}>{o.customerName}</p>
                          {/* Status badge */}
                          <span style={{ fontSize: 10, fontWeight: 900, background: st.bg, color: st.text, border: `1.5px solid ${st.border}`, padding: '2px 9px', borderRadius: 20, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: st.text, display: 'inline-block' }} />
                            {o.status || 'Pending'}
                          </span>
                        </div>
                        <p style={{ fontSize: 11, color: T.muted, margin: '0 0 2px', fontWeight: 600 }}>📞 {o.mobile}</p>
                        <p style={{ fontSize: 11, color: T.muted, margin: 0, fontWeight: 600, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>📍 {o.address}</p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: 22, fontWeight: 900, color: T.green, margin: '0 0 2px', letterSpacing: '-0.5px' }}>₹{Number(o.totalAmount).toLocaleString('en-IN')}</p>
                        <p style={{ fontSize: 10, color: T.muted, margin: 0, fontFamily: 'monospace', fontWeight: 700 }}>#{o._id?.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>

                    {/* ── Items list ── */}
                    <div style={{ background: T.bg, borderRadius: 9, padding: '10px 12px', marginBottom: 12, border: `1px solid ${T.border}` }}>
                      <p style={{ fontSize: 10, fontWeight: 900, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 7px' }}>Order Items</p>
                      {o.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: idx < o.items.length - 1 ? `1px dashed ${T.border}` : 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {item.image && (
                              <div style={{ width: 32, height: 32, borderRadius: 6, background: T.white, border: `1px solid ${T.border}`, overflow: 'hidden', flexShrink: 0 }}>
                                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                              </div>
                            )}
                            <span style={{ fontSize: 12, fontWeight: 700, color: T.sub }}>{item.name || item.productName}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 10, fontWeight: 900, background: T.brandLt, color: T.brand, padding: '2px 7px', borderRadius: 20 }}>×{item.quantity || 1}</span>
                            <span style={{ fontSize: 13, fontWeight: 900, color: T.ink }}>₹{Number(item.price).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* ── Action buttons ── */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {o.status !== 'Out for Delivery' && o.status !== 'Delivered' ? (
                        <button
                          className="ship-btn"
                          onClick={() => handleShipOrder(o._id)}
                          style={{
                            flex: 1, minWidth: 160,
                            background: `linear-gradient(90deg, ${T.brandDk}, ${T.brand})`,
                            color: '#fff', border: 'none', borderRadius: 9, padding: '10px 16px',
                            fontWeight: 900, fontSize: 13, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                            boxShadow: '0 3px 12px rgba(40,116,240,0.3)', transition: 'all 0.15s',
                          }}
                        >
                          <Truck size={15} /> Request Shadowfax Pickup
                        </button>
                      ) : (
                        <button disabled style={{ flex: 1, minWidth: 160, background: T.greenBg, border: `1px solid ${T.greenBd}`, borderRadius: 9, padding: '10px 16px', fontWeight: 900, fontSize: 13, color: T.green, cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                          <CheckCircle size={15} /> Rider Assigned
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
