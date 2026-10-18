import express from 'express';
import { store } from '../store/dataStore.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Apply auth and admin-only role to all admin endpoints
router.use(authenticateToken, requireRole('admin'));

// 1. Dashboard summary analytics and stats
router.get('/dashboard', (req, res) => {
  try {
    const requests = store.getAllRequests();
    const ambulances = store.getAmbulances();
    const drivers = store.getDrivers();
    const users = store.getAllUsers();

    const pendingRequests = requests.filter(r => r.status === 'Pending').length;
    const activeRequests = requests.filter(r =>
      ['Accepted', 'Ambulance Assigned', 'On the Way', 'Arrived at Pickup'].includes(r.status)
    ).length;
    const completedRequests = requests.filter(r => r.status === 'Completed').length;
    const cancelledRequests = requests.filter(r => r.status === 'Cancelled').length;

    const availableAmbulances = ambulances.filter(a => a.status === 'Available').length;
    const onDutyAmbulances = ambulances.filter(a => a.status === 'On Duty').length;

    // Breakdown by emergency type
    const emergencyTypeBreakdown = {};
    requests.forEach(r => {
      emergencyTypeBreakdown[r.emergencyType] = (emergencyTypeBreakdown[r.emergencyType] || 0) + 1;
    });

    return res.json({
      success: true,
      stats: {
        totalRequests: requests.length,
        pendingRequests,
        activeRequests,
        completedRequests,
        cancelledRequests,
        totalDrivers: drivers.length,
        availableDrivers: drivers.filter(d => d.isAvailable).length,
        totalAmbulances: ambulances.length,
        availableAmbulances,
        onDutyAmbulances,
        totalUsers: users.length,
      },
      emergencyTypeBreakdown,
      recentRequests: requests.slice(0, 8),
    });
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving admin statistics.' });
  }
});

// 2. User management - list all users
router.get('/users', (req, res) => {
  try {
    const users = store.getAllUsers();
    return res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving users.' });
  }
});

// 3. Driver management - list all drivers with ambulance info
router.get('/drivers', (req, res) => {
  try {
    const drivers = store.getDrivers();
    return res.json({
      success: true,
      count: drivers.length,
      drivers,
    });
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving drivers.' });
  }
});

// 4. Manually assign driver and ambulance to request
router.patch('/requests/:id/assign', (req, res) => {
  try {
    const { driverId, ambulanceId } = req.body;

    if (!driverId || !ambulanceId) {
      return res.status(400).json({
        success: false,
        message: 'Both driverId and ambulanceId are required for assignment.',
      });
    }

    const updatedRequest = store.assignDriverAndAmbulance(req.params.id, driverId, ambulanceId);
    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: 'Emergency request not found.' });
    }

    return res.json({
      success: true,
      message: 'Ambulance and driver successfully dispatched and assigned to request.',
      request: updatedRequest,
    });
  } catch (error) {
    console.error('Error in dispatcher assignment:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error assigning driver.' });
  }
});

export default router;
