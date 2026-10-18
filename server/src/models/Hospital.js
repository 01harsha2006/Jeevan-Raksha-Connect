import mongoose from 'mongoose';

const HospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: true,
  },
  emergencyServices: [{ type: String }],
  traumaLevel: {
    type: String,
    default: 'Secondary Trauma Center',
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  availableBeds: {
    type: Number,
    default: 50,
  },
  ambulanceCount: {
    type: Number,
    default: 3,
  },
  website: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Hospital || mongoose.model('Hospital', HospitalSchema);
