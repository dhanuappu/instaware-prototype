'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, MapPin, User, Lock, Smartphone, ArrowRight, CheckCircle, TrendingUp, Package, Zap, ShieldCheck, Star, ChevronDown } from 'lucide-react';

/* ── Design tokens ── */
const T = {
  brand:    '#2874F0',
  brandDk:  '#1a5dc8',
  brandLt:  '#EBF2FF',
  yellow:   '#FFD60A',
  orange:   '#FF6B00',
  green:    '#26A541',
  greenBg:  '#E8F8EE',
  greenBd:  '#B2DFC1',
  bg:       '#F1F3F6',
  white:    '#FFFFFF',
  ink:      '#212121',
  sub:      '#535665',
  muted:    '#9E9E9E',
  border:   '#E0E0E0',
};

const PERKS = [
  { icon: TrendingUp, color: T.brand,  bg: T.brandLt,  title: 'Grow Sales',        sub: 'Reach 10,000+ local customers instantly'  },
  { icon: Package,    color: T.green,  bg: T.greenBg,  title: 'Easy Inventory',     sub: 'List & manage products in minutes'         },
  { icon: Zap,        color: T.orange, bg: '#FFF3EB',  title: 'Fast Payouts',       sub: 'Weekly direct bank transfers guaranteed'   },
  { icon: ShieldCheck,color: T.brand,  bg: T.brandLt,  title: 'Zero Setup Cost',    sub: 'Free forever — no hidden charges'          },
];

const TESTIMONIALS = [
  { name: 'Rahul Sharma', shop: 'Trends KR Puram',   rating: 5, text: 'Sales jumped 3x in just 2 months!' },
  { name: 'Priya Nair',   shop: 'Style Hub Indiranagar', rating: 5, text: 'Managing orders on my phone is super easy.' },
];

