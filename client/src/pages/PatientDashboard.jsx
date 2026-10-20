import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Siren, 
  MapPin, 
  Clock, 
  Phone, 
  User, 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Calendar,
  Building2,
  RefreshCw,
  Navigation,
  ShieldCheck,
  Plus,
  Activity,
  HelpCircle
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { AmbulanceMap } from '../components/AmbulanceMap';
import { RequestAmbulanceModal } from '../components/RequestAmbulanceModal';
import { EmergencyGuideModal } from '../components/EmergencyGuideModal';
import { getStoredRequests, cancelStoredRequest } from '../utils/clientStorage';

export const PatientDashboard = () => {
  const { user, token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [cancelModalReq, setCancelModalReq] = useState(null);
  const [cancelReason, setCancelReason] = useState('Patient stabilized / alternative transport arranged');
  const [cancelling, setCancelling] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  // Fetch patient requests
  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      let loadedFromApi = false;

      try {
        const res = await fetch('/api/requests/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const data = await res.json();
          if (data.success) {
            setRequests(data.requests || []);
            loadedFromApi = true;
          }
        }
      } catch (e) {
        // API offline
      }

      if (!loadedFromApi) {
        const stored = getStoredRequests();
        const myRequests = stored.filter(r => r.patientId === user?._id || user?.role === 'patient');
        setRequests(myRequests.length > 0 ? myRequests : stored);
      }
    } catch (err) {
      console.warn('Patient fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMyRequests();
      // Poll every 8s for live updates
      const interval = setInterval(fetchMyRequests, 8000);
      return () => clearInterval(interval);
    }
  }, [token]);

  // Handle Request Cancellation
  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    if (!cancelModalReq) return;

    setCancelling(true);
    setActionMessage({ type: '', text: '' });

    try {
      let cancelled = false;

      try {
        const res = await fetch(`/api/requests/${cancelModalReq._id}/cancel`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ reason: cancelReason })
        });

        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const data = await res.json();
          if (data.success) {
            cancelled = true;
          }
        }
      } catch (networkErr) {
        // Fallback
      }

      if (!cancelled) {
        cancelStoredRequest(cancelModalReq._id, cancelReason);
      }

      setActionMessage({ type: 'success', text: 'Emergency ambulance request successfully cancelled.' });
      setCancelModalReq(null);
      fetchMyRequests();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message || 'Could not cancel request.' });
    } finally {
      setCancelling(false);
    }
  };

  // Find most recent active request
  const activeRequest = requests.find(r => 
    !['Completed', 'Cancelled'].includes(r.status)
  );

  const pastRequests = requests.filter(r => 
    ['Completed', 'Cancelled'].includes(r.status)
  );

  return (
    <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '85vh', padding: '2.5rem 0 4rem' }}>
      <div className="container">

        {/* Top Header & Greeting */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-accepted">Patient Emergency Terminal</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• Sector: Vellangallur, Kerala</span>
            </div>
            <h1 style={{ fontSize: '1.9rem', color: 'var(--secondary-navy)' }}>
              Welcome, {user?.name || 'Patient'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Manage your emergency medical transit requests and follow dispatched ambulances.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <Link
              to="/?section=how-it-works"
              className="btn btn-outline btn-sm"
              style={{ backgroundColor: 'white' }}
              title="Learn how ambulance dispatch workflow operates"
            >
              <HelpCircle size={15} />
              <span>How It Works</span>
            </Link>
            <button
              onClick={() => setGuideModalOpen(true)}
              className="btn btn-outline btn-sm"
              style={{ backgroundColor: 'white', color: 'var(--primary-red)', borderColor: 'var(--primary-red)' }}
              title="First aid guidance while ambulance is en route"
            >
              <Activity size={15} />
              <span>First Aid Guide</span>
            </button>
            <button
              onClick={fetchMyRequests}
              className="btn btn-outline btn-sm"
              style={{ backgroundColor: 'white' }}
              title="Refresh requests"
            >
              <RefreshCw size={15} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="btn btn-emergency"
              style={{ padding: '0.65rem 1.25rem' }}
            >
              <Plus size={18} />
              <span>Request an Ambulance</span>
            </button>
          </div>
        </div>

        {/* Action Message Banner */}
        {actionMessage.text && (
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            backgroundColor: actionMessage.type === 'success' ? '#D1FAE5' : '#FEE2E2',
            color: actionMessage.type === 'success' ? '#065F46' : '#991B1B',
            border: `1px solid ${actionMessage.type === 'success' ? '#A7F3D0' : '#FCA5A5'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {actionMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{actionMessage.text}</span>
          </div>
        )}

        {/* Active Emergency Request Panel (If Any) */}
        {activeRequest ? (
          <div className="card card-emergency" style={{ marginBottom: '2.5rem', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <h2 style={{ fontSize: '1.35rem', color: 'var(--secondary-navy)', margin: 0 }}>
                    Active Emergency Request #{activeRequest.requestId}
                  </h2>
                  <StatusBadge status={activeRequest.status} />
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Logged on {new Date(activeRequest.createdAt).toLocaleDateString()} at {new Date(activeRequest.createdAt).toLocaleTimeString()}
                </div>
              </div>

              {/* Action Buttons: Cancel and First Aid Guide */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  onClick={() => setGuideModalOpen(true)}
                  className="btn btn-outline btn-sm"
                  style={{ backgroundColor: 'white', borderColor: 'var(--primary-red)', color: 'var(--primary-red)' }}
                >
                  <Activity size={15} />
                  <span>While You Wait (First Aid)</span>
                </button>

                {['Pending', 'Accepted', 'Ambulance Assigned'].includes(activeRequest.status) && (
                  <button
                    onClick={() => setCancelModalReq(activeRequest)}
                    className="btn btn-outline-red btn-sm"
                  >
                    <XCircle size={15} />
                    <span>Cancel Request</span>
                  </button>
                )}
              </div>
            </div>

            {/* Split Grid: Details Left, Leaflet Map Right */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.3fr', gap: '1.5rem' }} className="active-req-grid">
              {/* Left: Dispatch & Crew Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                
                {/* Emergency Triage Category */}
                <div style={{ backgroundColor: 'var(--bg-light)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Triage & Medical Details
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
                    <AlertTriangle size={18} color="var(--primary-red)" />
                    <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--secondary-navy)' }}>
                      {activeRequest.emergencyType}
                    </span>
                    <span className="badge" style={{ backgroundColor: '#FEE2E2', color: '#991B1B', fontSize: '0.75rem' }}>
                      Priority: {activeRequest.priority || 'High'}
                    </span>
                  </div>
                  {activeRequest.description && (
                    <div style={{ fontSize: '0.85rem', color: '#4B5563', marginTop: '0.4rem', fontStyle: 'italic' }}>
                      "{activeRequest.description}"
                    </div>
                  )}
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                    Patients: <strong>{activeRequest.numberOfPatients || 1}</strong>
                  </div>
                </div>

                {/* Assigned Crew & Ambulance */}
                <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                    Assigned Unit & Driver
                  </div>
                  {activeRequest.assignedDriver ? (
                    <div style={{ marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#14532D' }}>
                            {activeRequest.assignedDriver.name}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: '#15803D' }}>
                            Vehicle: <strong>{activeRequest.assignedAmbulance?.vehicleNumber || 'Emergency Unit'}</strong> ({activeRequest.assignedAmbulance?.vehicleType || 'ALS'})
                          </div>
                        </div>
                        <a
                          href={`tel:${activeRequest.assignedDriver.phone}`}
                          className="btn btn-primary btn-sm"
                          style={{ gap: '0.3rem', backgroundColor: '#059669' }}
                        >
                          <Phone size={14} />
                          <span>Call Driver</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: '#854D0E', fontSize: '0.88rem', marginTop: '0.3rem' }}>
                      Connecting to nearest Vellangallur on-duty ambulance...
                    </div>
                  )}
                </div>

                {/* Pickup & Destination */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                    <MapPin size={18} color="var(--primary-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>PICKUP POINT</div>
                      <div style={{ fontSize: '0.92rem', color: 'var(--secondary-navy)', fontWeight: 600 }}>
                        {activeRequest.pickupLocation?.address || 'Vellangallur Central'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                    <Building2 size={18} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>DESTINATION HOSPITAL</div>
                      <div style={{ fontSize: '0.92rem', color: 'var(--secondary-navy)', fontWeight: 600 }}>
                        {activeRequest.destinationHospital?.name || 'Govt. CHC Vellangallur'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline History */}
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    Status Timeline
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderLeft: '2px solid var(--border-light)', paddingLeft: '0.75rem' }}>
                    {activeRequest.statusHistory?.map((step, idx) => (
                      <div key={idx} style={{ fontSize: '0.8rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--secondary-navy)' }}>{step.status}</span>
                        <span style={{ color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
                          ({new Date(step.timestamp).toLocaleTimeString()})
                        </span>
                        {step.note && <div style={{ color: '#6B7280', fontSize: '0.75rem' }}>{step.note}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Interactive Live Map */}
              <div>
                <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary-navy)' }}>
                    Live OpenStreetMap Location
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Vellangallur GPS Dispatch
                  </span>
                </div>
                <AmbulanceMap
                  center={[
                    Number(activeRequest?.pickupLocation?.latitude) || 10.2858,
                    Number(activeRequest?.pickupLocation?.longitude) || 76.2232
                  ]}
                  zoom={13}
                  patientLocation={{
                    address: activeRequest?.pickupLocation?.address || 'Vellangallur Central',
                    latitude: Number(activeRequest?.pickupLocation?.latitude) || 10.2858,
                    longitude: Number(activeRequest?.pickupLocation?.longitude) || 76.2232
                  }}
                  hospitalLocation={{
                    name: activeRequest?.destinationHospital?.name || 'Govt. Community Health Centre, Vellangallur',
                    address: activeRequest?.destinationHospital?.address || 'Vellangallur, Kerala',
                    latitude: Number(activeRequest?.destinationHospital?.latitude) || 10.2842,
                    longitude: Number(activeRequest?.destinationHospital?.longitude) || 76.2245
                  }}
                  ambulances={
                    activeRequest?.assignedAmbulance ? [{
                      _id: activeRequest.assignedAmbulance.id || 'assigned_amb',
                      vehicleNumber: activeRequest.assignedAmbulance.vehicleNumber || 'Emergency Unit',
                      vehicleType: activeRequest.assignedAmbulance.vehicleType || 'ALS',
                      status: activeRequest.status === 'Completed' ? 'Available' : 'On Duty',
                      location: {
                        latitude: Number(activeRequest.assignedAmbulance.latitude) || 10.2858,
                        longitude: Number(activeRequest.assignedAmbulance.longitude) || 76.2232
                      },
                      driverName: activeRequest.assignedDriver?.name || 'Standby Crew',
                      contactNumber: activeRequest.assignedDriver?.phone || ''
                    }] : []
                  }
                  showRoute={true}
                  height="380px"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Zero Active State Card */
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center', marginBottom: '2.5rem', backgroundColor: 'white' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary-navy)', marginBottom: '0.5rem' }}>
              No Active Emergency Requests
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
              You do not have any ongoing ambulance dispatches right now. In case of an emergency, click the button below or dial 108 immediately.
            </p>
            <button onClick={() => setModalOpen(true)} className="btn btn-emergency">
              <Siren size={18} />
              <span>Request an Ambulance</span>
            </button>
          </div>
        )}

        {/* Past Requests History Table */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary-navy)' }}>
                Your Emergency Request History
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Complete log of requested ambulances, timestamps, and transit outcomes
              </p>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Total: <strong>{requests.length}</strong>
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              Loading request records...
            </div>
          ) : requests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No previous emergency requests logged yet.
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Date & Time</th>
                    <th>Emergency Type</th>
                    <th>Pickup Location</th>
                    <th>Hospital</th>
                    <th>Assigned Driver</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req._id}>
                      <td style={{ fontWeight: 700, color: 'var(--secondary-navy)' }}>
                        #{req.requestId}
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>{new Date(req.createdAt).toLocaleDateString()}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(req.createdAt).toLocaleTimeString()}</div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{req.emergencyType}</span>
                      </td>
                      <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={req.pickupLocation?.address}>
                        {req.pickupLocation?.address || 'Vellangallur'}
                      </td>
                      <td>
                        {req.destinationHospital?.name || 'Govt CHC'}
                      </td>
                      <td>
                        {req.assignedDriver ? (
                          <div>
                            <div style={{ fontWeight: 600 }}>{req.assignedDriver.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.assignedAmbulance?.vehicleNumber}</div>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>
                        )}
                      </td>
                      <td>
                        <StatusBadge status={req.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Ambulance Request Modal */}
      <RequestAmbulanceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onRequestCreated={(newReq) => {
          fetchMyRequests();
          setModalOpen(false);
          setActionMessage({ type: 'success', text: `Ambulance request #${newReq.requestId} initiated successfully!` });
        }}
      />

      {/* Emergency First Aid Guidance Modal */}
      <EmergencyGuideModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
      />

      {/* Cancel Request Confirmation Modal */}
      {cancelModalReq && (
        <div className="modal-overlay" onClick={() => setCancelModalReq(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary-navy)', marginBottom: '0.5rem' }}>
              Cancel Ambulance Request #{cancelModalReq.requestId}?
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Are you sure you wish to cancel this emergency request? Drivers will be notified immediately to return to available standby.
            </p>

            <form onSubmit={handleCancelSubmit}>
              <div className="form-group">
                <label className="form-label">Reason for Cancellation</label>
                <select
                  className="form-select"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                >
                  <option value="Patient stabilized / alternative transport arranged">Patient stabilized / alternative transport arranged</option>
                  <option value="Direct private vehicle arranged">Direct private vehicle arranged</option>
                  <option value="Request created by mistake">Request created by mistake</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setCancelModalReq(null)}
                  className="btn btn-outline"
                >
                  Keep Request Active
                </button>
                <button
                  type="submit"
                  disabled={cancelling}
                  className="btn btn-outline-red"
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Responsive layout styling */}
      <style>{`
        @media (max-width: 850px) {
          .active-req-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
