import express from 'express';
import { store } from '../store/dataStore.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// 1. Get all ambulances with optional filters
router.get('/', (req, res) => {
  try {
    const { status, vehicleType } = req.query;
    const ambulances = store.getAmbulances({ status, vehicleType });
    return res.json({
      success: true,
      count: ambulances.length,
      ambulances,
    });
  } catch (error) {
    console.error('Error fetching ambulances:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving ambulances.' });
  }
});

// 2. Add new ambulance (Admin only)
router.post('/', authenticateToken, requireRole('admin'), (req, res) => {
  try {
    const {
      vehicleNumber,
      vehicleType,
      driverId,
      driverName,
      driverPhone,
      baseStation,
      location,
      contactNumber,
      equipment,
    } = req.body;

    if (!vehicleNumber || !vehicleType || !baseStation || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: 'Missing required ambulance parameters: vehicleNumber, vehicleType, baseStation, contactNumber.',
      });
    }

    const newAmbulance = store.createAmbulance({
      vehicleNumber,
      vehicleType,
      driverId: driverId || null,
      driverName: driverName || 'Unassigned',
      driverPhone: driverPhone || contactNumber,
      baseStation,
      location: location || {
        latitude: 10.2858,
        longitude: 76.2232,
        address: 'Vellangallur Central Stand',
      },
      contactNumber,
      equipment: equipment || ['Basic Stretcher', 'Oxygen Kit', 'First Aid Trauma Pack'],
    });

    return res.status(201).json({
      success: true,
      message: 'New ambulance registered to emergency fleet.',
      ambulance: newAmbulance,
    });
  } catch (error) {
    console.error('Error adding ambulance:', error);
    return res.status(500).json({ success: false, message: 'Server error adding ambulance.' });
  }
});

// 3. Update ambulance (Admin or Driver)
router.patch('/:id', authenticateToken, (req, res) => {
  try {
    const ambulance = store.getAmbulanceById(req.params.id);
    if (!ambulance) {
      return res.status(404).json({ success: false, message: 'Ambulance not found' });
    }

    // Role check: Admin can update anything; Driver can update their own ambulance status and location
    const isOwner = ambulance.driverId === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this ambulance.' });
    }

    const updated = store.updateAmbulance(req.params.id, req.body);
    return res.json({
      success: true,
      message: 'Ambulance details updated successfully',
      ambulance: updated,
    });
  } catch (error) {
    console.error('Error updating ambulance:', error);
    return res.status(500).json({ success: false, message: 'Server error updating ambulance.' });
  }
});

export default router;
