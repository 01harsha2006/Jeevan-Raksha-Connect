import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    required: true,
    unique: true,
  },
  patientId: {
    type: String,
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  pickupLocation: {
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  destinationHospital: {
    name: { type: String, default: 'Nearest Available Hospital' },
    address: { type: String, default: '' },
    latitude: Number,
    longitude: Number,
  },
  emergencyType: {
    type: String,
    enum: ['Accident', 'Medical emergency', 'Cardiac emergency', 'Pregnancy-related emergency', 'Other'],
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  numberOfPatients: {
    type: Number,
    default: 1,
  },
  priority: {
    type: String,
    enum: ['Critical', 'High', 'Medium'],
    default: 'High',
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Ambulance Assigned', 'On the Way', 'Arrived at Pickup', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  assignedDriver: {
    id: String,
    name: String,
    phone: String,
  },
  assignedAmbulance: {
    id: String,
    vehicleNumber: String,
    vehicleType: String,
    latitude: Number,
    longitude: Number,
  },
  statusHistory: [
    {
      status: String,
      timestamp: { type: Date, default: Date.now },
      note: String,
    },
  ],
  cancelledAt: Date,
  cancellationReason: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Request || mongoose.model('Request', RequestSchema);
