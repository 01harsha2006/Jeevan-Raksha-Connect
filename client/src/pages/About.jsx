import React from 'react';
import { 
  Siren, 
  MapPin, 
  Heart, 
  ShieldAlert, 
  Clock, 
  Users, 
  Building2, 
  Award,
  CheckCircle2
} from 'lucide-react';

export const About = () => {
  return (
    <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '85vh', padding: '3rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--primary-red-light)', color: 'var(--primary-red)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <Siren size={16} />
            <span>PROJECT MISSION & OBJECTIVES</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--secondary-navy)', marginBottom: '0.75rem' }}>
            About Jeevan Raksha Connect
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
            "Every Second Matters. Every Life Matters."
          </p>
        </div>

        {/* Narrative Card */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--secondary-navy)', marginBottom: '1rem' }}>
            Our Purpose & Genesis
          </h2>
          <p style={{ color: '#374151', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            In semi-urban and rural areas of Kerala, such as <strong>Vellangallur Grama Panchayat</strong> (located between Irinjalakuda and Kodungallur in Thrissur District), securing an emergency ambulance during nocturnal hours or sudden cardiac/trauma events often involves distress calls to random personal contacts or hospital receptionists.
          </p>
          <p style={{ color: '#374151', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            <strong>Jeevan Raksha Connect</strong> was engineered to bridge this gap. By uniting registered ambulance drivers, community health posts, and local residents onto a single digital dispatch canvas, we help reduce transit latency, provide transparent request tracking, and preserve the critical "Golden Hour" of medical treatment.
          </p>

          <div className="grid-3" style={{ marginTop: '2rem' }}>
            <div style={{ backgroundColor: 'var(--bg-light)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ color: 'var(--primary-red)', fontWeight: 800, fontSize: '1.6rem', marginBottom: '0.2rem' }}>
                &lt; 10 min
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--secondary-navy)' }}>
                Target Response Time
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Minimizing phone coordination delays
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-light)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ color: '#2563EB', fontWeight: 800, fontSize: '1.6rem', marginBottom: '0.2rem' }}>
                100%
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--secondary-navy)' }}>
                Status Transparency
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                From driver acceptance to hospital delivery
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-light)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ color: '#059669', fontWeight: 800, fontSize: '1.6rem', marginBottom: '0.2rem' }}>
                6+
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--secondary-navy)' }}>
                Verified Hospitals
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Direct route mapping across Thrissur
              </div>
            </div>
          </div>
        </div>

        {/* Academic & Prototype Notice */}
        <div style={{
          backgroundColor: '#FFFBEB',
          border: '2px solid #FCD34D',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          marginBottom: '2.5rem'
        }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <ShieldAlert size={28} color="#D97706" style={{ flexShrink: 0 }} />
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#92400E', marginBottom: '0.4rem' }}>
                Academic Technology Prototype Disclaimer
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#B45309', lineHeight: 1.6, margin: 0 }}>
                This platform is an academic demonstration and operational research project designed to demonstrate how emergency transit can be modernized in Kerala panchayats. <strong>It is not currently an operational state-run emergency service.</strong> In life-threatening emergencies, patients and caretakers must immediately contact <strong>108</strong> (Govt. Ambulance) or <strong>112</strong> (National Emergency Helpline).
              </p>
            </div>
          </div>
        </div>

        {/* Ethical Standards & Privacy */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--secondary-navy)', marginBottom: '1rem' }}>
            Core Architectural Principles
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={20} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Zero Pre-requisite Friction:</strong> Clean UI ensures anyone in distress can lodge an ambulance request in seconds without complex hurdles.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={20} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>No Fabricated Tracking:</strong> Live status transitions represent actual driver dispatches and base station check-ins rather than misleading fake telemetry.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={20} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Location Privacy First:</strong> Patient GPS coordinates are only requested with explicit user permission and used strictly for ambulance guidance.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
