import React, { useState, useEffect } from 'react';
import { 
  Siren, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  Navigation, 
  Clock, 
  AlertTriangle, 
  Filter, 
  RefreshCw,
  Phone,
  ShieldAlert,
  Info,
  ChevronRight
} from 'lucide-react';
import { AmbulanceMap } from '../components/AmbulanceMap';
import { StatusBadge } from '../components/StatusBadge';

export const Tracking = () => {
  const [ambulances, setAmbulances] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Simulation State for Academic Demonstration
  const [simStep, setSimStep] = useState(3); // 0 to 5
  const simSteps = [
    { title: 'Pending', desc: 'Request registered; dispatcher searching for available unit.' },
    { title: 'Accepted', desc: 'Driver acknowledged emergency dispatch call.' },
    { title: 'Ambulance Assigned', desc: 'Unit KL-45-S-8821 allocated with ALS equipment.' },
    { title: 'On the Way', desc: 'Ambulance en route with siren to Vellangallur pickup point.' },
    { title: 'Arrived at Pickup', desc: 'Ambulance has reached patient location.' },
    { title: 'Completed', desc: 'Patient safely handed over to hospital trauma emergency.' },
  ];

  // Fetch ambulances
  const fetchAmbulances = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/ambulances');
      const data = await res.json();
      if (data.success) {
        setAmbulances(data.ambulances || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmbulances();
  }, []);

  // Filter ambulances
  const filteredAmbulances = ambulances.filter((a) => {
    if (filterType !== 'ALL' && a.vehicleType !== filterType) return false;
    if (filterStatus !== 'ALL' && a.status !== filterStatus) return false;
    return true;
  });

  return (
    <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '85vh', padding: '2.5rem 0 4rem' }}>
      <div className="container">

        {/* Section Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-accepted">Leaflet & OpenStreetMap Engine</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• Sector: Vellangallur, Kerala (680662)</span>
          </div>
          <h1 style={{ fontSize: '2rem', color: 'var(--secondary-navy)', marginBottom: '0.4rem' }}>
            Ambulance Fleet & Live Tracking Map
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Locate standby ambulances across Vellangallur, Irinjalakuda, and Kodungallur.
          </p>
        </div>

        {/* Mandatory Transparency & GPS Demonstration Notice */}
        <div style={{
          backgroundColor: '#FFFBEB',
          border: '1.5px solid #FCD34D',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start'
        }}>
          <Info size={22} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 700, color: '#92400E', fontSize: '0.92rem' }}>
              GPS Demonstration & Academic Disclosure Notice
            </div>
            <div style={{ fontSize: '0.85rem', color: '#B45309', marginTop: '0.2rem', lineHeight: 1.5 }}>
              In accordance with emergency protocol standards, this map displays last reported base station coordinates and simulated route progression. Real-time satellite GPS hardware feeds are simulated for demonstration unless linked to verified hardware telematics.
            </div>
          </div>
        </div>

        {/* Interactive Stepper / Tracker Simulator */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--secondary-navy)', margin: 0 }}>
                Emergency Request Lifecycle Stepper
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Standard 7-stage protocol progression for Jeevan Raksha Connect
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                onClick={() => setSimStep(Math.max(0, simStep - 1))}
                className="btn btn-outline btn-sm"
                disabled={simStep === 0}
              >
                Previous Stage
              </button>
              <button
                onClick={() => setSimStep(Math.min(simSteps.length - 1, simStep + 1))}
                className="btn btn-primary btn-sm"
                disabled={simStep === simSteps.length - 1}
              >
                Advance Stage →
              </button>
            </div>
          </div>

          {/* Stepper Steps UI */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
            {simSteps.map((step, idx) => {
              const isActive = idx === simStep;
              const isPast = idx < simStep;

              return (
                <div
                  key={step.title}
                  onClick={() => setSimStep(idx)}
                  style={{
                    backgroundColor: isActive ? 'var(--primary-red-light)' : (isPast ? '#F0FDF4' : 'var(--bg-light)'),
                    border: isActive ? '2px solid var(--primary-red)' : (isPast ? '1px solid #86EFAC' : '1px solid var(--border-light)'),
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isActive ? 'var(--primary-red)' : (isPast ? '#15803D' : 'var(--text-muted)') }}>
                      STEP 0{idx + 1}
                    </span>
                    {isPast && <CheckCircle2 size={14} color="#16A34A" />}
                    {isActive && <span className="pulse-badge" style={{ backgroundColor: 'var(--primary-red)' }} />}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--secondary-navy)' }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {step.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map & Ambulance List Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.75rem' }} className="tracking-grid">
          
          {/* Left Column: Leaflet Map */}
          <div>
            <div className="card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--secondary-navy)' }}>
                  Interactive OpenStreetMap • Vellangallur Sector
                </div>
                <button
                  onClick={fetchAmbulances}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                >
                  <RefreshCw size={12} />
                  <span>Update Pins</span>
                </button>
              </div>

              <AmbulanceMap
                center={[10.2858, 76.2232]}
                zoom={12}
                ambulances={filteredAmbulances}
                patientLocation={{ latitude: 10.2858, longitude: 76.2232, address: 'Vellangallur Central' }}
                hospitalLocation={{ latitude: 10.3427, longitude: 76.2089, name: 'Taluk Hospital Irinjalakuda' }}
                showRoute={true}
                height="500px"
              />
            </div>
          </div>

          {/* Right Column: Fleet List & Filters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Filters */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--secondary-navy)', marginBottom: '0.75rem' }}>
                <Filter size={16} />
                <span>Filter Fleet</span>
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Vehicle Type</label>
                  <select
                    className="form-select"
                    style={{ padding: '0.4rem', fontSize: '0.82rem' }}
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="ALL">All Equipment Grades</option>
                    <option value="ALS">Advanced Life Support (ALS)</option>
                    <option value="BLS">Basic Life Support (BLS)</option>
                    <option value="Cardiac ICU">Cardiac ICU</option>
                    <option value="Patient Transport">Patient Transport</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Status</label>
                  <select
                    className="form-select"
                    style={{ padding: '0.4rem', fontSize: '0.82rem' }}
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="Available">Available</option>
                    <option value="On Duty">On Duty</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Ambulance Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Nearby Fleet Standby ({filteredAmbulances.length})
              </div>

              {filteredAmbulances.map((amb) => (
                <div key={amb._id} className="card" style={{ padding: '1rem', borderLeft: amb.status === 'Available' ? '4px solid #10B981' : '4px solid #D92332' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--secondary-navy)' }}>
                        {amb.vehicleNumber}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--primary-red)', fontWeight: 600 }}>
                        {amb.vehicleType} Emergency Ambulance
                      </div>
                    </div>
                    <span className={`badge ${amb.status === 'Available' ? 'badge-arrived' : 'badge-onway'}`}>
                      {amb.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#4B5563', margin: '0.3rem 0' }}>
                    📍 <strong>Base:</strong> {amb.baseStation}
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#4B5563' }}>
                    👤 <strong>Driver:</strong> {amb.driverName || 'Standby Crew'}
                  </div>

                  {/* Equipment Pills */}
                  {amb.equipment && amb.equipment.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.5rem' }}>
                      {amb.equipment.slice(0, 3).map((eq, i) => (
                        <span key={i} style={{ backgroundColor: 'var(--bg-light)', padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.72rem', color: '#374151' }}>
                          {eq}
                        </span>
                      ))}
                      {amb.equipment.length > 3 && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                          +{amb.equipment.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {amb.contactNumber && (
                    <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Trips: <strong>{amb.tripsCompleted || 0}</strong> • Rating: ★{amb.rating || 4.8}
                      </span>
                      <a href={`tel:${amb.contactNumber}`} className="btn btn-outline btn-sm" style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}>
                        <Phone size={12} />
                        <span>Call Unit</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .tracking-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
