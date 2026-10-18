import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredUsers, saveStoredUsers, getStoredAmbulances, saveStoredAmbulances } from '../utils/clientStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Synchronously initialize from localStorage so session is never forgotten
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('jrc_token') || null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('jrc_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Optional background verification if backend API is reachable
  useEffect(() => {
    const verifyWithBackend = async () => {
      if (!token) return;

      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem('jrc_user', JSON.stringify(data.user));
          }
        }
      } catch (err) {
        // In offline or static GitHub Pages mode, preserve local user without wiping
        console.info('Backend verification skipped (offline/static mode active). Session retained.');
      }
    };

    verifyWithBackend();
  }, [token]);

  // Login handler with automated offline/GitHub Pages fallback
  const login = async (email, password) => {
    const cleanEmail = email.toLowerCase().trim();

    // 1. Try real backend API first
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.token && data.user) {
          localStorage.setItem('jrc_token', data.token);
          localStorage.setItem('jrc_user', JSON.stringify(data.user));
          setToken(data.token);
          setUser(data.user);
          return data;
        }
      }
    } catch (networkErr) {
      console.warn('Backend API unreachable, activating resilient client store...', networkErr);
    }

    // 2. Client-Side Resilient Fallback (for GitHub Pages or offline)
    const storedUsers = getStoredUsers();
    const matchedUser = storedUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (matchedUser) {
      const mockToken = `mock_token_${matchedUser._id}_${Date.now()}`;
      localStorage.setItem('jrc_token', mockToken);
      localStorage.setItem('jrc_user', JSON.stringify(matchedUser));
      setToken(mockToken);
      setUser(matchedUser);
      return { success: true, user: matchedUser, token: mockToken };
    }

    // If demo password fallback
    if (cleanEmail.includes('driver')) {
      const driverUser = storedUsers.find(u => u.role === 'driver') || storedUsers[1];
      const mockToken = `mock_token_driver_${Date.now()}`;
      localStorage.setItem('jrc_token', mockToken);
      localStorage.setItem('jrc_user', JSON.stringify(driverUser));
      setToken(mockToken);
      setUser(driverUser);
      return { success: true, user: driverUser, token: mockToken };
    }

    throw new Error('Invalid email or password. Please check your credentials or click 1-Click Demo Access.');
  };

  // Register handler with persistent client fallback
  const register = async (userData) => {
    // 1. Try real backend first
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.token && data.user) {
          localStorage.setItem('jrc_token', data.token);
          localStorage.setItem('jrc_user', JSON.stringify(data.user));
          setToken(data.token);
          setUser(data.user);
          return data;
        }
      }
    } catch (networkErr) {
      console.warn('Backend registration API offline, saving to persistent local store...', networkErr);
    }

    // 2. Resilient Fallback: Register locally
    const storedUsers = getStoredUsers();
    const existing = storedUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase().trim());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      _id: 'usr_' + Date.now(),
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      role: userData.role || 'patient',
      phone: userData.phone || '+91 94471 00000',
      licenseNumber: userData.licenseNumber || null,
      address: userData.address || 'Vellangallur, Kerala',
      createdAt: new Date().toISOString()
    };

    storedUsers.push(newUser);
    saveStoredUsers(storedUsers);

    // If driver registered, also add to local ambulances
    if (newUser.role === 'driver') {
      const ambulances = getStoredAmbulances();
      const newAmb = {
        _id: 'amb_' + Date.now(),
        vehicleNumber: userData.vehicleNumber || 'KL-45-D-8822',
        vehicleType: userData.vehicleType || 'ALS',
        status: 'Available',
        driverName: newUser.name,
        driverPhone: newUser.phone,
        baseStation: userData.baseStation || 'Govt. Community Health Centre, Vellangallur Stand',
        location: { latitude: 10.2858, longitude: 76.2232, address: 'Vellangallur Stand' },
        equipment: ['Oxygen Unit', 'Defibrillator', 'First Aid Trauma Kit'],
        rating: 5.0,
        tripsCompleted: 0
      };
      ambulances.push(newAmb);
      saveStoredAmbulances(ambulances);
    }

    const mockToken = `token_reg_${newUser._id}`;
    localStorage.setItem('jrc_token', mockToken);
    localStorage.setItem('jrc_user', JSON.stringify(newUser));
    setToken(mockToken);
    setUser(newUser);

    return { success: true, user: newUser, token: mockToken };
  };

  // Quick 1-Click Demo Login Switcher
  const loginAsDemo = async (role) => {
    let email = 'rahul@example.com';
    let password = 'patient123';

    if (role === 'driver') {
      email = 'suresh.driver@example.com';
      password = 'driver123';
    } else if (role === 'admin') {
      email = 'admin@jeevanraksha.gov.in';
      password = 'admin123';
    }

    return await login(email, password);
  };

  // Logout handler
  const logout = () => {
    try {
      localStorage.removeItem('jrc_token');
      localStorage.removeItem('jrc_user');
    } catch (e) {
      console.error(e);
    }
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        loginAsDemo,
        logout,
        isAuthenticated: !!user,
        isPatient: user?.role === 'patient',
        isDriver: user?.role === 'driver',
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
