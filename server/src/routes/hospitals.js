import express from 'express';
import { store } from '../store/dataStore.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// 1. Get all hospitals
router.get('/', (req, res) => {
  try {
    const hospitals = store.getHospitals();
    return res.json({
      success: true,
      count: hospitals.length,
      hospitals,
    });
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving hospitals.' });
  }
});

// 2. Add new verified hospital (Admin only)
router.post('/', authenticateToken, requireRole('admin'), (req, res) => {
  try {
    const { name, address, contactNumber, emergencyServices, traumaLevel, location, availableBeds, ambulanceCount, website } = req.body;

    if (!name || !address || !contactNumber || !location) {
      return res.status(400).json({
        success: false,
        message: 'Missing hospital fields: name, address, contactNumber, and location.',
      });
    }

    const hospital = store.addHospital({
      name,
      address,
      contactNumber,
      emergencyServices: emergencyServices || ['24x7 Casualty', 'Emergency Trauma'],
      traumaLevel: traumaLevel || 'Secondary Trauma Center',
      location: {
        latitude: Number(location.latitude) || 10.2858,
        longitude: Number(location.longitude) || 76.2232,
      },
      availableBeds: Number(availableBeds) || 40,
      ambulanceCount: Number(ambulanceCount) || 2,
      website: website || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Verified hospital registered successfully.',
      hospital,
    });
  } catch (error) {
    console.error('Error creating hospital:', error);
    return res.status(500).json({ success: false, message: 'Server error adding hospital.' });
  }
});

export default router;
