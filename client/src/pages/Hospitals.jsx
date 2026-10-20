import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  ExternalLink, 
  CheckCircle, 
  Search, 
  Filter, 
  Crosshair, 
  Activity, 
  Bed, 
  Truck,
  ShieldCheck
} from 'lucide-react';

import { DEFAULT_HOSPITALS } from '../utils/clientStorage';

export const Hospitals = () => {
  const [hospitals, setHospitals] = useState(DEFAULT_HOSPITALS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [facilityFilter, setFacilityFilter] = useState('ALL');

  // User location for distance calculation
  const [userCoords, setUserCoords] = useState({ latitude: 10.2858, longitude: 76.2232, label: 'Vellangallur Central (Default)' });
  const [gpsActive, setGpsActive] = useState(false);

  // Fetch verified hospitals from API with fallback
  const fetchHospitals = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch('/api/hospitals', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        if (data.success && data.hospitals && data.hospitals.length > 0) {
          setHospitals(data.hospitals);
        }
      }
    } catch (err) {
      // Gracefully retain DEFAULT_HOSPITALS
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  // Detect GPS
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported by browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          label: 'Your Current GPS Location'
        });
        setGpsActive(true);
      },
      (err) => {
        alert('Could not retrieve GPS location. Keeping Vellangallur as reference point.');
      }
    );
  };

  // Haversine formula for distance calculation in kilometers
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  // Filter hospitals
  const filteredHospitals = hospitals.filter((h) => {
    if (facilityFilter !== 'ALL') {
      const match = h.emergencyServices?.some(s => s.toLowerCase().includes(facilityFilter.toLowerCase()));
      if (!match) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = h.name.toLowerCase().includes(q);
      const matchAddr = h.address.toLowerCase().includes(q);
      if (!matchName && !matchAddr) return false;
    }

    return true;
  });

  return (
    <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '85vh', padding: '2.5rem 0 4rem' }}>
      <div className="container">

        {/* Page Title & Location Ref */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-accepted">Verified Referral Facilities</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• Thrissur & Ernakulam Border Corridors</span>
            </div>
            <h1 style={{ fontSize: '2rem', color: 'var(--secondary-navy)', marginBottom: '0.35rem' }}>
              Nearby Emergency Hospitals & Trauma Centers
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Directory of verified healthcare institutions serving Vellangallur with 24x7 trauma, maternity, and ICU care.
            </p>
          </div>

          {/* Reference point pill */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid var(--border-light)',
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Reference Center
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--secondary-navy)' }}>
                {userCoords.label}
              </div>
            </div>
            <button
              onClick={handleDetectGPS}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.78rem', gap: '0.3rem', borderColor: gpsActive ? '#10B981' : 'var(--border-light)' }}
            >
              <Crosshair size={13} color={gpsActive ? '#10B981' : 'var(--primary-red)'} />
              <span>{gpsActive ? 'GPS Active' : 'Calibrate GPS'}</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.2rem', paddingRight: '0.75rem', fontSize: '0.88rem' }}
                placeholder="Search hospital name, location, or town..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Facility Filter Pills */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {[
                { label: 'All Hospitals', key: 'ALL' },
                { label: 'ICU Facilities', key: 'ICU' },
                { label: 'Trauma Unit', key: 'Trauma' },
                { label: 'Maternity Care', key: 'Maternity' },
                { label: 'Cardiac Care', key: 'Cardiac' }
              ].map((pill) => (
                <button
                  key={pill.key}
                  onClick={() => setFacilityFilter(pill.key)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--radius-full)',
                    border: facilityFilter === pill.key ? '1.5px solid var(--primary-red)' : '1px solid var(--border-light)',
                    backgroundColor: facilityFilter === pill.key ? 'var(--primary-red-light)' : 'white',
                    color: facilityFilter === pill.key ? 'var(--primary-red)' : 'var(--text-dark)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hospital Cards Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Loading verified hospital directory...
          </div>
        ) : filteredHospitals.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <Building2 size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary-navy)', marginBottom: '0.4rem' }}>
              No Hospitals Match Your Filter
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Try clearing the search query or selecting "All Hospitals".
            </p>
          </div>
        ) : (
          <div className="grid-2">
            {filteredHospitals.map((hosp) => {
              const dist = calculateDistance(
                userCoords.latitude,
                userCoords.longitude,
                hosp.location?.latitude,
                hosp.location?.longitude
              );

              return (
                <div key={hosp._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    {/* Top Badges */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <span className="badge badge-accepted" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <ShieldCheck size={13} color="#2563EB" />
                        Verified Facility
                      </span>
                      {dist && (
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-red)', backgroundColor: 'var(--primary-red-light)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                          ~{dist} km away
                        </span>
                      )}
                    </div>

                    {/* Hospital Name */}
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary-navy)', marginBottom: '0.4rem' }}>
                      {hosp.name}
                    </h3>

                    {/* Address */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      <MapPin size={16} color="var(--primary-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{hosp.address}</span>
                    </div>

                    {/* Trauma Tier & Capacity */}
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#4B5563', backgroundColor: 'var(--bg-light)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                      <div>
                        <strong>Tier:</strong> {hosp.traumaLevel || 'Secondary Trauma'}
                      </div>
                      <div>
                        <strong>Beds:</strong> {hosp.availableBeds || '50+'}
                      </div>
                      <div>
                        <strong>Ambulance Fleet:</strong> {hosp.ambulanceCount || '3'}
                      </div>
                    </div>

                    {/* Services Chips */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                        Emergency Facilities
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {hosp.emergencyServices?.map((srv, i) => (
                          <span
                            key={i}
                            style={{
                              backgroundColor: 'white',
                              border: '1px solid var(--border-light)',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              color: '#374151'
                            }}
                          >
                            ✓ {srv}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons: Call & Directions */}
                  <div style={{ display: 'flex', gap: '0.6rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                    <a
                      href={`tel:${hosp.contactNumber}`}
                      className="btn btn-outline-red btn-sm"
                      style={{ flex: 1, fontWeight: 700 }}
                    >
                      <Phone size={14} />
                      <span>{hosp.contactNumber}</span>
                    </a>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hosp.name + ' ' + hosp.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1 }}
                    >
                      <ExternalLink size={14} />
                      <span>Get Directions</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
