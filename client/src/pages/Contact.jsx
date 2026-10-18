import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Building2, 
  ShieldAlert,
  Clock,
  MessageSquare
} from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Emergency Feedback / System Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '85vh', padding: '3rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '1060px' }}>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ color: 'var(--primary-red)', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            GET IN TOUCH
          </span>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--secondary-navy)', marginTop: '0.4rem', marginBottom: '0.5rem' }}>
            Emergency Helplines & Contact Desk
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Connect with the Vellangallur emergency coordination cell or submit platform feedback.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr', gap: '2rem' }} className="contact-grid">
          
          {/* Left Column: Official Helplines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Primary emergency card */}
            <div className="card" style={{ backgroundColor: 'var(--secondary-navy)', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.4rem', backgroundColor: 'var(--primary-red)', borderRadius: '8px' }}>
                  <Phone size={20} />
                </div>
                <h3 style={{ color: 'white', fontSize: '1.25rem', margin: 0 }}>
                  Immediate Emergency Hotlines
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.92rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.6rem' }}>
                  <span>Kanivu 108 Ambulance (Govt.):</span>
                  <a href="tel:108" style={{ color: '#F87171', fontWeight: 800 }}>Dial 108</a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.6rem' }}>
                  <span>National Unified Emergency:</span>
                  <a href="tel:112" style={{ color: '#60A5FA', fontWeight: 800 }}>Dial 112</a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.6rem' }}>
                  <span>Janani Shishu (Maternity):</span>
                  <a href="tel:102" style={{ color: '#34D399', fontWeight: 800 }}>Dial 102</a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Thrissur District Disaster Cell:</span>
                  <a href="tel:1077" style={{ color: '#FBBF24', fontWeight: 800 }}>Dial 1077</a>
                </div>
              </div>
            </div>

            {/* Local Vellangallur Desk */}
            <div className="card">
              <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary-navy)', marginBottom: '1rem' }}>
                Vellangallur Community Hub
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: '#4B5563' }}>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <MapPin size={18} color="var(--primary-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Office:</strong> Vellangallur Grama Panchayat Health Division, Thrissur District, Kerala - 680662
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <Building2 size={18} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Govt CHC Vellangallur:</strong> 0480 286 0220
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <Mail size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Email:</strong> dispatch@jeevanrakshaconnect.org.in
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <Clock size={18} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Dispatch Hours:</strong> 24 Hours / 7 Days Active
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--secondary-navy)', marginBottom: '0.4rem' }}>
              Send Feedback or Dispatch Inquiry
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Have feedback on our Vellangallur ambulance prototype or want to register as an ambulance operator?
            </p>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h4 style={{ fontSize: '1.25rem', color: 'var(--secondary-navy)', marginBottom: '0.4rem' }}>
                  Thank you for reaching out!
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Your submission has been logged by the project administration team.
                </p>
                <button onClick={() => setSubmitted(false)} className="btn btn-outline btn-sm">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Menon"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="form-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 94471 23456"
                      className="form-input"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <select
                    className="form-select"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="Emergency Feedback / System Inquiry">Emergency Feedback / System Inquiry</option>
                    <option value="Register as Ambulance Driver">Register as Ambulance Driver</option>
                    <option value="Hospital Coordination / Onboarding">Hospital Coordination / Onboarding</option>
                    <option value="Academic Collaboration">Academic Collaboration</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Message Details</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Enter your message or inquiry..."
                    className="form-textarea"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                  <Send size={16} />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 850px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
