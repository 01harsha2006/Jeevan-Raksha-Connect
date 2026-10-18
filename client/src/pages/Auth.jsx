import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Siren, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  FileText, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  AlertCircle,
  Truck,
  CheckCircle2,
  Activity,
  Info
} from 'lucide-react';

export const Auth = () => {
  const { login, register, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('patient'); // 'patient' | 'driver' | 'admin'

  // Common Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('Vellangallur, Kerala');

  // Driver Specific State
  const [licenseNumber, setLicenseNumber] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('KL-45-B-1080');
  const [vehicleType, setVehicleType] = useState('ALS');
  const [baseStation, setBaseStation] = useState('Govt. Community Health Centre, Vellangallur Stand');
  const [experience, setExperience] = useState('3+ Years Emergency EMS');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectAfterLogin = (userRole) => {
    if (userRole === 'driver') navigate('/driver');
    else if (userRole === 'admin') navigate('/admin');
    else navigate('/patient');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const payload = {
          name,
          email,
          password,
          role,
          phone,
          address,
        };

        if (role === 'driver') {
          payload.licenseNumber = licenseNumber || 'KL-45/2021/008819';
          payload.vehicleNumber = vehicleNumber;
          payload.vehicleType = vehicleType;
          payload.baseStation = baseStation;
        }

        const res = await register(payload);
        redirectAfterLogin(res.user.role);
      } else {
        const res = await login(email, password);
        redirectAfterLogin(res.user.role);
      }
    } catch (err) {
      setError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (demoRole) => {
    setError('');
    setLoading(true);
    try {
      const res = await loginAsDemo(demoRole);
      redirectAfterLogin(res.user.role);
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.25rem', backgroundColor: 'var(--bg-light)' }}>
      <div style={{ width: '100%', maxWidth: '580px' }}>
        
        {/* Card */}
        <div className="card" style={{ padding: '2.5rem 2rem', boxShadow: 'var(--shadow-lg)' }}>
          {/* Brand header */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: 'var(--primary-red)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              marginBottom: '0.75rem',
              boxShadow: 'var(--shadow-emergency)'
            }}>
              <Siren size={28} />
            </div>
            <h2 style={{ fontSize: '1.65rem', color: 'var(--secondary-navy)', marginBottom: '0.25rem' }}>
              {isRegister ? 'Join Jeevan Raksha Connect' : 'Welcome Back'}
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {isRegister 
                ? 'Create your account to access the Vellangallur emergency network' 
                : 'Sign in to access your dispatch dashboard or terminal'}
            </p>
          </div>

          {/* 1-Click Demo Profiles Box */}
          <div style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1E40AF', fontSize: '0.85rem', fontWeight: 700 }}>
                <Sparkles size={16} />
                <span>Instant 1-Click Demo Access</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#3B82F6', fontWeight: 600 }}>Quick evaluation</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleDemoClick('patient')}
                className="btn btn-outline btn-sm"
                style={{ backgroundColor: 'white', fontSize: '0.78rem', padding: '0.45rem 0.2rem', textAlign: 'center', borderColor: '#93C5FD' }}
              >
                👤 Patient Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoClick('driver')}
                className="btn btn-outline btn-sm"
                style={{ backgroundColor: 'white', fontSize: '0.78rem', padding: '0.45rem 0.2rem', textAlign: 'center', borderColor: '#93C5FD', fontWeight: 700, color: '#1E40AF' }}
              >
                🚑 Driver Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoClick('admin')}
                className="btn btn-outline btn-sm"
                style={{ backgroundColor: 'white', fontSize: '0.78rem', padding: '0.45rem 0.2rem', textAlign: 'center', borderColor: '#93C5FD' }}
              >
                🛡️ Admin Demo
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div style={{ display: 'flex', backgroundColor: 'var(--bg-light)', borderRadius: 'var(--radius-md)', padding: '0.25rem', marginBottom: '1.5rem' }}>
            <button
              type="button"
              onClick={() => { setIsRegister(false); setError(''); }}
              style={{
                flex: 1,
                padding: '0.65rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '0.9rem',
                backgroundColor: !isRegister ? 'white' : 'transparent',
                color: !isRegister ? 'var(--secondary-navy)' : 'var(--text-muted)',
                boxShadow: !isRegister ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setError(''); }}
              style={{
                flex: 1,
                padding: '0.65rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '0.9rem',
                backgroundColor: isRegister ? 'white' : 'transparent',
                color: isRegister ? 'var(--secondary-navy)' : 'var(--text-muted)',
                boxShadow: isRegister ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Register New Account
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* If Register: Interactive Role Cards */}
            {isRegister && (
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ marginBottom: '0.5rem', fontWeight: 700 }}>
                  Choose Your Account Role:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                  {/* Patient Card */}
                  <div
                    onClick={() => setRole('patient')}
                    style={{
                      border: role === 'patient' ? '2px solid var(--primary-red)' : '1px solid var(--border-light)',
                      backgroundColor: role === 'patient' ? '#FEF2F2' : 'white',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 0.5rem',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: role === 'patient' ? 'var(--primary-red)' : 'var(--bg-light)',
                      color: role === 'patient' ? 'white' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.4rem'
                    }}>
                      <User size={18} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.84rem', color: role === 'patient' ? 'var(--primary-red)' : 'var(--secondary-navy)' }}>
                      Patient / User
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem', lineHeight: 1.2 }}>
                      Request transit
                    </div>
                  </div>

                  {/* Ambulance Driver Card */}
                  <div
                    onClick={() => setRole('driver')}
                    style={{
                      border: role === 'driver' ? '2px solid #2563EB' : '1px solid var(--border-light)',
                      backgroundColor: role === 'driver' ? '#EFF6FF' : 'white',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 0.5rem',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      top: '-7px',
                      right: '4px',
                      backgroundColor: '#10B981',
                      color: 'white',
                      fontSize: '9px',
                      fontWeight: 700,
                      padding: '1px 5px',
                      borderRadius: '6px'
                    }}>
                      Ambulance
                    </span>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: role === 'driver' ? '#2563EB' : 'var(--bg-light)',
                      color: role === 'driver' ? 'white' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.4rem'
                    }}>
                      <Truck size={18} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.84rem', color: role === 'driver' ? '#1D4ED8' : 'var(--secondary-navy)' }}>
                      Ambulance Driver
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem', lineHeight: 1.2 }}>
                      Dispatch alerts
                    </div>
                  </div>

                  {/* Admin Card */}
                  <div
                    onClick={() => setRole('admin')}
                    style={{
                      border: role === 'admin' ? '2px solid #7C3AED' : '1px solid var(--border-light)',
                      backgroundColor: role === 'admin' ? '#F5F3FF' : 'white',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 0.5rem',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: role === 'admin' ? '#7C3AED' : 'var(--bg-light)',
                      color: role === 'admin' ? 'white' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.4rem'
                    }}>
                      <ShieldCheck size={18} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.84rem', color: role === 'admin' ? '#6D28D9' : 'var(--secondary-navy)' }}>
                      Administrator
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem', lineHeight: 1.2 }}>
                      Fleet coordinator
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Special Callout when Driver Role Selected */}
            {isRegister && role === 'driver' && (
              <div style={{
                backgroundColor: '#EFF6FF',
                border: '1.5px solid #93C5FD',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                marginBottom: '1.25rem',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'center'
              }}>
                <Truck size={22} color="#2563EB" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: '0.82rem', color: '#1E40AF', lineHeight: 1.4 }}>
                  <strong>Ambulance Crew Enrollment:</strong> Registering will automatically commission your vehicle into the <strong>Vellangallur Dispatch Pool</strong> and open your live Driver Console.
                </div>
              </div>
            )}

            {/* If Register: Full Name */}
            {isRegister && (
              <div className="form-group">
                <label className="form-label">
                  {role === 'driver' ? 'Driver / Operator Full Name' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder={role === 'driver' ? 'e.g. Suresh Kumar' : 'e.g. Rahul Menon'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            {/* Email Address */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder={role === 'driver' ? 'driver@jeevanraksha.in' : 'user@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* If Register: Contact Phone number */}
            {isRegister && (
              <div className="form-group">
                <label className="form-label">
                  {role === 'driver' ? 'Driver Emergency Contact Phone' : 'Mobile Phone Number'}
                </label>
                <input
                  type="tel"
                  required
                  className="form-input"
                  placeholder="+91 94471 23456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            )}

            {/* DRIVER-SPECIFIC ENROLLMENT FIELDS */}
            {isRegister && role === 'driver' && (
              <div style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E3A8A', textTransform: 'uppercase', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Truck size={15} />
                  <span>Ambulance Vehicle & License Details</span>
                </div>

                {/* License Number */}
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>
                    Heavy / Commercial Driving License No.
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="KL-45/2019/008821"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                  />
                </div>

                {/* Ambulance Registration Number */}
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>
                    Ambulance Vehicle Number (KL RTO)
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="KL-45-A-1080"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                  />
                </div>

                {/* Ambulance Type & Care Level */}
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>
                    Ambulance Category / Equipment Level
                  </label>
                  <select
                    className="form-select"
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                  >
                    <option value="ALS">ALS - Advanced Life Support (Ventilator, Defibrillator, Cardiac Monitor)</option>
                    <option value="BLS">BLS - Basic Life Support (Oxygen Standby, Stretcher, First Aid)</option>
                    <option value="ICU">ICU - Mobile Critical Care Unit (Specialist Doctor & Paramedic)</option>
                    <option value="PTV">PTV - Patient Non-Emergency Transport Vehicle</option>
                  </select>
                </div>

                {/* Base Station in Vellangallur */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>
                    Base Stand / Affiliated Health Facility
                  </label>
                  <select
                    className="form-select"
                    value={baseStation}
                    onChange={(e) => setBaseStation(e.target.value)}
                  >
                    <option value="Govt. Community Health Centre, Vellangallur Stand">Govt. Community Health Centre, Vellangallur Stand</option>
                    <option value="Taluk Headquarters Hospital, Irinjalakuda Stand">Taluk Headquarters Hospital, Irinjalakuda Stand</option>
                    <option value="Modern Hospital, Kodungallur Stand">Modern Hospital, Kodungallur Stand</option>
                    <option value="Vellangallur Main Junction Stand">Vellangallur Main Junction Stand</option>
                  </select>
                </div>
              </div>
            )}

            {/* If Register & Patient: Residential Landmark */}
            {isRegister && role === 'patient' && (
              <div className="form-group">
                <label className="form-label">Residential Address / Landmark (Vellangallur)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Near Vellangallur Junction, Thrissur"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            )}

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Informational Note for Sign In mode */}
            {!isRegister && (
              <div style={{
                backgroundColor: 'var(--bg-light)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 0.9rem',
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                marginBottom: '1rem',
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center'
              }}>
                <Info size={16} color="var(--primary-red)" style={{ flexShrink: 0 }} />
                <span>
                  <strong>Ambulance Drivers:</strong> Logging in with your driver account routes you directly to the <strong>Driver Emergency Console</strong>.
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`btn ${role === 'driver' && isRegister ? 'btn-primary' : 'btn-emergency'} btn-lg`}
              style={{
                width: '100%',
                marginTop: '0.5rem',
                backgroundColor: role === 'driver' && isRegister ? '#2563EB' : undefined,
                borderColor: role === 'driver' && isRegister ? '#2563EB' : undefined
              }}
            >
              {loading 
                ? 'Processing...' 
                : isRegister 
                  ? (role === 'driver' ? '🚑 Register Ambulance Driver & Vehicle' : (role === 'admin' ? '🛡️ Create Admin Account' : '👤 Create Patient Account'))
                  : 'Sign In to Dashboard'
              }
            </button>
          </form>
        </div>

        {/* Footnote */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Jeevan Raksha Connect • Vellangallur Emergency Dispatch Prototype
        </div>
      </div>
    </div>
  );
};
