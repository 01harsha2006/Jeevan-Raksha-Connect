import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { store } from '../store/dataStore.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'jeevan_raksha_emergency_super_secret_key_2026';

// Register User
router.post('/register', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      role = 'patient', 
      phone, 
      licenseNumber, 
      address,
      vehicleNumber,
      vehicleType = 'BLS',
      baseStation
    } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields: name, email, password, and phone.' });
    }

    if (!['patient', 'driver', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified.' });
    }

    const existingUser = store.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'A user with this email address already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = store.createUser({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      phone,
      licenseNumber: role === 'driver' ? licenseNumber || 'KL-RTO-VERIFIED' : null,
      address: address || 'Vellangallur, Kerala',
    });

    // If driver registered, automatically commission and link their emergency ambulance
    if (role === 'driver') {
      const vNum = vehicleNumber ? vehicleNumber.toUpperCase().trim() : `KL-45-${Math.floor(1000 + Math.random() * 9000)}`;
      const vType = vehicleType || 'BLS';
      const bStation = baseStation || 'Govt. Community Health Centre, Vellangallur Stand';
      const equipment = (vType === 'ALS' || vType === 'ICU')
        ? ['Defibrillator', 'Transport Ventilator', 'Multipara Cardiac Monitor', 'Suction Machine', 'Emergency Oxygen Cylinders', 'Spine Board & Scoop Stretcher']
        : ['Emergency Oxygen Unit', 'First Aid Trauma Kit', 'Stretcher & Wheelchair', 'BP Apparatus & Pulse Oximeter'];

      store.createAmbulance({
        vehicleNumber: vNum,
        vehicleType: vType,
        driverId: newUser._id,
        driverName: newUser.name,
        driverPhone: newUser.phone,
        baseStation: bStation,
        location: {
          latitude: 10.2858,
          longitude: 76.2232,
          address: `${bStation}, Vellangallur`
        },
        contactNumber: newUser.phone,
        equipment
      });
    }

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        licenseNumber: newUser.licenseNumber,
        address: newUser.address,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const user = store.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        licenseNumber: user.licenseNumber,
        address: user.address,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// Get Current User Profile
router.get('/me', authenticateToken, (req, res) => {
  const user = store.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const { passwordHash, ...safeUser } = user;
  return res.json({
    success: true,
    user: safeUser,
  });
});

export default router;
