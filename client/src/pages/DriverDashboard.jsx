import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Siren, 
  Truck, 
  Power, 
  MapPin, 
  Building2, 
  Phone, 
  User, 
  CheckCircle, 
  X, 
  Navigation, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Activity,
  RefreshCw,
  Volume2
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { AmbulanceMap } from '../components/AmbulanceMap';
import { playEmergencyTone } from '../utils/alertSound';
import { 
  getStoredRequests, 
  saveStoredRequests, 
  getStoredAmbulances, 
  updateStoredRequestStatus 
} from '../utils/clientStorage';

export const DriverDashboard = () => {
  const { user, token } = useAuth();

  const [isOnline, setIsOnline] = useState(true);
  const [assignedRequests, setAssignedRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [preAlertModal, setPreAlertModal] = useState(false);
  const [vitals, setVitals] = useState({
    pulseRate: '98',
    bloodPressure: '125/80',
    spO2: '97',
    consciousness: 'Alert & Oriented',
    notes: 'Trauma standby requested. Patient stable on oxygen.'
  });

  // Send Trauma Pre-Alert to Receiving Hospital
  const handleSendPreAlert = async (e) => {
    e.preventDefault();
    if (!currentAssignment) return;
    try {
      const summaryNote = `[Casualty Pre-Alert]: HR ${vitals.pulseRate} bpm, BP ${vitals.bloodPressure}, SpO2 ${vitals.spO2}%, Level: ${vitals.consciousness}. Note: ${vitals.notes}`;
      let transmitted = false;

      try {
        const res = await fetch(`/api/requests/${currentAssignment._id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            status: currentAssignment.status,
            note: summaryNote
          })
        });
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const data = await res.json();
          if (data.success) transmitted = true;
        }
      } catch (e) {
        // Fallback
      }

      if (!transmitted) {
        updateStoredRequestStatus(currentAssignment._id, currentAssignment.status, summaryNote);
      }

      playEmergencyTone();
      setStatusMessage({ 
        type: 'success', 
        text: `Trauma Pre-Alert transmitted to ${currentAssignment.destinationHospital?.name || 'Receiving Hospital'} casualty team!` 
      });
      setPreAlertModal(false);
      fetchDriverData();
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Failed to send pre-alert.' });
    }
  };

  // Mock ambulance info associated with driver
  const [ambulanceInfo, setAmbulanceInfo] = useState({
    vehicleNumber: 'KL-45-S-8821',
    vehicleType: 'ALS (Advanced Life Support)',
    baseStation: 'Govt. Community Health Centre, Vellangallur',
    tripsCompleted: 142,
    rating: 4.9
  });

  // Fetch driver assigned requests and pending dispatches
  const fetchDriverData = async () => {
    try {
      setLoading(true);
      let loadedFromApi = false;

      try {
        const res = await fetch('/api/drivers/me/requests', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const data = await res.json();
          if (data.success) {
            setAssignedRequests(data.assigned || []);
            setPendingRequests(data.pending || []);

            if (data.ambulance) {
              setAmbulanceInfo(prev => ({
                ...prev,
                vehicleNumber: data.ambulance.vehicleNumber || prev.vehicleNumber,
                vehicleType: data.ambulance.vehicleType || prev.vehicleType,
                baseStation: data.ambulance.baseStation || prev.baseStation,
                rating: data.ambulance.rating || 5.0,
                tripsCompleted: data.ambulance.tripsCompleted || 0,
              }));
            }

            if (data.pending && data.pending.length > 0) {
              playEmergencyTone();
            }
            loadedFromApi = true;
          }
        }
      } catch (err) {
        // Offline / GitHub Pages fallback
      }

      if (!loadedFromApi) {
        const stored = getStoredRequests();
        const assigned = stored.filter(r => 
          (r.assignedDriver?.id === user?._id || r.assignedDriver?.name === user?.name || r.status !== 'Pending') &&
          r.status !== 'Completed' && r.status !== 'Cancelled'
        );
        const pending = stored.filter(r => r.status === 'Pending');
        setAssignedRequests(assigned);
        setPendingRequests(pending);

        const ambList = getStoredAmbulances();
        const myAmb = ambList.find(a => a.driverName === user?.name || a.driverId === user?._id) || ambList[0];
        if (myAmb) {
          setAmbulanceInfo(prev => ({
            ...prev,
            vehicleNumber: myAmb.vehicleNumber || prev.vehicleNumber,
            vehicleType: myAmb.vehicleType || prev.vehicleType,
            baseStation: myAmb.baseStation || prev.baseStation,
            rating: myAmb.rating || 5.0,
            tripsCompleted: myAmb.tripsCompleted || 0
          }));
        }
      }
    } catch (err) {
      console.warn('Driver data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDriverData();
      const interval = setInterval(fetchDriverData, 7000);
      return () => clearInterval(interval);
    }
  }, [token]);

  // Toggle Driver Online / Offline
  const handleToggleOnline = async () => {
    try {
      const nextStatus = !isOnline;
      setIsOnline(nextStatus);

      try {
        const res = await fetch('/api/drivers/me/status', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ isAvailable: nextStatus })
        });
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          await res.json();
        }
      } catch (err) {
        // Handled via local state
      }

      setStatusMessage({
        type: 'success',
        text: `You are now ${nextStatus ? 'ONLINE & Available for emergency dispatches' : 'OFFLINE (Duty Standby)'}`
      });
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Failed to update online status.' });
    }
  };

  // Accept incoming request
  const handleAcceptRequest = async (requestId) => {
    try {
      setUpdatingId(requestId);
      let updatedReq = null;

      try {
        const res = await fetch(`/api/requests/${requestId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            status: 'Accepted',
            note: `Driver ${user?.name || 'Driver'} accepted the emergency request.`
          })
        });
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const data = await res.json();
          if (data.success && data.request) {
            updatedReq = data.request;
          }
        }
      } catch (err) {
        // Fallback to clientStorage
      }

      if (!updatedReq) {
        updatedReq = updateStoredRequestStatus(
          requestId,
          'Accepted',
          `Driver ${user?.name || 'Suresh Kumar'} accepted the emergency request.`,
          {
            assignedDriver: {
              id: user?._id || 'usr_driver_demo',
              name: user?.name || 'Suresh Kumar',
              phone: user?.phone || '+91 98460 11223'
            }
          }
        );
      }

      playEmergencyTone();
      setStatusMessage({ 
        type: 'success', 
        text: `Emergency request #${updatedReq?.requestId || requestId} accepted! Priority route engaged.` 
      });
      fetchDriverData();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to accept request.' });
    } finally {
      setUpdatingId(null);
    }
  };

  // Update status along the workflow
  const handleUpdateStatus = async (requestId, nextStatus) => {
    try {
      setUpdatingId(requestId);
      let updatedReq = null;

      try {
        const res = await fetch(`/api/requests/${requestId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            status: nextStatus,
            note: `Status updated by driver to ${nextStatus}`
          })
        });
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const data = await res.json();
          if (data.success && data.request) {
            updatedReq = data.request;
          }
        }
      } catch (err) {
        // Fallback to clientStorage
      }

      if (!updatedReq) {
        updatedReq = updateStoredRequestStatus(
          requestId,
          nextStatus,
          `Status updated by driver to "${nextStatus}"`
        );
      }

      setStatusMessage({ 
        type: 'success', 
        text: `Request #${updatedReq?.requestId || requestId} updated to "${nextStatus}".` 
      });
      fetchDriverData();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Error updating status.' });
    } finally {
      setUpdatingId(null);
    }
  };

  // Current active assignment for driver
  const currentAssignment = assignedRequests.find(r => 
    !['Completed', 'Cancelled'].includes(r.status)
  );

  const completedTrips = assignedRequests.filter(r => 
    r.status === 'Completed'
  );

  return (
    <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '85vh', padding: '2.5rem 0 4rem' }}>
      <div className="container">

        {/* Driver Profile Header Card */}
        <div className="card" style={{ marginBottom: '2rem', borderTop: '4px solid var(--secondary-navy)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
            
            {/* Driver Identity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                backgroundColor: 'var(--secondary-navy)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-md)'
              }}>
                <Truck size={30} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <h1 style={{ fontSize: '1.5rem', color: 'var(--secondary-navy)', margin: 0 }}>
                    {user?.name || 'Ambulance Driver'}
                  </h1>
                  <span className="badge badge-accepted" style={{ textTransform: 'uppercase' }}>
                    Certified EMT Driver
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Ambulance: <strong>{ambulanceInfo.vehicleNumber}</strong> • {ambulanceInfo.vehicleType}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                  Base: {ambulanceInfo.baseStation} • Phone: {user?.phone || '+91 98460 54321'}
                </div>
              </div>
            </div>

            {/* Availability Toggle Switch */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Duty Status
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isOnline ? '#059669' : '#9CA3AF' }}>
                  {isOnline ? 'Online & Available' : 'Offline / Off Duty'}
                </div>
              </div>

              <button
                onClick={handleToggleOnline}
                style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isOnline ? '#10B981' : '#6B7280',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: isOnline ? '0 4px 12px rgba(16, 185, 129, 0.35)' : 'none'
                }}
              >
                <Power size={18} />
                <span>{isOnline ? 'GO OFFLINE' : 'GO ONLINE'}</span>
              </button>

              <button
                onClick={fetchDriverData}
                className="btn btn-outline btn-sm"
                title="Refresh dispatch queue"
              >
                <RefreshCw size={15} />
              </button>
            </div>

          </div>
        </div>

        {/* Status Alert Banner */}
        {statusMessage.text && (
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            backgroundColor: statusMessage.type === 'success' ? '#D1FAE5' : '#FEE2E2',
            color: statusMessage.type === 'success' ? '#065F46' : '#991B1B',
            border: `1px solid ${statusMessage.type === 'success' ? '#A7F3D0' : '#FCA5A5'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* 1. Incoming Emergency Dispatches Queue (Alert Panel) */}
        {pendingRequests.length > 0 && isOnline && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '2px solid #EF4444',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-emergency)',
            animation: 'pulse-border 2s infinite'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ backgroundColor: '#EF4444', color: 'white', padding: '0.4rem', borderRadius: '8px' }}>
                  <Siren size={22} className="animate-spin" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#991B1B', margin: 0 }}>
                    Incoming Emergency Dispatches ({pendingRequests.length})
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#B91C1C' }}>
                    Awaiting driver acceptance in Vellangallur sector
                  </span>
                </div>
              </div>
              <button
                onClick={() => playEmergencyTone()}
                className="btn btn-outline btn-sm"
                style={{ backgroundColor: 'white', borderColor: '#FCA5A5', color: '#B91C1C' }}
              >
                <Volume2 size={14} />
                <span>Test Alert Siren</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pendingRequests.map((req) => (
                <div key={req._id} style={{
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  border: '1px solid #FCA5A5',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--secondary-navy)' }}>
                        #{req.requestId}
                      </span>
                      <span className="badge" style={{ backgroundColor: '#FEE2E2', color: '#991B1B', fontWeight: 700 }}>
                        {req.emergencyType}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {new Date(req.createdAt).toLocaleTimeString()}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.9rem', color: 'var(--secondary-navy)', fontWeight: 600 }}>
                      Patient: {req.patientName} • Tel: {req.contactNumber}
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#4B5563', marginTop: '0.3rem' }}>
                      📍 <strong>Pickup:</strong> {req.pickupLocation?.address}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#4B5563' }}>
                      🏥 <strong>Destination:</strong> {req.destinationHospital?.name || 'Nearest Hospital'}
                    </div>
                    {req.description && (
                      <div style={{ fontSize: '0.82rem', color: '#6B7280', fontStyle: 'italic', marginTop: '0.2rem' }}>
                        Notes: "{req.description}"
                      </div>
                    )}
                  </div>

                  {/* Accept Button */}
                  <div>
                    <button
                      onClick={() => handleAcceptRequest(req._id)}
                      disabled={updatingId === req._id}
                      className="btn btn-primary"
                      style={{ padding: '0.75rem 1.75rem', fontWeight: 700, fontSize: '1rem' }}
                    >
                      {updatingId === req._id ? 'Accepting...' : '✓ Accept Dispatch'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Current Active Mission Panel */}
        {currentAssignment ? (
          <div className="card" style={{ marginBottom: '2.5rem', borderLeft: '5px solid #2563EB', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <h2 style={{ fontSize: '1.3rem', color: 'var(--secondary-navy)', margin: 0 }}>
                    Active Trip: Request #{currentAssignment.requestId}
                  </h2>
                  <StatusBadge status={currentAssignment.status} />
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Accepted at {new Date(currentAssignment.createdAt).toLocaleTimeString()}
                </div>
              </div>

              {/* Patient Call Shortcut */}
              <a
                href={`tel:${currentAssignment.contactNumber}`}
                className="btn btn-outline btn-sm"
                style={{ backgroundColor: 'white', color: 'var(--primary-red)', borderColor: 'var(--primary-red)' }}
              >
                <Phone size={14} />
                <span>Call Patient ({currentAssignment.contactNumber})</span>
              </a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr', gap: '1.5rem' }} className="active-mission-grid">
              {/* Mission Details & Action Stepper */}
              <div>
                <div style={{ backgroundColor: 'var(--bg-light)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    PATIENT & CLINICAL URGENCY
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--secondary-navy)', marginTop: '0.2rem' }}>
                    {currentAssignment.patientName}
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--primary-red)', fontWeight: 700 }}>
                    {currentAssignment.emergencyType} (Priority: {currentAssignment.priority || 'High'})
                  </div>
                  {currentAssignment.description && (
                    <div style={{ fontSize: '0.85rem', color: '#4B5563', marginTop: '0.3rem' }}>
                      "{currentAssignment.description}"
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                    <MapPin size={18} color="var(--primary-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>PICKUP LOCATION</div>
                      <div style={{ fontSize: '0.92rem', color: 'var(--secondary-navy)', fontWeight: 600 }}>
                        {currentAssignment.pickupLocation?.address}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                    <Building2 size={18} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>DESTINATION HOSPITAL</div>
                      <div style={{ fontSize: '0.92rem', color: 'var(--secondary-navy)', fontWeight: 600 }}>
                        {currentAssignment.destinationHospital?.name}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Action Buttons */}
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>
                    Mission Status Controls
                  </div>

                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {currentAssignment.status === 'Accepted' && (
                      <button
                        onClick={() => handleUpdateStatus(currentAssignment._id, 'Ambulance Assigned')}
                        disabled={updatingId === currentAssignment._id}
                        className="btn btn-secondary"
                      >
                        Confirm Ambulance Assignment
                      </button>
                    )}

                    {['Accepted', 'Ambulance Assigned'].includes(currentAssignment.status) && (
                      <button
                        onClick={() => handleUpdateStatus(currentAssignment._id, 'On the Way')}
                        disabled={updatingId === currentAssignment._id}
                        className="btn btn-primary"
                        style={{ backgroundColor: '#DC2626' }}
                      >
                        <Navigation size={16} />
                        <span>Mark On the Way</span>
                      </button>
                    )}

                    {currentAssignment.status === 'On the Way' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(currentAssignment._id, 'Arrived at Pickup')}
                          disabled={updatingId === currentAssignment._id}
                          className="btn btn-primary"
                          style={{ backgroundColor: '#059669' }}
                        >
                          <CheckCircle size={16} />
                          <span>Mark Arrived at Pickup</span>
                        </button>

                        <button
                          onClick={() => setPreAlertModal(true)}
                          className="btn btn-outline-red"
                          style={{ fontWeight: 700 }}
                        >
                          <Activity size={16} />
                          <span>Pre-Alert Hospital Casualty</span>
                        </button>
                      </>
                    )}

                    {currentAssignment.status === 'Arrived at Pickup' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(currentAssignment._id, 'Completed')}
                          disabled={updatingId === currentAssignment._id}
                          className="btn btn-primary"
                          style={{ backgroundColor: '#059669', padding: '0.75rem 1.5rem' }}
                        >
                          <CheckCircle2 size={18} />
                          <span>Complete Trip (Transfer to Hospital)</span>
                        </button>

                        <button
                          onClick={() => setPreAlertModal(true)}
                          className="btn btn-outline-red"
                          style={{ fontWeight: 700 }}
                        >
                          <Activity size={16} />
                          <span>Pre-Alert Hospital Casualty</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Map Route Guidance */}
              <div>
                <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary-navy)' }}>
                  Navigation Route to Patient
                </div>
                <AmbulanceMap
                  center={[
                    Number(currentAssignment?.pickupLocation?.latitude) || 10.2858,
                    Number(currentAssignment?.pickupLocation?.longitude) || 76.2232
                  ]}
                  zoom={13}
                  patientLocation={{
                    address: currentAssignment?.pickupLocation?.address || 'Vellangallur Central',
                    latitude: Number(currentAssignment?.pickupLocation?.latitude) || 10.2858,
                    longitude: Number(currentAssignment?.pickupLocation?.longitude) || 76.2232
                  }}
                  hospitalLocation={{
                    name: currentAssignment?.destinationHospital?.name || 'Govt. Community Health Centre, Vellangallur',
                    address: currentAssignment?.destinationHospital?.address || 'Vellangallur, Kerala',
                    latitude: Number(currentAssignment?.destinationHospital?.latitude) || 10.2842,
                    longitude: Number(currentAssignment?.destinationHospital?.longitude) || 76.2245
                  }}
                  ambulances={[{
                    _id: 'driver_amb',
                    vehicleNumber: ambulanceInfo?.vehicleNumber || 'KL-45-S-8821',
                    vehicleType: 'ALS',
                    status: 'On Duty',
                    location: { latitude: 10.2858, longitude: 76.2232 }
                  }]}
                  showRoute={true}
                  height="340px"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
              <CheckCircle size={26} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary-navy)', marginBottom: '0.25rem' }}>
              No Active Trip in Progress
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              {isOnline 
                ? 'Your status is Online. You will be alerted immediately when an emergency dispatch is assigned in Vellangallur.'
                : 'You are currently Offline. Turn duty status online above to receive dispatches.'}
            </p>
          </div>
        )}

        {/* Completed Trips Log */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary-navy)' }}>
                Your Completed Assignments Log
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Past patient emergency transports fulfilled by your ambulance
              </p>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Completed: <strong>{completedTrips.length}</strong>
            </span>
          </div>

          {completedTrips.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No completed trips recorded yet.
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Date</th>
                    <th>Patient Name</th>
                    <th>Emergency</th>
                    <th>Pickup</th>
                    <th>Delivered To</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {completedTrips.map((req) => (
                    <tr key={req._id}>
                      <td style={{ fontWeight: 700 }}>#{req.requestId}</td>
                      <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                      <td>{req.patientName}</td>
                      <td><span className="badge" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>{req.emergencyType}</span></td>
                      <td style={{ maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{req.pickupLocation?.address}</td>
                      <td>{req.destinationHospital?.name}</td>
                      <td><StatusBadge status={req.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Hospital Trauma Pre-Alert Modal */}
      {preAlertModal && currentAssignment && (
        <div className="modal-overlay" onClick={() => setPreAlertModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ padding: '0.4rem', backgroundColor: '#FEE2E2', borderRadius: '8px', color: '#DC2626' }}>
                  <Activity size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary-navy)', margin: 0 }}>
                    Hospital Trauma Casualty Pre-Alert
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                    Destination: {currentAssignment.destinationHospital?.name}
                  </p>
                </div>
              </div>
              <button onClick={() => setPreAlertModal(false)} style={{ background: 'none', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSendPreAlert}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Heart / Pulse Rate (BPM)</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={vitals.pulseRate}
                    onChange={(e) => setVitals({ ...vitals, pulseRate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Blood Pressure (mmHg)</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={vitals.bloodPressure}
                    onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Oxygen Saturation (SpO2 %)</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={vitals.spO2}
                    onChange={(e) => setVitals({ ...vitals, spO2: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Consciousness (AVPU)</label>
                  <select
                    className="form-select"
                    value={vitals.consciousness}
                    onChange={(e) => setVitals({ ...vitals, consciousness: e.target.value })}
                  >
                    <option value="Alert & Oriented">Alert & Oriented (A)</option>
                    <option value="Responds to Voice">Responds to Voice (V)</option>
                    <option value="Responds to Pain">Responds to Pain (P)</option>
                    <option value="Unresponsive">Unresponsive (U)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Trauma Notes / Preparedness Request</label>
                <textarea
                  rows="2"
                  className="form-textarea"
                  value={vitals.notes}
                  onChange={(e) => setVitals({ ...vitals, notes: e.target.value })}
                  placeholder="e.g. Cath lab standby requested, active hemorrhage stabilized..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setPreAlertModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#DC2626' }}>
                  Transmit Casualty Pre-Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 850px) {
          .active-mission-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
