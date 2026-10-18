import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Users, 
  Truck, 
  Siren, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  RefreshCw, 
  UserPlus, 
  AlertTriangle,
  Building2,
  Activity,
  Plus,
  Phone,
  Check,
  Send
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { AmbulanceMap } from '../components/AmbulanceMap';

export const AdminDashboard = () => {
  const { user, token } = useAuth();

  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'drivers' | 'ambulances' | 'users'
  const [dashboardData, setDashboardData] = useState(null);
  const [requests, setRequests] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Dispatch Assignment Modal
  const [assignModalReq, setAssignModalReq] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState('');
  const [assigning, setAssigning] = useState(false);

  // Add Ambulance Modal
  const [addAmbModalOpen, setAddAmbModalOpen] = useState(false);
  const [newAmbForm, setNewAmbForm] = useState({
    vehicleNumber: '',
    vehicleType: 'BLS',
    baseStation: 'Vellangallur Community Health Centre',
    contactNumber: '+91 94470 12345',
    equipment: 'Oxygen Support, First Aid Kit, Foldable Stretcher'
  });

  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Fetch admin dashboard data
  const fetchAllAdminData = async () => {
    try {
      setLoading(true);
      const [dashRes, reqsRes, driversRes, ambRes, usersRes] = await Promise.all([
        fetch('/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/requests', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/drivers', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/ambulances'),
        fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const [dashData, reqsData, driversData, ambData, usersData] = await Promise.all([
        dashRes.json(),
        reqsRes.json(),
        driversRes.json(),
        ambRes.json(),
        usersRes.json(),
      ]);

      if (dashData.success) setDashboardData(dashData);
      if (reqsData.success) setRequests(reqsData.requests || []);
      if (driversData.success) setDrivers(driversData.drivers || []);
      if (ambData.success) setAmbulances(ambData.ambulances || []);
      if (usersData.success) setUsersList(usersData.users || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllAdminData();
    }
  }, [token]);

  // Handle Manual Dispatch Assignment
  const handleAssignDispatch = async (e) => {
    e.preventDefault();
    if (!assignModalReq || !selectedDriverId || !selectedAmbulanceId) return;

    setAssigning(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const res = await fetch(`/api/admin/requests/${assignModalReq._id}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          driverId: selectedDriverId,
          ambulanceId: selectedAmbulanceId
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Assignment failed.');
      }

      setStatusMsg({ type: 'success', text: `Ambulance assigned successfully to request #${assignModalReq.requestId}` });
      setAssignModalReq(null);
      fetchAllAdminData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setAssigning(false);
    }
  };

  // Handle Add Ambulance
  const handleAddAmbulance = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/ambulances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newAmbForm,
          equipment: newAmbForm.equipment.split(',').map(s => s.trim()),
          location: { latitude: 10.2858, longitude: 76.2232, address: newAmbForm.baseStation }
        })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: `Ambulance ${data.ambulance.vehicleNumber} registered into emergency fleet.` });
        setAddAmbModalOpen(false);
        setNewAmbForm({
          vehicleNumber: '',
          vehicleType: 'BLS',
          baseStation: 'Vellangallur Community Health Centre',
          contactNumber: '+91 94470 12345',
          equipment: 'Oxygen Support, First Aid Kit, Foldable Stretcher'
        });
        fetchAllAdminData();
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (typeFilter !== 'ALL' && r.emergencyType !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = r.requestId?.toLowerCase().includes(q);
      const matchName = r.patientName?.toLowerCase().includes(q);
      const matchAddress = r.pickupLocation?.address?.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchAddress) return false;
    }
    return true;
  });

  const stats = dashboardData?.stats || {
    totalRequests: requests.length,
    pendingRequests: requests.filter(r => r.status === 'Pending').length,
    activeRequests: requests.filter(r => ['Accepted', 'Ambulance Assigned', 'On the Way', 'Arrived at Pickup'].includes(r.status)).length,
    completedRequests: requests.filter(r => r.status === 'Completed').length,
    cancelledRequests: requests.filter(r => r.status === 'Cancelled').length,
    totalDrivers: drivers.length,
    availableAmbulances: ambulances.filter(a => a.status === 'Available').length,
    totalAmbulances: ambulances.length
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '85vh', padding: '2.5rem 0 4rem' }}>
      <div className="container">

        {/* Header & Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-assigned">Admin Command & Dispatch Desk</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• Central Emergency Network, Kerala</span>
            </div>
            <h1 style={{ fontSize: '1.9rem', color: 'var(--secondary-navy)' }}>
              Emergency Dispatch Administration
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Real-time dispatch coordination, driver management, and fleet monitoring for Vellangallur sector.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              onClick={fetchAllAdminData}
              className="btn btn-outline btn-sm"
              style={{ backgroundColor: 'white' }}
              title="Refresh all records"
            >
              <RefreshCw size={15} />
              <span>Refresh Desk</span>
            </button>
            <button
              onClick={() => setAddAmbModalOpen(true)}
              className="btn btn-secondary btn-sm"
            >
              <Plus size={15} />
              <span>Register Ambulance</span>
            </button>
          </div>
        </div>

        {/* Demo Data Disclaimer Badge */}
        <div style={{
          backgroundColor: '#EFF6FF',
          border: '1px solid #BFDBFE',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          marginBottom: '1.75rem',
          fontSize: '0.85rem',
          color: '#1E40AF',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <ShieldCheck size={18} />
          <span>
            <strong>Evaluation Environment:</strong> Live operational simulation with Vellangallur district coordinates. Sample emergency entries are clearly identified by request IDs (JR-2026-XXXX).
          </span>
        </div>

        {/* Status Message */}
        {statusMsg.text && (
          <div style={{
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            backgroundColor: statusMsg.type === 'success' ? '#D1FAE5' : '#FEE2E2',
            color: statusMsg.type === 'success' ? '#065F46' : '#991B1B',
            border: `1px solid ${statusMsg.type === 'success' ? '#A7F3D0' : '#FCA5A5'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {statusMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* KPI Summary Cards */}
        <div className="grid-4" style={{ marginBottom: '2rem' }}>
          {/* Total Requests */}
          <div className="card" style={{ borderLeft: '4px solid var(--secondary-navy)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Total Requests
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary-navy)', marginTop: '0.2rem' }}>
                  {stats.totalRequests}
                </div>
              </div>
              <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-light)', borderRadius: '8px', color: 'var(--secondary-navy)' }}>
                <Activity size={20} />
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Completed: <strong>{stats.completedRequests}</strong> • Cancelled: <strong>{stats.cancelledRequests}</strong>
            </div>
          </div>

          {/* Pending Dispatches */}
          <div className="card" style={{ borderLeft: '4px solid #D92332' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#B91C1C', fontWeight: 700, textTransform: 'uppercase' }}>
                  Pending Dispatch
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#DC2626', marginTop: '0.2rem' }}>
                  {stats.pendingRequests}
                </div>
              </div>
              <div style={{ padding: '0.5rem', backgroundColor: '#FEE2E2', borderRadius: '8px', color: '#DC2626' }}>
                <Clock size={20} />
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#DC2626', marginTop: '0.5rem', fontWeight: 600 }}>
              {stats.pendingRequests > 0 ? 'Requires immediate assignment!' : 'Queue cleared'}
            </div>
          </div>

          {/* Active Dispatches */}
          <div className="card" style={{ borderLeft: '4px solid #2563EB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#1E40AF', fontWeight: 700, textTransform: 'uppercase' }}>
                  Active Dispatches
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2563EB', marginTop: '0.2rem' }}>
                  {stats.activeRequests}
                </div>
              </div>
              <div style={{ padding: '0.5rem', backgroundColor: '#DBEAFE', borderRadius: '8px', color: '#2563EB' }}>
                <Siren size={20} />
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              En route or at pickup point
            </div>
          </div>

          {/* Fleet Availability */}
          <div className="card" style={{ borderLeft: '4px solid #10B981' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#065F46', fontWeight: 700, textTransform: 'uppercase' }}>
                  Available Fleet
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginTop: '0.2rem' }}>
                  {stats.availableAmbulances} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {stats.totalAmbulances}</span>
                </div>
              </div>
              <div style={{ padding: '0.5rem', backgroundColor: '#D1FAE5', borderRadius: '8px', color: '#059669' }}>
                <Truck size={20} />
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Drivers Registered: <strong>{stats.totalDrivers}</strong>
            </div>
          </div>
        </div>

        {/* Visual Analytics Bar: Request Categories & Status */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--secondary-navy)', marginBottom: '0.75rem' }}>
            Emergency Categories Distribution
          </h3>
          <div style={{ display: 'flex', height: '14px', borderRadius: 'var(--radius-full)', overflow: 'hidden', backgroundColor: 'var(--border-light)', marginBottom: '0.75rem' }}>
            <div style={{ width: '40%', backgroundColor: '#DC2626' }} title="Cardiac Emergencies (40%)" />
            <div style={{ width: '30%', backgroundColor: '#EA580C' }} title="Accident / Trauma (30%)" />
            <div style={{ width: '20%', backgroundColor: '#D946EF' }} title="Pregnancy / Maternity (20%)" />
            <div style={{ width: '10%', backgroundColor: '#2563EB' }} title="General Medical (10%)" />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.8rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '2px', backgroundColor: '#DC2626' }}></span>
              Cardiac Emergency (Critical)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '2px', backgroundColor: '#EA580C' }}></span>
              Road Accident / Trauma
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '2px', backgroundColor: '#D946EF' }}></span>
              Pregnancy / Labor
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '2px', backgroundColor: '#2563EB' }}></span>
              General Medical
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--border-light)', marginBottom: '1.5rem' }}>
          {[
            { key: 'requests', label: `Emergency Requests (${requests.length})`, icon: Activity },
            { key: 'drivers', label: `Drivers Fleet (${drivers.length})`, icon: Users },
            { key: 'ambulances', label: `Ambulance Units (${ambulances.length})`, icon: Truck },
            { key: 'users', label: `Registered Users (${usersList.length})`, icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.75rem 1.25rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: isSelected ? 'var(--primary-red)' : 'var(--text-muted)',
                  borderBottom: isSelected ? '3px solid var(--primary-red)' : '3px solid transparent',
                  background: 'none',
                  cursor: 'pointer',
                  marginBottom: '-2px'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Emergency Requests */}
        {activeTab === 'requests' && (
          <div className="card">
            {/* Search and Filters Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              {/* Search input */}
              <div style={{ position: 'relative', minWidth: '260px', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.2rem', paddingRight: '0.75rem', fontSize: '0.85rem' }}
                  placeholder="Search by Request ID, Patient Name, or Address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Status filter */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <select
                  className="form-select"
                  style={{ padding: '0.5rem', fontSize: '0.82rem', width: 'auto' }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Ambulance Assigned">Ambulance Assigned</option>
                  <option value="On the Way">On the Way</option>
                  <option value="Arrived at Pickup">Arrived at Pickup</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                {/* Emergency type filter */}
                <select
                  className="form-select"
                  style={{ padding: '0.5rem', fontSize: '0.82rem', width: 'auto' }}
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="ALL">All Urgencies</option>
                  <option value="Cardiac emergency">Cardiac</option>
                  <option value="Accident">Accident</option>
                  <option value="Pregnancy-related emergency">Pregnancy</option>
                  <option value="Medical emergency">Medical</option>
                </select>
              </div>
            </div>

            {/* Requests Table */}
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Time</th>
                    <th>Patient</th>
                    <th>Emergency Type</th>
                    <th>Pickup Point</th>
                    <th>Assigned Ambulance</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => (
                    <tr key={req._id}>
                      <td style={{ fontWeight: 700, color: 'var(--secondary-navy)' }}>
                        #{req.requestId}
                      </td>
                      <td style={{ fontSize: '0.82rem' }}>
                        {new Date(req.createdAt).toLocaleTimeString()}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{req.patientName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.contactNumber}</div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: req.emergencyType === 'Cardiac emergency' ? '#DC2626' : '#1F2937' }}>
                          {req.emergencyType}
                        </span>
                      </td>
                      <td style={{ maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={req.pickupLocation?.address}>
                        {req.pickupLocation?.address}
                      </td>
                      <td>
                        {req.assignedAmbulance ? (
                          <div>
                            <div style={{ fontWeight: 600 }}>{req.assignedAmbulance.vehicleNumber}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.assignedDriver?.name}</div>
                          </div>
                        ) : (
                          <span style={{ color: '#D97706', fontSize: '0.82rem', fontWeight: 600 }}>Unassigned</span>
                        )}
                      </td>
                      <td>
                        <StatusBadge status={req.status} />
                      </td>
                      <td>
                        {/* Assign Button if Pending or Reassign */}
                        {!['Completed', 'Cancelled'].includes(req.status) && (
                          <button
                            onClick={() => {
                              setAssignModalReq(req);
                              if (drivers[0]) setSelectedDriverId(drivers[0].id);
                              if (ambulances[0]) setSelectedAmbulanceId(ambulances[0]._id);
                            }}
                            className="btn btn-outline-red btn-sm"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                          >
                            <span>Dispatch / Assign</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Drivers Management */}
        {activeTab === 'drivers' && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--secondary-navy)' }}>
                  Registered Ambulance Drivers Directory
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Verified heavy vehicle licensed emergency ambulance drivers
                </p>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Driver Name</th>
                    <th>Contact Phone</th>
                    <th>RTO License</th>
                    <th>Assigned Vehicle</th>
                    <th>Availability</th>
                    <th>Duty Status</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((d) => (
                    <tr key={d.id}>
                      <td style={{ fontWeight: 700, color: 'var(--secondary-navy)' }}>
                        {d.name}
                      </td>
                      <td>{d.phone}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{d.licenseNumber}</td>
                      <td>
                        {d.ambulance ? (
                          <span><strong>{d.ambulance.vehicleNumber}</strong> ({d.ambulance.vehicleType})</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>No vehicle linked</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${d.isAvailable ? 'badge-arrived' : 'badge-cancelled'}`}>
                          {d.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${d.status === 'Available' ? 'badge-arrived' : (d.status === 'On Duty' ? 'badge-onway' : 'badge-cancelled')}`}>
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Ambulance Fleet Management */}
        {activeTab === 'ambulances' && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--secondary-navy)' }}>
                  Emergency Fleet Inventory
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Active BLS, ALS, and Cardiac ICU ambulances stationed across Vellangallur sector
                </p>
              </div>
              <button
                onClick={() => setAddAmbModalOpen(true)}
                className="btn btn-primary btn-sm"
              >
                <Plus size={15} />
                <span>Add Ambulance</span>
              </button>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Registration No.</th>
                    <th>Vehicle Type</th>
                    <th>Base Station</th>
                    <th>Assigned Driver</th>
                    <th>Key Equipment</th>
                    <th>Trips</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ambulances.map((a) => (
                    <tr key={a._id}>
                      <td style={{ fontWeight: 700, color: 'var(--secondary-navy)' }}>
                        {a.vehicleNumber}
                      </td>
                      <td>
                        <span className="badge badge-accepted">{a.vehicleType}</span>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{a.baseStation}</td>
                      <td>{a.driverName || 'Standby Crew'}</td>
                      <td style={{ fontSize: '0.8rem', color: '#4B5563', maxWidth: '240px' }}>
                        {a.equipment?.slice(0, 3).join(', ')}
                      </td>
                      <td style={{ fontWeight: 600 }}>{a.tripsCompleted || 0}</td>
                      <td>
                        <span className={`badge ${a.status === 'Available' ? 'badge-arrived' : (a.status === 'On Duty' ? 'badge-onway' : 'badge-cancelled')}`}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Users Management */}
        {activeTab === 'users' && (
          <div className="card">
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--secondary-navy)' }}>
                Registered System Users
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Patients, drivers, and dispatch administrators registered in the platform
              </p>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Registered At</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u._id}>
                      <td style={{ fontWeight: 700, color: 'var(--secondary-navy)' }}>{u.name}</td>
                      <td style={{ fontSize: '0.85rem' }}>{u.email}</td>
                      <td>{u.phone}</td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'badge-assigned' : (u.role === 'driver' ? 'badge-accepted' : 'badge-pending')}`} style={{ textTransform: 'capitalize' }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Manual Dispatch Assignment Modal */}
      {assignModalReq && (
        <div className="modal-overlay" onClick={() => setAssignModalReq(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary-navy)', marginBottom: '0.4rem' }}>
              Dispatch Ambulance to Request #{assignModalReq.requestId}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Patient: <strong>{assignModalReq.patientName}</strong> • {assignModalReq.emergencyType} • {assignModalReq.pickupLocation?.address}
            </p>

            <form onSubmit={handleAssignDispatch}>
              {/* Select Driver */}
              <div className="form-group">
                <label className="form-label">Select Driver</label>
                <select
                  className="form-select"
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  required
                >
                  <option value="" disabled>Choose driver...</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.phone}) - {d.isAvailable ? 'Available' : 'Busy/Offline'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Ambulance */}
              <div className="form-group">
                <label className="form-label">Select Ambulance Vehicle</label>
                <select
                  className="form-select"
                  value={selectedAmbulanceId}
                  onChange={(e) => setSelectedAmbulanceId(e.target.value)}
                  required
                >
                  <option value="" disabled>Choose ambulance...</option>
                  {ambulances.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.vehicleNumber} ({a.vehicleType}) - Base: {a.baseStation} [{a.status}]
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setAssignModalReq(null)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assigning}
                  className="btn btn-primary"
                >
                  {assigning ? 'Dispatching...' : 'Dispatch Unit Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Ambulance Modal */}
      {addAmbModalOpen && (
        <div className="modal-overlay" onClick={() => setAddAmbModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary-navy)', marginBottom: '0.4rem' }}>
              Register New Ambulance Unit
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Add a verified vehicle to the Vellangallur regional emergency dispatch pool
            </p>

            <form onSubmit={handleAddAmbulance}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Vehicle Registration No. *</label>
                  <input
                    type="text"
                    required
                    placeholder="KL-45-S-9911"
                    className="form-input"
                    value={newAmbForm.vehicleNumber}
                    onChange={(e) => setNewAmbForm({ ...newAmbForm, vehicleNumber: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Vehicle Support Grade</label>
                  <select
                    className="form-select"
                    value={newAmbForm.vehicleType}
                    onChange={(e) => setNewAmbForm({ ...newAmbForm, vehicleType: e.target.value })}
                  >
                    <option value="BLS">Basic Life Support (BLS)</option>
                    <option value="ALS">Advanced Life Support (ALS)</option>
                    <option value="Cardiac ICU">Cardiac ICU Unit</option>
                    <option value="Patient Transport">Patient Transport</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Base Station Landmark / Post</label>
                <input
                  type="text"
                  required
                  placeholder="Vellangallur Community Health Centre Stand"
                  className="form-input"
                  value={newAmbForm.baseStation}
                  onChange={(e) => setNewAmbForm({ ...newAmbForm, baseStation: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Emergency Helpline / Driver Phone</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 94470 12345"
                  className="form-input"
                  value={newAmbForm.contactNumber}
                  onChange={(e) => setNewAmbForm({ ...newAmbForm, contactNumber: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Equipment Checklist (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="Ventilator, Defibrillator, Oxygen Cylinder, Stretcher"
                  className="form-input"
                  value={newAmbForm.equipment}
                  onChange={(e) => setNewAmbForm({ ...newAmbForm, equipment: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setAddAmbModalOpen(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Save & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
