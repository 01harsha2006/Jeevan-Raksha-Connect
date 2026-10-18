import express from 'express';
import { store } from '../store/dataStore.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// 1. Get available drivers
router.get('/available', (req, res) => {
  try {
    const drivers = store.getDrivers().filter(d => d.isAvailable);
    return res.json({
      success: true,
      count: drivers.length,
      drivers,
    });
  } catch (error) {
    console.error('Error fetching available drivers:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving drivers.' });
  }
});

// 2. Get requests relevant to the logged-in driver (assigned + pending dispatch queue)
router.get('/me/requests', authenticateToken, requireRole('driver'), (req, res) => {
  try {
    const allRequests = store.getAllRequests();

    // Requests assigned to this driver
    const assigned = allRequests.filter(
      r => r.assignedDriver && r.assignedDriver.id === req.user.id
    );

    // Pending requests awaiting driver acceptance
    const pending = allRequests.filter(r => r.status === 'Pending');
    const ambulance = store.getAmbulanceByDriverId(req.user.id);

    return res.json({
      success: true,
      assigned,
      pending,
      ambulance: ambulance || null
    });
  } catch (error) {
    console.error('Error fetching driver requests:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving driver requests.' });
  }
});

// 3. Update driver status / availability toggle
router.patch('/me/status', authenticateToken, requireRole('driver'), (req, res) => {
  try {
    const { isAvailable } = req.body;
    const ambulance = store.getAmbulanceByDriverId(req.user.id);

    if (ambulance) {
      ambulance.status = isAvailable ? 'Available' : 'Offline';
    }

    return res.json({
      success: true,
      message: `Driver status updated to ${isAvailable ? 'Online & Available' : 'Offline'}`,
      isAvailable: Boolean(isAvailable),
      ambulance,
    });
  } catch (error) {
    console.error('Error updating driver status:', error);
    return res.status(500).json({ success: false, message: 'Server error updating driver status.' });
  }
});

export default router;
