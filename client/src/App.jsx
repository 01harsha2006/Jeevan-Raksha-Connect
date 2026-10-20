import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { PatientDashboard } from './pages/PatientDashboard';
import { DriverDashboard } from './pages/DriverDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Tracking } from './pages/Tracking';
import { Hospitals } from './pages/Hospitals';
import { About } from './pages/About';
import { Contact } from './pages/Contact';

// Scroll to top on route change helper
const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    if (!params.get('section')) {
      window.scrollTo(0, 0);
    }
  }, [pathname, search]);

  return null;
};

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading, loginAsDemo } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        Verifying authorization credentials...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="card" style={{ maxWidth: '500px', textAlign: 'center', padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#DC2626', marginBottom: '0.5rem' }}>Access Restricted</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
            This page requires the <strong>{allowedRoles.join(' or ')}</strong> role. You are currently signed in as <strong>{user.name}</strong> ({user.role}).
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            {allowedRoles.includes('driver') && (
              <button onClick={() => loginAsDemo('driver')} className="btn btn-primary btn-sm">
                Switch to Driver Demo
              </button>
            )}
            {allowedRoles.includes('admin') && (
              <button onClick={() => loginAsDemo('admin')} className="btn btn-primary btn-sm">
                Switch to Admin Demo
              </button>
            )}
            {allowedRoles.includes('patient') && (
              <button onClick={() => loginAsDemo('patient')} className="btn btn-primary btn-sm">
                Switch to Patient Demo
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/tracking" element={<Tracking />} />
              <Route path="/hospitals" element={<Hospitals />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Role Protected Routes */}
              <Route
                path="/patient"
                element={
                  <ProtectedRoute allowedRoles={['patient', 'admin']}>
                    <PatientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/driver"
                element={
                  <ProtectedRoute allowedRoles={['driver', 'admin']}>
                    <DriverDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
