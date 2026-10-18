import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Siren, 
  PhoneCall, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Menu, 
  X, 
  ShieldAlert,
  ChevronDown
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleDemoSelect = async (role) => {
    try {
      await loginAsDemo(role);
      setDemoMenuOpen(false);
      setMobileMenuOpen(false);
      if (role === 'patient') navigate('/patient');
      else if (role === 'driver') navigate('/driver');
      else if (role === 'admin') navigate('/admin');
    } catch (e) {
      console.error(e);
    }
  };

  const getDashboardPath = () => {
    if (user?.role === 'driver') return '/driver';
    if (user?.role === 'admin') return '/admin';
    return '/patient';
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: 'var(--bg-white)', boxShadow: 'var(--shadow-sm)' }}>
      {/* Prototype Advisory Bar */}
      <div className="prototype-alert-bar">
        <ShieldAlert size={16} />
        <span>
          <strong>Academic Prototype Notice:</strong> Not a substitute for official 108/112 services. In a life-threatening emergency, call <strong>108</strong> immediately.
        </span>
      </div>

      {/* Main Navigation */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.25rem' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: 'var(--primary-red)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: 'var(--shadow-emergency)',
            animation: 'pulse-subtle 2s infinite'
          }}>
            <Siren size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--secondary-navy)', lineHeight: 1.1 }}>
              Jeevan Raksha <span style={{ color: 'var(--primary-red)' }}>Connect</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
              VELLANGALLUR EMERGENCY DISPATCH
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
          <Link to="/" style={{ fontWeight: 600, fontSize: '0.95rem', color: location.pathname === '/' ? 'var(--primary-red)' : 'var(--secondary-navy)' }}>
            Home
          </Link>
          <a href="/#how-it-works" style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--secondary-navy)' }}>
            How It Works
          </a>
          <a href="/#services" style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--secondary-navy)' }}>
            Services
          </a>
          <Link to="/hospitals" style={{ fontWeight: 600, fontSize: '0.95rem', color: location.pathname === '/hospitals' ? 'var(--primary-red)' : 'var(--secondary-navy)' }}>
            Hospitals
          </Link>
          <Link to="/tracking" style={{ fontWeight: 600, fontSize: '0.95rem', color: location.pathname === '/tracking' ? 'var(--primary-red)' : 'var(--secondary-navy)' }}>
            Live Tracking
          </Link>
          <Link to="/about" style={{ fontWeight: 600, fontSize: '0.95rem', color: location.pathname === '/about' ? 'var(--primary-red)' : 'var(--secondary-navy)' }}>
            About
          </Link>
          <Link to="/contact" style={{ fontWeight: 600, fontSize: '0.95rem', color: location.pathname === '/contact' ? 'var(--primary-red)' : 'var(--secondary-navy)' }}>
            Contact
          </Link>
        </nav>

        {/* Action Buttons & Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Emergency Helpline Direct Button */}
          <a
            href="tel:108"
            className="btn btn-outline-red btn-sm"
            style={{ fontWeight: 700, gap: '0.4rem', borderCurve: 'round' }}
            title="Dial 108 Emergency Ambulance"
          >
            <PhoneCall size={15} />
            <span>108 Helpline</span>
          </a>

          {/* Quick Demo Switcher Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDemoMenuOpen(!demoMenuOpen)}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.82rem', padding: '0.45rem 0.75rem', gap: '0.3rem' }}
            >
              <span>Demo Roles</span>
              <ChevronDown size={14} />
            </button>

            {demoMenuOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '110%',
                backgroundColor: 'var(--bg-white)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                width: '270px',
                zIndex: 1100,
                padding: '0.5rem'
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2563EB', padding: '0.35rem 0.6rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>1-Click Demo Login</span>
                  <span style={{ fontSize: '0.68rem', color: '#64748B' }}>Pass: shown below</span>
                </div>
                <button
                  onClick={() => handleDemoSelect('driver')}
                  style={{ width: '100%', textAlign: 'left', padding: '0.55rem 0.6rem', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '6px', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', marginBottom: '0.4rem', cursor: 'pointer' }}
                >
                  <strong style={{ color: '#1E40AF' }}>🚑 Suresh Kumar (ALS Driver)</strong>
                  <span style={{ fontSize: '0.72rem', color: '#3B82F6' }}><code>suresh.driver@example.com</code></span>
                  <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Password: <code>driver123</code></span>
                </button>
                <button
                  onClick={() => handleDemoSelect('patient')}
                  style={{ width: '100%', textAlign: 'left', padding: '0.55rem 0.6rem', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '6px', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', marginBottom: '0.4rem', cursor: 'pointer' }}
                >
                  <strong style={{ color: '#991B1B' }}>👤 Rahul Menon (Patient)</strong>
                  <span style={{ fontSize: '0.72rem', color: '#EF4444' }}><code>rahul@example.com</code></span>
                  <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Password: <code>patient123</code></span>
                </button>
                <button
                  onClick={() => handleDemoSelect('admin')}
                  style={{ width: '100%', textAlign: 'left', padding: '0.55rem 0.6rem', background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: '6px', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                >
                  <strong style={{ color: '#6D28D9' }}>🛡️ Dr. Lakshmi Nair (Admin)</strong>
                  <span style={{ fontSize: '0.72rem', color: '#7C3AED' }}><code>admin@jeevanraksha.gov.in</code></span>
                  <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Password: <code>admin123</code></span>
                </button>
              </div>
            )}
          </div>

          {/* User Profile or Login */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link
                to={getDashboardPath()}
                className="btn btn-primary btn-sm"
                style={{ gap: '0.4rem' }}
              >
                <LayoutDashboard size={15} />
                <span>Dashboard ({user.role})</span>
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                title="Logout"
                style={{ padding: '0.45rem 0.65rem' }}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
              <User size={15} />
              <span>Login / Sign Up</span>
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            style={{ display: 'inline-flex', padding: '0.4rem', background: 'transparent', color: 'var(--secondary-navy)' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--bg-white)',
          borderTop: '1px solid var(--border-light)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, padding: '0.4rem 0' }}>Home</Link>
          <a href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, padding: '0.4rem 0' }}>How It Works</a>
          <a href="/#services" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, padding: '0.4rem 0' }}>Services</a>
          <Link to="/hospitals" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, padding: '0.4rem 0' }}>Nearby Hospitals</Link>
          <Link to="/tracking" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, padding: '0.4rem 0' }}>Ambulance Live Tracking</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, padding: '0.4rem 0' }}>About Project</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, padding: '0.4rem 0' }}>Contact & Help</Link>

          {isAuthenticated ? (
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Signed in as: <strong>{user.name}</strong> ({user.role})</div>
              <Link to={getDashboardPath()} onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-sm">Go to Dashboard</Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">Sign Out</button>
            </div>
          ) : (
            <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary btn-sm">Login / Register</Link>
          )}
        </div>
      )}

      {/* Responsive CSS for desktop-nav and mobile-toggle */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};