export default function PartnerRegister() {
  const router = useRouter();
  const [form, setForm] = useState({
    shopName:  '',
    ownerName: '',
    mobile:    '',
    password:  '',
    location:  'KR Puram',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('https://instaware-prototype.onrender.com/api/shops/register', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form),
    });

    if (res.ok) {
      alert('Welcome to Instawear! Your Shop is Live.');
      router.push('/admin');
    } else {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: "'Segoe UI','Helvetica Neue',sans-serif", color: T.ink }}>
      <style>{`
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseGlow{ 0%,100%{box-shadow:0 4px 20px rgba(40,116,240,0.4)} 50%{box-shadow:0 4px 36px rgba(40,116,240,0.75)} }
        .hero-section  { animation: fadeUp 0.35s ease both; }
        .form-card     { animation: fadeUp 0.4s 0.1s ease both; }
        .perks-section { animation: fadeUp 0.4s 0.15s ease both; }
        .input-wrap:focus-within .input-icon { color: ${T.brand} !important; }
        .input-wrap:focus-within { border-color: ${T.brand} !important; box-shadow: 0 0 0 3px rgba(40,116,240,0.15) !important; background: ${T.white} !important; }
        .input-field   { outline: none; border: none; background: transparent; width: 100%; font-size: 14px; font-weight: 600; color: ${T.ink}; }
        .input-field::placeholder { color: ${T.muted}; font-weight: 500; }
        .submit-btn    { animation: pulseGlow 2.4s ease-in-out infinite; transition: all 0.15s ease; }
        .submit-btn:hover  { filter: brightness(1.07); }
        .submit-btn:active { transform: scale(0.97); animation: none; }
        .perk-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(40,116,240,0.12) !important; }
        .perk-card     { transition: all 0.2s ease; }
        select.input-field { appearance: none; cursor: pointer; }
      `}</style>

      {/* ══ TOP NAV ══ */}
      <nav style={{
        background: T.white,
        borderBottom: `1px solid ${T.border}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => router.push('/')}>
            <div style={{ width: 32, height: 32, background: T.brand, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} color="#fff" fill="#fff" />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 900, color: T.ink, margin: 0, letterSpacing: '-0.3px' }}>
                Instawear <span style={{ color: T.brand }}>Partner Hub</span>
              </p>
              <p style={{ fontSize: 10, color: T.muted, margin: 0, fontWeight: 600 }}>Vendor Onboarding Portal</p>
            </div>
          </div>

          {/* Nav right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => router.push('/login')}
              style={{ background: T.brandLt, border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 800, color: T.brand, cursor: 'pointer' }}
            >
              Already a Partner? Login
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 12px' }}>

        {/* ══ HERO BANNER ══ */}
        <div
          className="hero-section"
          style={{
            background: `linear-gradient(120deg, ${T.brandDk} 0%, ${T.brand} 55%, #4A90E2 100%)`,
            borderRadius: '0 0 24px 24px',
            padding: '32px 24px 36px',
            position: 'relative', overflow: 'hidden',
            marginBottom: 0,
          }}
        >
          {/* Blobs */}
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,214,10,0.13)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -20, left: '40%', width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,107,0,0.1)', pointerEvents: 'none' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, position: 'relative', zIndex: 2, maxWidth: 700 }}>
            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: T.yellow, color: T.brandDk, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 900, letterSpacing: '0.08em', width: 'fit-content' }}>
              <Zap size={12} /> PARTNER PROGRAMME
            </div>

            <div>
              <h1 style={{ color: '#fff', fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 900, margin: '0 0 10px', lineHeight: 1.15, letterSpacing: '-0.5px' }}>
                Sell on Instawear.<br />
                <span style={{ color: T.yellow }}>Grow Your Business.</span>
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, margin: '0 0 18px', lineHeight: 1.6, maxWidth: 480, fontWeight: 500 }}>
                Join 500+ local vendors already growing their business on Instawear. Register your shop in under 3 minutes and start selling today.
              </p>

              {/* Social proof chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {[
                  { icon: '🏪', text: '500+ Shops'       },
                  { icon: '⭐', text: '4.8 Partner Rating' },
                  { icon: '💰', text: 'Weekly Payouts'    },
                  { icon: '🚀', text: 'Go Live in 3 mins' },
                ].map(c => (
                  <div key={c.text} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '5px 11px', fontSize: 11, fontWeight: 700, color: '#fff' }}>
                    <span>{c.icon}</span>{c.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══ TWO-COLUMN LAYOUT ══ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, paddingTop: 20, paddingBottom: 40 }} className="partner-layout">
          <style>{`
            @media(min-width: 768px) {
              .partner-layout { grid-template-columns: 1fr 1fr !important; align-items: start; }
            }
          `}</style>

          {/* ── LEFT: REGISTRATION FORM ── */}
          <div className="form-card" style={{ background: T.white, borderRadius: 16, border: `1px solid ${T.border}`, boxShadow: '0 2px 16px rgba(40,116,240,0.08)', padding: '24px 20px' }}>

            {/* Form header */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ width: 44, height: 44, background: T.brandLt, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Store size={22} color={T.brand} />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: T.ink, margin: '0 0 4px', letterSpacing: '-0.3px' }}>Register Your Shop</h2>
              <p style={{ fontSize: 13, color: T.muted, margin: 0, fontWeight: 500 }}>Fill in your details to go live instantly</p>
            </div>

            {/* Progress steps */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 22 }}>
              {['Shop Info', 'Owner Details', 'Go Live'].map((step, i) => (
                <React.Fragment key={step}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: i === 0 ? T.brand : T.border, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: i === 0 ? '#fff' : T.muted }}>
                      {i === 0 ? '✓' : i + 1}
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: i === 0 ? T.brand : T.muted, whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>{step}</span>
                  </div>
                  {i < 2 && <div style={{ flex: 1, height: 2, borderRadius: 2, background: i === 0 ? T.brand : T.border, marginBottom: 14 }} />}
                </React.Fragment>
              ))}
            </div>

            <form onSubmit={handleRegister}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                {/* Shop Name */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: T.sub, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 5 }}>Shop Name</label>
                  <div className="input-wrap" style={{ display: 'flex', alignItems: 'center', gap: 10, background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: '11px 13px', transition: 'all 0.15s ease' }}>
                    <Store size={17} color={T.muted} className="input-icon" style={{ flexShrink: 0, transition: 'color 0.15s' }} />
                    <input className="input-field" placeholder="e.g., Trends KR Puram" value={form.shopName} onChange={e => setForm({ ...form, shopName: e.target.value })} required />
                  </div>
                </div>

                {/* Owner Name */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: T.sub, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 5 }}>Owner Name</label>
                  <div className="input-wrap" style={{ display: 'flex', alignItems: 'center', gap: 10, background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: '11px 13px', transition: 'all 0.15s ease' }}>
                    <User size={17} color={T.muted} className="input-icon" style={{ flexShrink: 0, transition: 'color 0.15s' }} />
                    <input className="input-field" placeholder="Your full name" value={form.ownerName} onChange={e => setForm({ ...form, ownerName: e.target.value })} required />
                  </div>
                </div>

                {/* Mobile */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: T.sub, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 5 }}>Mobile Number</label>
                  <div className="input-wrap" style={{ display: 'flex', alignItems: 'center', gap: 10, background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: '11px 13px', transition: 'all 0.15s ease' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <span style={{ fontSize: 14 }}>🇮🇳</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: T.sub }}>+91</span>
                      <div style={{ width: 1, height: 16, background: T.border }} />
                    </div>
                    <input className="input-field" type="tel" placeholder="10-digit mobile number" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} required />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: T.sub, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 5 }}>Shop Location</label>
                  <div className="input-wrap" style={{ display: 'flex', alignItems: 'center', gap: 10, background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: '11px 13px', transition: 'all 0.15s ease', position: 'relative' }}>
                    <MapPin size={17} color={T.muted} className="input-icon" style={{ flexShrink: 0, transition: 'color 0.15s' }} />
                    <select className="input-field" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}>
                      {['KR Puram', 'Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'Jayanagar', 'Marathahalli'].map(loc => (
                        <option key={loc}>{loc}</option>
                      ))}
                    </select>
                    <ChevronDown size={15} color={T.muted} style={{ flexShrink: 0, pointerEvents: 'none' }} />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: T.sub, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 5 }}>Set Password</label>
                  <div className="input-wrap" style={{ display: 'flex', alignItems: 'center', gap: 10, background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: '11px 13px', transition: 'all 0.15s ease' }}>
                    <Lock size={17} color={T.muted} className="input-icon" style={{ flexShrink: 0, transition: 'color 0.15s' }} />
                    <input className="input-field" type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                  </div>
                </div>

                {/* T&C note */}
                <p style={{ fontSize: 11, color: T.muted, margin: '2px 0 4px', lineHeight: 1.5, fontWeight: 500 }}>
                  By registering, you agree to Instawear's{' '}
                  <span style={{ color: T.brand, fontWeight: 700, cursor: 'pointer' }}>Partner Terms</span> and{' '}
                  <span style={{ color: T.brand, fontWeight: 700, cursor: 'pointer' }}>Privacy Policy</span>.
                </p>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="submit-btn"
                  style={{
                    width: '100%', border: 'none', borderRadius: 10, padding: '14px',
                    background: loading ? '#9BB8F0' : `linear-gradient(90deg, ${T.brandDk} 0%, ${T.brand} 100%)`,
                    color: '#fff', fontWeight: 900, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, letterSpacing: '0.03em',
                    marginTop: 4,
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{ width: 16, height: 16, border: '2.5px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                      Registering…
                    </>
                  ) : (
                    <>Register My Shop <ArrowRight size={17} /></>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* ── RIGHT: PERKS + TESTIMONIALS ── */}
          <div className="perks-section" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Why join */}
            <div style={{ background: T.white, borderRadius: 16, border: `1px solid ${T.border}`, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', padding: '20px 18px' }}>
              <p style={{ fontSize: 11, fontWeight: 900, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 14px' }}>Why Partner with Us</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {PERKS.map(p => {
                  const Icon = p.icon;
                  return (
                    <div key={p.title} className="perk-card" style={{ background: T.bg, borderRadius: 12, padding: '14px 12px', border: `1px solid ${T.border}` }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                        <Icon size={18} color={p.color} />
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 800, color: T.ink, margin: '0 0 2px' }}>{p.title}</p>
                      <p style={{ fontSize: 11, color: T.muted, margin: 0, lineHeight: 1.4, fontWeight: 500 }}>{p.sub}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stats strip */}
            <div style={{ background: `linear-gradient(90deg, ${T.brandDk}, ${T.brand})`, borderRadius: 14, padding: '16px 18px', display: 'flex', justifyContent: 'space-around' }}>
              {[
                { num: '500+',  label: 'Partner Shops'  },
                { num: '10k+',  label: 'Monthly Orders' },
                { num: '₹2L+',  label: 'Avg Monthly GMV'},
              ].map((s, i) => (
                <div key={s.label} style={{ textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.2)' : 'none', flex: 1, padding: '0 8px' }}>
                  <p style={{ color: T.yellow, fontWeight: 900, fontSize: 20, margin: '0 0 2px', letterSpacing: '-0.5px' }}>{s.num}</p>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div style={{ background: T.white, borderRadius: 16, border: `1px solid ${T.border}`, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', padding: '18px 18px' }}>
              <p style={{ fontSize: 11, fontWeight: 900, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 12px' }}>Partner Stories</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {TESTIMONIALS.map(t => (
                  <div key={t.name} style={{ background: T.bg, borderRadius: 10, padding: '12px 14px', border: `1px solid ${T.border}` }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      {/* Avatar */}
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: T.brandLt, color: T.brand, fontWeight: 900, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {t.name[0]}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 800, color: T.ink, margin: 0 }}>{t.name}</p>
                        <p style={{ fontSize: 10, color: T.muted, margin: 0, fontWeight: 600 }}>{t.shop}</p>
                      </div>
                      {/* Stars */}
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: 1 }}>
                        {[...Array(t.rating)].map((_, i) => <Star key={i} size={11} fill={T.yellow} color={T.yellow} />)}
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: T.sub, margin: 0, lineHeight: 1.5, fontStyle: 'italic', fontWeight: 500 }}>"{t.text}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { icon: '🔒', text: 'Secure Data'      },
                { icon: '📞', text: '24/7 Support'     },
                { icon: '💳', text: 'Weekly Payouts'   },
                { icon: '🆓', text: 'Zero Commission'  },
              ].map(b => (
                <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 5, background: T.white, border: `1px solid ${T.border}`, borderRadius: 20, padding: '5px 11px', fontSize: 11, fontWeight: 700, color: T.sub }}>
                  <span>{b.icon}</span>{b.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: T.ink, borderTop: `1px solid rgba(255,255,255,0.06)`, padding: '16px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: 0, fontWeight: 600 }}>
          ⚡ Instawear Partner Hub · Made with ❤️ in India · © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}