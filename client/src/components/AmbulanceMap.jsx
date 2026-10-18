import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Building2, Phone } from 'lucide-react';

// Custom Map center changer helper with safety check
const ChangeMapView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    try {
      if (map && center && Number.isFinite(center[0]) && Number.isFinite(center[1])) {
        map.setView(center, zoom || 13);
      }
    } catch (e) {
      console.warn('Map setView error:', e);
    }
  }, [center, zoom, map]);
  return null;
};

// Safe SVG DivIcon generators
const createAmbulanceIcon = (status, type) => {
  const isOnline = status === 'Available';
  const bgColor = isOnline ? '#10B981' : (status === 'On Duty' ? '#D92332' : '#6B7280');
  
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div style="
        background: ${bgColor};
        color: white;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        font-size: 16px;
        cursor: pointer;
        position: relative;
      ">
        🚑
        <span style="
          position: absolute;
          bottom: -4px;
          right: -4px;
          background: #14213D;
          color: white;
          font-size: 9px;
          font-weight: bold;
          padding: 1px 4px;
          border-radius: 4px;
        ">${type || 'AMB'}</span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
};

const createPatientIcon = () => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div style="
        background: #D92332;
        color: white;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(217,35,50,0.5);
        font-size: 16px;
      ">
        📍
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });
};

const createHospitalIcon = () => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div style="
        background: #2563EB;
        color: white;
        width: 34px;
        height: 34px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.25);
        font-size: 16px;
        font-weight: bold;
      ">
        🏥
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });
};

export const AmbulanceMap = ({
  center = [10.2858, 76.2232],
  zoom = 13,
  ambulances = [],
  patientLocation = null,
  hospitalLocation = null,
  showRoute = false,
  height = '450px'
}) => {
  const [mapError, setMapError] = useState(false);

  // Safe center validation
  const safeCenter = (
    Array.isArray(center) &&
    Number.isFinite(Number(center[0])) &&
    Number.isFinite(Number(center[1]))
  ) ? [Number(center[0]), Number(center[1])] : [10.2858, 76.2232];

  // Validate and construct route points strictly with finite numbers
  const validRoutePoints = [];
  if (showRoute) {
    if (ambulances && ambulances.length > 0 && ambulances[0]?.location) {
      const aLat = Number(ambulances[0].location.latitude);
      const aLng = Number(ambulances[0].location.longitude);
      if (Number.isFinite(aLat) && Number.isFinite(aLng)) {
        validRoutePoints.push([aLat, aLng]);
      }
    }

    if (patientLocation) {
      const pLat = Number(patientLocation.latitude);
      const pLng = Number(patientLocation.longitude);
      if (Number.isFinite(pLat) && Number.isFinite(pLng)) {
        validRoutePoints.push([pLat, pLng]);
      }
    }

    if (hospitalLocation) {
      const hLat = Number(hospitalLocation.latitude);
      const hLng = Number(hospitalLocation.longitude);
      if (Number.isFinite(hLat) && Number.isFinite(hLng)) {
        validRoutePoints.push([hLat, hLng]);
      }
    }
  }

  // Fallback view if Leaflet encounters WebGL/context issues
  if (mapError) {
    return (
      <div style={{
        height,
        width: '100%',
        backgroundColor: '#F8FAFC',
        border: '1.5px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <MapPin size={32} color="var(--primary-red)" style={{ marginBottom: '0.5rem' }} />
        <div style={{ fontWeight: 700, color: 'var(--secondary-navy)', fontSize: '1rem' }}>
          GPS Dispatch Tracking Standby
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          Pickup: {patientLocation?.address || 'Vellangallur Central Sector'}
        </div>
      </div>
    );
  }

  return (
    <div style={{ height, width: '100%', position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
      {/* Sector Badge */}
      <div style={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1000,
        backgroundColor: 'rgba(20, 33, 61, 0.88)',
        color: 'white',
        padding: '0.35rem 0.75rem',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.75rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        boxShadow: 'var(--shadow-md)',
        backdropFilter: 'blur(4px)'
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }}></span>
        OpenStreetMap • Vellangallur Sector
      </div>

      <MapContainer
        key={`leaflet-map-${safeCenter[0]}-${safeCenter[1]}`}
        center={safeCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <ChangeMapView center={safeCenter} zoom={zoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Ambulances */}
        {Array.isArray(ambulances) && ambulances.map((amb) => {
          if (!amb?.location) return null;
          const lat = Number(amb.location.latitude);
          const lng = Number(amb.location.longitude);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

          return (
            <Marker
              key={amb._id || amb.vehicleNumber || `amb-${lat}-${lng}`}
              position={[lat, lng]}
              icon={createAmbulanceIcon(amb.status, amb.vehicleType)}
            >
              <Popup>
                <div style={{ padding: '0.2rem', minWidth: '180px' }}>
                  <div style={{ fontWeight: 800, color: 'var(--secondary-navy)', fontSize: '0.95rem' }}>
                    {amb.vehicleNumber}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary-red)', fontWeight: 600 }}>
                    {amb.vehicleType} Emergency Unit
                  </div>
                  <div style={{ fontSize: '0.8rem', margin: '0.3rem 0', color: '#4B5563' }}>
                    <strong>Base:</strong> {amb.baseStation || 'Vellangallur Standby'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#4B5563' }}>
                    <strong>Driver:</strong> {amb.driverName || 'Standby Crew'}
                  </div>
                  {amb.contactNumber && (
                    <div style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>
                      <a href={`tel:${amb.contactNumber}`} style={{ color: 'var(--primary-red)', fontWeight: 600 }}>
                        📞 {amb.contactNumber}
                      </a>
                    </div>
                  )}
                  <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', fontWeight: 600, color: amb.status === 'Available' ? '#059669' : '#DC2626' }}>
                    Status: {amb.status}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Patient Pickup Marker */}
        {patientLocation && Number.isFinite(Number(patientLocation.latitude)) && Number.isFinite(Number(patientLocation.longitude)) && (
          <Marker
            position={[Number(patientLocation.latitude), Number(patientLocation.longitude)]}
            icon={createPatientIcon()}
          >
            <Popup>
              <div style={{ padding: '0.2rem' }}>
                <div style={{ fontWeight: 800, color: '#D92332', fontSize: '0.95rem' }}>
                  📍 Emergency Pickup Point
                </div>
                <div style={{ fontSize: '0.82rem', color: '#374151', marginTop: '0.2rem' }}>
                  {patientLocation.address || 'Reported patient location in Vellangallur'}
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Hospital Destination Marker */}
        {hospitalLocation && Number.isFinite(Number(hospitalLocation.latitude)) && Number.isFinite(Number(hospitalLocation.longitude)) && (
          <Marker
            position={[Number(hospitalLocation.latitude), Number(hospitalLocation.longitude)]}
            icon={createHospitalIcon()}
          >
            <Popup>
              <div style={{ padding: '0.2rem' }}>
                <div style={{ fontWeight: 800, color: '#2563EB', fontSize: '0.95rem' }}>
                  🏥 {hospitalLocation.name || 'Destination Hospital'}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#374151', marginTop: '0.2rem' }}>
                  {hospitalLocation.address || 'Medical Facility'}
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route visualization line */}
        {validRoutePoints.length >= 2 && (
          <Polyline
            positions={validRoutePoints}
            color="#D92332"
            weight={4}
            opacity={0.8}
            dashArray="8, 8"
          />
        )}
      </MapContainer>
    </div>
  );
};
