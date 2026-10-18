import express from 'express';
import { store } from '../store/dataStore.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// 1. Create a new emergency ambulance request
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      patientName,
      contactNumber,
      pickupLocation,
      destinationHospital,
      emergencyType,
      description,
      numberOfPatients = 1,
      priority,
    } = req.body;

    if (!patientName || !contactNumber || !pickupLocation || !emergencyType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required request fields: patientName, contactNumber, pickupLocation, emergencyType.',
      });
    }

    // Default coordinates to Vellangallur center if latitude/longitude omitted
    const formattedPickup = {
      address: pickupLocation.address || 'Vellangallur, Kerala',
      latitude: Number(pickupLocation.latitude) || 10.2858,
      longitude: Number(pickupLocation.longitude) || 76.2232,
    };

    const newRequest = store.createRequest({
      patientId: req.user.id,
      patientName,
      contactNumber,
      pickupLocation: formattedPickup,
      destinationHospital: destinationHospital || {
        name: 'Govt. Community Health Centre, Vellangallur',
        address: 'Vellangallur, Kerala 680662',
        latitude: 10.2842,
        longitude: 76.2245,
      },
      emergencyType,
      description: description || '',
      numberOfPatients: Number(numberOfPatients) || 1,
      priority: priority || (emergencyType === 'Cardiac emergency' ? 'Critical' : 'High'),
    });

    return res.status(201).json({
      success: true,
      message: 'Ambulance request submitted successfully',
      request: newRequest,
    });
  } catch (error) {
    console.error('Request creation error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating ambulance request.' });
  }
});

// 2. Get requests created by logged in user
router.get('/my', authenticateToken, (req, res) => {
  try {
    const requests = store.getRequestsByPatient(req.user.id);
    return res.json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error('Error fetching user requests:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving requests.' });
  }
});

// 3. Get all requests (Admin or Driver viewing dispatch queue)
router.get('/', authenticateToken, (req, res) => {
  try {
    // If patient, redirect to /my for security
    if (req.user.role === 'patient') {
      const requests = store.getRequestsByPatient(req.user.id);
      return res.json({ success: true, count: requests.length, requests });
    }

    const requests = store.getAllRequests();
    return res.json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving requests.' });
  }
});

// 4. Get specific request by ID
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const request = store.getRequestById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Ambulance request not found.' });
    }

    // Role check: Only owner, assigned driver, or admin can view
    const isOwner = request.patientId === req.user.id;
    const isAssignedDriver = request.assignedDriver && request.assignedDriver.id === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAssignedDriver && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Access denied to this request.' });
    }

    return res.json({
      success: true,
      request,
    });
  } catch (error) {
    console.error('Error fetching request by ID:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving request details.' });
  }
});

// 5. Update request status (Driver or Admin)
// Valid statuses: Pending, Accepted, Ambulance Assigned, On the Way, Arrived at Pickup, Completed, Cancelled
router.patch('/:id/status', authenticateToken, requireRole('driver', 'admin'), (req, res) => {
  try {
    const { status, note } = req.body;
    const validStatuses = [
      'Pending',
      'Accepted',
      'Ambulance Assigned',
      'On the Way',
      'Arrived at Pickup',
      'Completed',
      'Cancelled',
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const request = store.getRequestById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Ambulance request not found.' });
    }

    // If driver, ensure driver is assigned to this request or accepting a pending request
    if (req.user.role === 'driver') {
      if (status === 'Accepted' && (!request.assignedDriver || !request.assignedDriver.id)) {
        // Driver self-accepts request
        const driverAmbulance = store.getAmbulanceByDriverId(req.user.id);
        request.assignedDriver = {
          id: req.user.id,
          name: req.user.name,
          phone: req.user.phone,
        };
        if (driverAmbulance) {
          request.assignedAmbulance = {
            id: driverAmbulance._id,
            vehicleNumber: driverAmbulance.vehicleNumber,
            vehicleType: driverAmbulance.vehicleType,
            latitude: driverAmbulance.location.latitude,
            longitude: driverAmbulance.location.longitude,
          };
          driverAmbulance.status = 'On Duty';
        }
      } else if (request.assignedDriver && request.assignedDriver.id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'You are not assigned to this request.' });
      }
    }

    const updated = store.updateRequestStatus(req.params.id, status, note);

    return res.json({
      success: true,
      message: `Request status updated to ${status}`,
      request: updated,
    });
  } catch (error) {
    console.error('Error updating status:', error);
    return res.status(500).json({ success: false, message: 'Server error updating status.' });
  }
});

// 6. Cancel request (Patient or Admin)
router.patch('/:id/cancel', authenticateToken, (req, res) => {
  try {
    const { reason = 'Cancelled by user' } = req.body;
    const request = store.getRequestById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Ambulance request not found.' });
    }

    // Role check: Only the requesting patient or an admin can cancel
    if (request.patientId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to cancel this request.' });
    }

    try {
      const updated = store.cancelRequest(req.params.id, reason);
      return res.json({
        success: true,
        message: 'Ambulance request has been successfully cancelled.',
        request: updated,
      });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  } catch (error) {
    console.error('Error cancelling request:', error);
    return res.status(500).json({ success: false, message: 'Server error cancelling request.' });
  }
});

export default router;
