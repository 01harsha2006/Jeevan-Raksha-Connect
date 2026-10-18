import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  MapPin, 
  Crosshair, 
  AlertTriangle, 
  Heart, 
  Baby, 
  Stethoscope, 
  Activity, 
  Building2,
  Users,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { playEmergencyTone } from '../utils/alertSound';
import { getStoredRequests, saveStoredRequests } from '../utils/clientStorage';

export const RequestAmbulanceModal = ({ isOpen, onClose, onRequestCreated }) => {
  const { user, token } = useAuth();

  const [patientName, setPatientName] = useState(user?.name || '');
  const [contactNumber, setContactNumber] = useState(user?.phone || '');
  const [pickupAddress, setPickupAddress] = useState('Vellangallur Main Junction, Kerala');
  const [pickupCoordinates, setPickupCoordinates] = useState({ latitude: 10.2858, longitude: 76.2232 });
  const [emergencyType, setEmergencyType] = useState('Medical emergency');
  const [description, setDescription] = useState('');
  const [numberOfPatients, setNumberOfPatients] = useState(1);
  const [selectedHospital, setSelectedHospital] = useState('Govt. Community Health Centre, Vellangallur');

  const [loadingLoc, setLoadingLoc] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  if (!isOpen) return null;

  // Vellangallur landmark presets
  const vellangallurLandmarks = [
    { name: 'Vellangallur Main Junction', lat: 10.2858, lng: 76.2232 },
    { name: 'Konathukunnu North Bypass', lat: 10.2715, lng: 76.2134 },
    { name: 'Vallivattom Centre Post', lat: 10.3012, lng: 76.2189 },
    { name: 'Nadavaramba Town', lat: 10.3150, lng: 76.2301 },
    { name: 'Poomangalam Junction', lat: 10.2940, lng: 76.2410 }
  ];

  // Geolocation detection
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoadingLoc(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPickupCoordinates({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setPickupAddress(`GPS Coords: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (Vellangallur vicinity)`);
        setLoadingLoc(false);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setError('Location permission denied or unavailable. You can choose a landmark or type an address below.');
        setLoadingLoc(false);
      },
      { timeout: 8000 }
    );
  };

  const handleLandmarkSelect = (e) => {
    const selected = vellangallurLandmarks.find(l => l.name === e.target.value);
    if (selected) {
      setPickupAddress(selected.name);
      setPickupCoordinates({ latitude: selected.lat, longitude: selected.lng });
    }
  };

  const emergencyOptions = [
    { type: 'Cardiac emergency', icon: Heart, color: '#DC2626', desc: 'Heart attack, chest pain, palpitations' },
    { type: 'Accident', icon: AlertTriangle, color: '#EA580C', desc: 'Road collision, trauma, falls' },
    { type: 'Pregnancy-related emergency', icon: Baby, color: '#D946EF', desc: 'Active labor, complications' },
    { type: 'Medical emergency', icon: Activity, color: '#2563EB', desc: 'Stroke, breathlessness, seizure' },
    { type: 'Other', icon: Stethoscope, color: '#4B5563', desc: 'General acute transport' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!patientName.trim()) {
      setError('Please provide patient name.');
      return;
    }
    if (!contactNumber.trim()) {
      setError('Please enter an emergency contact phone number.');
      return;
    }
    if (!pickupAddress.trim()) {
      setError('Please specify pickup address or landmark.');
      return;
    }

    setSubmitting(true);
    try {
      const hospitalCoordMap = {
        'Govt. Community Health Centre, Vellangallur': { lat: 10.2842, lng: 76.2245, addr: 'Vellangallur - Kodungallur Road, Vellangallur' },
        'Taluk Headquarters Hospital, Irinjalakuda': { lat: 10.3427, lng: 76.2089, addr: 'Civil Station Road, Irinjalakuda' },
        'Modern Hospital, Kodungallur': { lat: 10.2277, lng: 76.1970, addr: 'NH 66, Kodungallur' },
        'St. James Hospital, Chalakudy': { lat: 10.3070, lng: 76.3330, addr: 'South Chalakudy' },
        'Craft Hospital & Research Centre': { lat: 10.2185, lng: 76.2014, addr: 'Chandapura, Kodungallur' },
        'Jubilee Mission Medical College & Hospital': { lat: 10.5218, lng: 76.2235, addr: 'East Fort, Thrissur' },
        'Nearest Available Hospital': { lat: 10.2842, lng: 76.2245, addr: 'Nearest Emergency Care Post' }
      };
      const hInfo = hospitalCoordMap[selectedHospital] || hospitalCoordMap['Govt. Community Health Centre, Vellangallur'];

      const payload = {
        patientName,
        contactNumber,
        pickupLocation: {
          address: pickupAddress || 'Vellangallur Main Junction, Kerala',
          latitude: Number(pickupCoordinates.latitude) || 10.2858,
          longitude: Number(pickupCoordinates.longitude) || 76.2232,
        },
        destinationHospital: {
          name: selectedHospital,
          address: hInfo.addr,
          latitude: hInfo.lat,
          longitude: hInfo.lng,
        },
        emergencyType,
        description,
        numberOfPatients: Number(numberOfPatients),
        priority: emergencyType === 'Cardiac emergency' ? 'Critical' : 'High'
      };

      try {
        const res = await fetch('/api/requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const data = await res.json();
          if (data.success) {
            playEmergencyTone();
            setSuccess(data.request);
            return;
          }
        }
        throw new Error('API offline, saving to client emergency store');
      } catch (networkErr) {
        // Fallback for GitHub Pages / offline mode
        const storedReqs = getStoredRequests();
        const newReq = {
          _id: 'req_' + Date.now(),
          requestId: `JR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          patientId: user?._id || 'usr_patient_demo',
          ...payload,
          status: 'Pending',
          createdAt: new Date().toISOString(),
          statusHistory: [
            { status: 'Pending', timestamp: new Date().toISOString(), note: 'Emergency dispatch triggered' }
          ]
        };
        storedReqs.unshift(newReq);
        saveStoredRequests(storedReqs);

        playEmergencyTone();
        setSuccess(newReq);
      }
    } catch (err) {
      setError(err.message || 'Error processing emergency request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ padding: '0.4rem', backgroundColor: 'var(--primary-red-light)', borderRadius: '8px', color: 'var(--primary-red)' }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary-navy)', margin: 0 }}>
                Request an Emergency Ambulance
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Vellangallur Emergency Medical Response Hub
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', padding: '0.4rem', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Success View */}
        {success ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--secondary-navy)', marginBottom: '0.5rem' }}>
              Ambulance Request Dispatched!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
              Your emergency request <strong>#{success.requestId}</strong> has been logged.
              {success.assignedDriver ? (
                <span> Assigned to driver <strong>{success.assignedDriver.name}</strong> ({success.assignedAmbulance?.vehicleNumber}).</span>
              ) : (
                <span> Dispatchers are routing the nearest unit immediately.</span>
              )}
            </p>

            <div style={{ backgroundColor: 'var(--bg-light)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'left', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
              <div><strong>Status:</strong> {success.status}</div>
              <div><strong>Emergency Type:</strong> {success.emergencyType}</div>
              <div><strong>Pickup Location:</strong> {success.pickupLocation?.address}</div>
              <div><strong>Destination:</strong> {success.destinationHospital?.name}</div>
            </div>

            <button
              onClick={() => {
                const req = success;
                setSuccess(null);
                onClose();
                if (onRequestCreated) {
                  onRequestCreated(req);
                }
              }}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              Go to Live Tracking & Map →
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            {/* Emergency Type Selector */}
            <div className="form-group">
              <label className="form-label">Emergency Category *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
                {emergencyOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = emergencyType === opt.type;
                  return (
                    <button
                      type="button"
                      key={opt.type}
                      onClick={() => setEmergencyType(opt.type)}
                      style={{
                        padding: '0.65rem 0.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? `2px solid ${opt.color}` : '1.5px solid var(--border-light)',
                        backgroundColor: isSelected ? 'var(--bg-white)' : 'var(--bg-light)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.35rem',
                        textAlign: 'center',
                        boxShadow: isSelected ? `0 0 0 2px ${opt.color}22` : 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <Icon size={20} color={opt.color} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--secondary-navy)' }}>
                        {opt.type.replace(' emergency', '').replace('-related', '')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Patient & Contact Info */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Patient Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Rahul Menon"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone Number *</label>
                <input
                  type="tel"
                  className="form-input"
                  required
                  placeholder="e.g. +91 94471 23456"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                />
              </div>
            </div>

            {/* Location & Geolocation */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Pickup Address / Landmark *</label>
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={loadingLoc}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    background: 'none',
                    color: 'var(--primary-red)',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  <Crosshair size={14} />
                  <span>{loadingLoc ? 'Detecting GPS...' : 'Detect GPS Location'}</span>
                </button>
              </div>

              <input
                type="text"
                className="form-input"
                required
                placeholder="Enter street, landmark or junction in Vellangallur"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
              />

              {/* Quick Vellangallur Landmark Dropdown */}
              <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Or choose landmark:</span>
                <select
                  className="form-select"
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', width: 'auto' }}
                  onChange={handleLandmarkSelect}
                  defaultValue=""
                >
                  <option value="" disabled>Select Vellangallur area...</option>
                  {vellangallurLandmarks.map((lm) => (
                    <option key={lm.name} value={lm.name}>{lm.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Destination Hospital */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Destination Hospital (Optional)</label>
                <select
                  className="form-select"
                  value={selectedHospital}
                  onChange={(e) => setSelectedHospital(e.target.value)}
                >
                  <option value="Govt. Community Health Centre, Vellangallur">Govt. CHC Vellangallur (Local)</option>
                  <option value="Taluk Headquarters Hospital, Irinjalakuda">Taluk Hospital, Irinjalakuda</option>
                  <option value="Modern Hospital, Kodungallur">Modern Hospital, Kodungallur</option>
                  <option value="St. James Hospital, Chalakudy">St. James Hospital, Chalakudy</option>
                  <option value="Craft Hospital & Research Centre">Craft Hospital, Kodungallur</option>
                  <option value="Jubilee Mission Medical College & Hospital">Jubilee Mission Hospital, Thrissur</option>
                  <option value="Nearest Available Hospital">Nearest Available Emergency Center</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Number of Patients</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  className="form-input"
                  value={numberOfPatients}
                  onChange={(e) => setNumberOfPatients(e.target.value)}
                />
              </div>
            </div>

            {/* Emergency Description */}
            <div className="form-group">
              <label className="form-label">Short Description of Condition (Optional)</label>
              <textarea
                className="form-textarea"
                rows="2"
                placeholder="Mention symptoms (e.g. unconscious, severe bleeding, difficulty breathing, injury)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-emergency"
                disabled={submitting}
                style={{ minWidth: '180px' }}
              >
                {submitting ? 'Dispatching...' : '🚨 Request Ambulance Now'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
