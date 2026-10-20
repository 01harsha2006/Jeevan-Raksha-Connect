import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Siren, 
  MapPin, 
  PhoneCall, 
  Clock, 
  ShieldCheck, 
  Activity, 
  HeartHandshake, 
  Truck, 
  Building2, 
  CheckCircle, 
  ArrowRight, 
  Phone,
  AlertCircle,
  HelpCircle,
  Heart,
  UserCheck
} from 'lucide-react';
import { RequestAmbulanceModal } from '../components/RequestAmbulanceModal';

export const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get('section');
    const hash = location.hash ? location.hash.replace('#', '') : null;
    const targetId = section || hash;

    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  }, [location]);

  const handleRequestClick = () => {
    if (!isAuthenticated) {
      navigate('/auth?redirect=request');
    } else {
      setModalOpen(true);
    }
  };

  return (
    <div>
      {/* 1. Hero Emergency Section */}
      <section style={{
        background: 'linear-gradient(135deg, #14213D 0%, #1A2E56 60%, #203A6B 100%)',
        color: 'white',
        padding: '4rem 0 5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative background glow */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217,35,50,0.18) 0%, rgba(20,33,61,0) 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem', alignItems: 'center' }} className="hero-grid">
            
            {/* Left Column: Heading & CTAs */}
            <div>
              {/* Region Pill */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(217, 35, 50, 0.15)',
                border: '1px solid rgba(217, 35, 50, 0.4)',
                color: '#FCA5A5',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '1.25rem'
              }}>
                <MapPin size={15} color="#EF4444" />
                <span>Serving Vellangallur, Kerala & Surrounding Panchayats</span>
              </div>

              {/* Tagline & Title */}
              <h1 style={{
                fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.15,
                marginBottom: '1rem'
              }}>
                Every Second Matters. <br />
                <span style={{ color: '#F87171' }}>Every Life Matters.</span>
              </h1>

              {/* Emergency Callout Card */}
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                borderLeft: '4px solid var(--primary-red)',
                borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                padding: '1.25rem 1.5rem',
                marginBottom: '2rem'
              }}>
                <h2 style={{ fontSize: '1.35rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Emergency? Help Is Just One Step Away.
                </h2>
                <p style={{ color: '#E2E8F0', fontSize: '0.98rem', lineHeight: 1.5 }}>
                  Instantly request life-saving emergency ambulance services across Vellangallur. We connect patients with the nearest verified drivers to eliminate transit delays during critical medical golden hours.
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  onClick={handleRequestClick}
                  className="btn btn-emergency"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
                >
                  <Siren size={22} />
                  <span>Request an Ambulance</span>
                </button>

                <Link
                  to="/hospitals"
                  className="btn btn-outline"
                  style={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    padding: '0.9rem 1.6rem',
                    fontSize: '1rem'
                  }}
                >
                  <Building2 size={20} />
                  <span>Find Nearby Hospitals</span>
                </Link>
              </div>

              {/* Quick direct phone reminder */}
              <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: '#94A3B8' }}>
                <PhoneCall size={16} color="#F87171" />
                <span>Instant Telephone Dispatch: Dial <strong>108</strong> (Govt. Ambulance) or <strong>112</strong></span>
              </div>
            </div>

            {/* Right Column: Hero Visual Graphic */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                width: '100%',
                maxWidth: '440px',
                boxShadow: 'var(--shadow-xl)',
                position: 'relative'
              }}>
                {/* Visual badge top */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10B981', animation: 'pulse-subtle 1.5s infinite' }} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#A7F3D0', letterSpacing: '0.04em' }}>
                      DISPATCH ACTIVE (VELLANGALLUR)
                    </span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#CBD5E1', backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    24x7 Ready
                  </span>
                </div>

                {/* SVG Ambulance Hero Graphic */}
                <div style={{
                  background: 'linear-gradient(180deg, rgba(217,35,50,0.1) 0%, rgba(20,33,61,0.4) 100%)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.75rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <svg width="180" height="110" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Siren light bar glow */}
                    <circle cx="85" cy="18" r="8" fill="#D92332" opacity="0.8" style={{ animation: 'siren-glow 1s infinite' }} />
                    <circle cx="95" cy="18" r="8" fill="#3B82F6" opacity="0.8" style={{ animation: 'siren-glow 1s infinite 0.5s' }} />
                    <rect x="75" y="20" width="30" height="6" rx="2" fill="#374151" />

                    {/* Ambulance body */}
                    <path d="M20 50 C20 40, 30 35, 45 35 L120 35 L145 55 L175 60 C182 62, 185 68, 185 75 L185 92 L20 92 Z" fill="#FFFFFF" />
                    {/* Red emergency stripe */}
                    <rect x="20" y="65" width="165" height="12" fill="#D92332" />
                    {/* Medical Cross */}
                    <path d="M55 42 H65 V48 H71 V56 H65 V62 H55 V56 H49 V48 H55 Z" fill="#D92332" />
                    {/* Windshield & Windows */}
                    <path d="M125 40 L142 55 L125 55 Z" fill="#93C5FD" opacity="0.9" />
                    <rect x="75" y="42" width="22" height="13" rx="2" fill="#93C5FD" opacity="0.8" />
                    {/* Headlights */}
                    <path d="M185 72 L192 74 L185 78 Z" fill="#FEF08A" />
                    {/* Wheels */}
                    <circle cx="55" cy="95" r="15" fill="#1F2937" stroke="#9CA3AF" strokeWidth="4" />
                    <circle cx="55" cy="95" r="5" fill="#E5E7EB" />
                    <circle cx="150" cy="95" r="15" fill="#1F2937" stroke="#9CA3AF" strokeWidth="4" />
                    <circle cx="150" cy="95" r="5" fill="#E5E7EB" />
                    {/* Road line */}
                    <line x1="5" y1="110" x2="195" y2="110" stroke="#4B5563" strokeWidth="3" strokeDasharray="10 6" />
                  </svg>
                  <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: '#CBD5E1', textAlign: 'center' }}>
                    ALS & BLS Units on Standby in Vellangallur
                  </div>
                </div>

                {/* Live System Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34D399' }}>~8-12 min</div>
                    <div style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>Avg. Arrival Window</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#60A5FA' }}>6 Verified</div>
                    <div style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>Regional Hospitals</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. "How It Works" 3-Step Section */}
      <section id="how-it-works" style={{ padding: '5rem 0', backgroundColor: 'var(--bg-white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem' }}>
            <span style={{ color: 'var(--primary-red)', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              SIMPLE & FAST WORKFLOW
            </span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '0.4rem', color: 'var(--secondary-navy)' }}>
              How Jeevan Raksha Connect Works
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '0.5rem' }}>
              Designed for high-stress situations. Request assistance in three swift, transparent steps without complicated questionnaires.
            </p>
          </div>

          <div className="grid-3">
            {/* Step 1 */}
            <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1.25rem',
                fontSize: '3rem',
                fontWeight: 900,
                color: 'rgba(20,33,61,0.06)',
                lineHeight: 1
              }}>
                01
              </div>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                backgroundColor: 'var(--primary-red-light)',
                color: 'var(--primary-red)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Siren size={28} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.6rem' }}>
                1. Request an Ambulance
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Submit patient name, contact number, pickup landmark or tap "Detect GPS". Choose the emergency category (Cardiac, Accident, Pregnancy, Medical) to prepare the crew.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1.25rem',
                fontSize: '3rem',
                fontWeight: 900,
                color: 'rgba(20,33,61,0.06)',
                lineHeight: 1
              }}>
                02
              </div>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                backgroundColor: '#DBEAFE',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <UserCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.6rem' }}>
                2. Connect with Driver
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Our dispatch routing matches the request to the nearest available ambulance in the Vellangallur sector. Driver accepts the dispatch and prepares necessary life support equipment.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1.25rem',
                fontSize: '3rem',
                fontWeight: 900,
                color: 'rgba(20,33,61,0.06)',
                lineHeight: 1
              }}>
                03
              </div>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                backgroundColor: '#D1FAE5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Truck size={28} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.6rem' }}>
                3. Track Your Ambulance
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Follow real-time status updates on our OpenStreetMap interface — from "On the Way" to "Arrived at Pickup" and transfer to the emergency trauma centre.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Emergency Services Showcase */}
      <section id="services" style={{ padding: '5rem 0', backgroundColor: 'var(--bg-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem' }}>
            <span style={{ color: 'var(--primary-red)', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              COMPREHENSIVE FLEET
            </span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '0.4rem', color: 'var(--secondary-navy)' }}>
              Emergency Services Supported
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '0.5rem' }}>
              Equipped vehicles suitable for varied medical urgencies across Vellangallur, Irinjalakuda, and Kodungallur corridors.
            </p>
          </div>

          <div className="grid-3">
            {/* ALS Card */}
            <div className="card" style={{ borderTop: '4px solid #D92332' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span className="badge badge-onway">Advanced Support</span>
                <Activity size={24} color="#D92332" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Advanced Life Support (ALS)</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Outfitted with transport ventilators, cardiac monitors, defibrillators, oxygen tanks, and IV drug supplies for critical patients.
              </p>
              <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: '#4B5563', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>✓ Trained Emergency Paramedic on board</li>
                <li>✓ Portable ECG & Suction unit</li>
                <li>✓ Biphasic defibrillator with pacing</li>
              </ul>
            </div>

            {/* BLS Card */}
            <div className="card" style={{ borderTop: '4px solid #2563EB' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span className="badge badge-accepted">Standard Emergency</span>
                <Truck size={24} color="#2563EB" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Basic Life Support (BLS)</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Essential pre-hospital care for non-invasive respiratory distress, bone fractures, stabilization, and rapid hospital transit.
              </p>
              <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: '#4B5563', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>✓ Oxygen delivery systems</li>
                <li>✓ Spine board & cervical collars</li>
                <li>✓ First aid hemorrhage control kit</li>
              </ul>
            </div>

            {/* Cardiac ICU Card */}
            <div className="card" style={{ borderTop: '4px solid #7C3AED' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span className="badge badge-assigned">Intensive Care</span>
                <Heart size={24} color="#7C3AED" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Cardiac & ICU on Wheels</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Designed for myocardial infarction, heart failure, and inter-hospital critical ICU transfers to Thrissur / Kochi tertiary hospitals.
              </p>
              <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: '#4B5563', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>✓ Multichannel invasive monitoring</li>
                <li>✓ Infusion & syringe pumps</li>
                <li>✓ Direct telemetry with hospital ICU</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Benefits Section */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-white)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3.5rem', alignItems: 'center' }} className="benefits-grid">
            <div>
              <span style={{ color: 'var(--primary-red)', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                WHY JEEVAN RAKSHA CONNECT
              </span>
              <h2 style={{ fontSize: '2.2rem', marginTop: '0.4rem', color: 'var(--secondary-navy)', marginBottom: '1.25rem' }}>
                Empowering Rural & Semi-Urban Kerala Emergency Transport
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                In rural and panchayat regions like Vellangallur, locating an ambulance driver in the middle of the night can be stressful and chaotic. Jeevan Raksha Connect organizes regional emergency drivers into a unified network.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ backgroundColor: '#D1FAE5', color: '#059669', padding: '0.4rem', borderRadius: '8px', flexShrink: 0 }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--secondary-navy)' }}>Rapid Golden Hour Dispatch</h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Reduces panic calls and connects immediately to available on-duty ambulances within Vellangallur boundaries.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ backgroundColor: '#DBEAFE', color: '#2563EB', padding: '0.4rem', borderRadius: '8px', flexShrink: 0 }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--secondary-navy)' }}>Location-Based Search</h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>GPS and landmark mapping eliminates the confusion of giving complex rural Malayalam directions over phone.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '0.4rem', borderRadius: '8px', flexShrink: 0 }}>
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--secondary-navy)' }}>Transparent Request Status</h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Patients, family members, and hospitals can see the exact step status: Accepted, En Route, or Arrived.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Visual Card */}
            <div style={{
              backgroundColor: 'var(--secondary-navy)',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem',
              color: 'white',
              boxShadow: 'var(--shadow-xl)',
              position: 'relative'
            }}>
              <h3 style={{ color: 'white', fontSize: '1.4rem', marginBottom: '1.25rem' }}>
                Regional Medical Reach
              </h3>
              <p style={{ color: '#CBD5E1', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Vellangallur connects key healthcare corridors between Irinjalakuda and Kodungallur. Our system is structured around verified regional referral destinations:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <span>Govt. CHC Vellangallur</span>
                  <span style={{ color: '#34D399', fontWeight: 600 }}>0.8 km (Local)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <span>Taluk Hospital Irinjalakuda</span>
                  <span style={{ color: '#60A5FA', fontWeight: 600 }}>8.4 km (~14 min)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <span>Modern Hospital Kodungallur</span>
                  <span style={{ color: '#60A5FA', fontWeight: 600 }}>9.1 km (~15 min)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0' }}>
                  <span>Jubilee Mission Hospital Thrissur</span>
                  <span style={{ color: '#F87171', fontWeight: 600 }}>28.5 km (Apex Trauma)</span>
                </div>
              </div>

              <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <Link to="/hospitals" className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', width: '100%' }}>
                  View All Verified Hospitals & Facilities →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Emergency Callout Strip */}
      <section style={{ backgroundColor: 'var(--primary-red)', color: 'white', padding: '3.5rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ color: 'white', fontSize: '2.2rem', marginBottom: '0.75rem' }}>
            Are You Experiencing a Medical Crisis Right Now?
          </h2>
          <p style={{ color: '#FEE2E2', fontSize: '1.05rem', marginBottom: '2rem' }}>
            Do not hesitate. Request an ambulance immediately or call the state 108 emergency service directly.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleRequestClick}
              className="btn"
              style={{
                backgroundColor: 'white',
                color: 'var(--primary-red)',
                fontSize: '1.1rem',
                padding: '0.9rem 2rem',
                fontWeight: 800,
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              Request Ambulance Now
            </button>
            <a
              href="tel:108"
              className="btn btn-outline"
              style={{
                color: 'white',
                borderColor: 'white',
                fontSize: '1.1rem',
                padding: '0.9rem 2rem',
                fontWeight: 700
              }}
            >
              <PhoneCall size={20} />
              <span>Call 108 Helpline</span>
            </a>
          </div>
        </div>
      </section>

      {/* Modal for Instant Request */}
      <RequestAmbulanceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onRequestCreated={() => {
          navigate('/patient');
        }}
      />

      {/* Responsive media styling */}
      <style>{`
        @media (max-width: 900px) {
          .hero-grid, .benefits-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};
