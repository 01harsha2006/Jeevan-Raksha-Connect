import mongoose from 'mongoose';

const AmbulanceSchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: true,
    unique: true,
  },
  vehicleType: {
    type: String,
    enum: ['BLS', 'ALS', 'Cardiac ICU', 'Patient Transport'],
    default: 'BLS',
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  driverName: String,
  driverPhone: String,
  baseStation: {
    type: String,
    required: true,
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, default: '' },
  },
  status: {
    type: String,
    enum: ['Available', 'On Duty', 'Offline', 'Maintenance'],
    default: 'Available',
  },
  equipment: [{ type: String }],
  contactNumber: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 4.8,
  },
  tripsCompleted: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Ambulance || mongoose.model('Ambulance', AmbulanceSchema);
