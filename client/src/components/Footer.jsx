import React from 'react';
import { Link } from 'react-router-dom';
import { Siren, Phone, ShieldAlert, Heart, MapPin, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--secondary-navy)', color: 'white', marginTop: 'auto', borderTop: '4px solid var(--primary-red)' }}>
      {/* Top emergency strip */}
      <div style={{ backgroundColor: 'var(--secondary-navy-hover)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem 0' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--primary-red)', borderRadius: '8px' }}>
              <Phone size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>Official Emergency Ambulances (Kerala)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>Dial 108 or 112 directly for critical emergencies</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="tel:108" className="btn btn-primary btn-sm" style={{ fontWeight: 700 }}>
              Call 108 (Ambulance)
            </a>
            <a href="tel:112" className="btn btn-outline btn-sm" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
              Call 112 (Unified Police & Fire)
            </a>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '3.5rem 1.25rem 2rem' }}>
        <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
          {/* Col 1: About & Region */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '36px', height: '36px', backgroundColor: 'var(--primary-red)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Siren size={20} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                Jeevan Raksha <span style={{ color: '#F87171' }}>Connect</span>
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#CBD5E1', lineHeight: 1.6 }}>
              A smart emergency ambulance booking and dispatch platform tailored initially for Vellangallur Grama Panchayat, Kerala, India. Connecting patients with verified drivers to eliminate transit delays during the golden hour.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#94A3B8' }}>
              <MapPin size={16} color="var(--primary-red)" />
              <span>Vellangallur, Thrissur, Kerala - 680662</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontSize: '1.05rem', marginBottom: '1.25rem', borderBottom: '2px solid var(--primary-red)', paddingBottom: '0.35rem', display: 'inline-block' }}>
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li><Link to="/" style={{ color: '#CBD5E1' }}>Home Page</Link></li>
              <li><a href="/#how-it-works" style={{ color: '#CBD5E1' }}>How It Works</a></li>
              <li><a href="/#services" style={{ color: '#CBD5E1' }}>Ambulance Services</a></li>
              <li><Link to="/hospitals" style={{ color: '#CBD5E1' }}>Nearby Hospitals Directory</Link></li>
              <li><Link to="/tracking" style={{ color: '#CBD5E1' }}>Map & Live Dispatch</Link></li>
              <li><Link to="/about" style={{ color: '#CBD5E1' }}>About Project & Mission</Link></li>
              <li><Link to="/contact" style={{ color: '#CBD5E1' }}>Help & Contact</Link></li>
            </ul>
          </div>

          {/* Col 3: Role Portals */}
          <div>
            <h4 style={{ color: 'white', fontSize: '1.05rem', marginBottom: '1.25rem', borderBottom: '2px solid var(--primary-red)', paddingBottom: '0.35rem', display: 'inline-block' }}>
              Role Portals
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li><Link to="/patient" style={{ color: '#CBD5E1' }}>Patient Emergency Portal</Link></li>
              <li><Link to="/driver" style={{ color: '#CBD5E1' }}>Ambulance Driver Terminal</Link></li>
              <li><Link to="/admin" style={{ color: '#CBD5E1' }}>Dispatch Administrator Desk</Link></li>
              <li><Link to="/auth" style={{ color: '#CBD5E1' }}>Sign In / Register</Link></li>
              <li><Link to="/tracking" style={{ color: '#CBD5E1' }}>Ambulance Fleet Status</Link></li>
            </ul>
          </div>

          {/* Col 4: Emergency Contacts & Disclaimer */}
          <div>
            <h4 style={{ color: 'white', fontSize: '1.05rem', marginBottom: '1.25rem', borderBottom: '2px solid var(--primary-red)', paddingBottom: '0.35rem', display: 'inline-block' }}>
              Official Kerala Helplines
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: '#CBD5E1' }}>
              <div><strong>108:</strong> Kanivu 108 Emergency Ambulance</div>
              <div><strong>112:</strong> Kerala Police & Fire Emergency</div>
              <div><strong>102:</strong> Janani Shishu Pregnancy Helpline</div>
              <div><strong>1077:</strong> Thrissur Disaster Control Room</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
                <Mail size={15} color="var(--primary-red)" />
                <span style={{ fontSize: '0.82rem' }}>support@jeevanraksha.org.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Notice Box */}
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          marginBottom: '2rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start'
        }}>
          <ShieldAlert size={22} color="#FBBF24" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '0.82rem', color: '#E2E8F0', lineHeight: 1.5, margin: 0 }}>
            <strong>Important Safety & Prototype Disclaimer:</strong> Jeevan Raksha Connect is an academic technology prototype developed to demonstrate modern emergency dispatch and patient-driver coordination. It is <em>not</em> an operational government service. In any actual medical emergency, you must contact <strong>108</strong> (Ambulance) or <strong>112</strong> (National Emergency Number) immediately.
          </p>
        </div>

        {/* Bottom copyright */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.85rem',
          color: '#94A3B8'
        }}>
          <div>
            © 2026 Jeevan Raksha Connect. Designed for Vellangallur, Kerala. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Dedicated to saving lives in Kerala</span>
            <Heart size={14} color="var(--primary-red)" fill="var(--primary-red)" />
          </div>
        </div>
      </div>
    </footer>
  );
};
