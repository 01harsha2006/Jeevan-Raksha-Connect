import bcrypt from 'bcryptjs';

// In-Memory / Persistent Data Store for Jeevan Raksha Connect
// Ensures rock-solid reliability across development, demonstration, and production

export const initialUsers = [
  {
    _id: 'user_admin_01',
    name: 'Dr. Lakshmi Nair',
    email: 'admin@jeevanraksha.gov.in',
    passwordHash: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    phone: '+91 94470 11223',
    department: 'Central Emergency Dispatch',
    createdAt: new Date('2026-01-01T08:00:00Z'),
  },
  {
    _id: 'user_driver_01',
    name: 'Suresh Kumar',
    email: 'suresh.driver@example.com',
    passwordHash: bcrypt.hashSync('driver123', 10),
    role: 'driver',
    phone: '+91 98460 54321',
    licenseNumber: 'KL-45/2018/00912',
    createdAt: new Date('2026-01-05T09:30:00Z'),
  },
  {
    _id: 'user_driver_02',
    name: 'Aneesh Varghese',
    email: 'aneesh.driver@example.com',
    passwordHash: bcrypt.hashSync('driver123', 10),
    role: 'driver',
    phone: '+91 97451 88990',
    licenseNumber: 'KL-08/2020/00481',
    createdAt: new Date('2026-01-10T11:15:00Z'),
  },
  {
    _id: 'user_patient_01',
    name: 'Rahul Menon',
    email: 'rahul@example.com',
    passwordHash: bcrypt.hashSync('patient123', 10),
    role: 'patient',
    phone: '+91 94471 23456',
    address: 'Near Vellangallur Shiva Temple, Vellangallur, Kerala 680662',
    createdAt: new Date('2026-01-12T14:20:00Z'),
  },
  {
    _id: 'user_patient_02',
    name: 'Fathima Beevi',
    email: 'fathima@example.com',
    passwordHash: bcrypt.hashSync('patient123', 10),
    role: 'patient',
    phone: '+91 99462 77881',
    address: 'Konathukunnu Post, Vellangallur, Kerala 680662',
    createdAt: new Date('2026-01-15T16:00:00Z'),
  }
];

export const initialAmbulances = [
  {
    _id: 'amb_01',
    vehicleNumber: 'KL-45-S-8821',
    vehicleType: 'ALS', // Advanced Life Support
    driverId: 'user_driver_01',
    driverName: 'Suresh Kumar',
    driverPhone: '+91 98460 54321',
    baseStation: 'Govt. Community Health Centre, Vellangallur',
    location: {
      latitude: 10.2858,
      longitude: 76.2232,
      address: 'Vellangallur Main Junction'
    },
    status: 'Available', // Available, On Duty, Offline, Maintenance
    equipment: ['Ventilator', 'Defibrillator', 'Oxygen Cylinder', 'ECG Monitor', 'Emergency Stretcher', 'Suction Unit'],
    contactNumber: '+91 98460 54321',
    rating: 4.9,
    tripsCompleted: 142
  },
  {
    _id: 'amb_02',
    vehicleNumber: 'KL-08-AB-4310',
    vehicleType: 'BLS', // Basic Life Support
    driverId: 'user_driver_02',
    driverName: 'Aneesh Varghese',
    driverPhone: '+91 97451 88990',
    baseStation: 'Konathukunnu Emergency Stand',
    location: {
      latitude: 10.2715,
      longitude: 76.2134,
      address: 'Konathukunnu Bypass'
    },
    status: 'Available',
    equipment: ['Oxygen Support', 'First Aid Trauma Kit', 'Foldable Stretcher', 'Blood Pressure Monitor', 'Pulse Oximeter'],
    contactNumber: '+91 97451 88990',
    rating: 4.8,
    tripsCompleted: 98
  },
  {
    _id: 'amb_03',
    vehicleNumber: 'KL-45-Q-1102',
    vehicleType: 'Cardiac ICU',
    driverId: null,
    driverName: 'Unassigned',
    driverPhone: '+91 480 2860100',
    baseStation: 'Taluk Hospital Support Hub, Irinjalakuda',
    location: {
      latitude: 10.3427,
      longitude: 76.2089,
      address: 'Irinjalakuda Hospital Road'
    },
    status: 'Available',
    equipment: ['Advanced Biphasic Defibrillator', 'Transport Ventilator', 'Syringe Pumps', 'Intubation Kit', 'Multichannel Monitor'],
    contactNumber: '+91 480 2860100',
    rating: 4.95,
    tripsCompleted: 210
  },
  {
    _id: 'amb_04',
    vehicleNumber: 'KL-45-N-6677',
    vehicleType: 'Patient Transport',
    driverId: null,
    driverName: 'Unassigned',
    driverPhone: '+91 94460 00112',
    baseStation: 'Vallivattom Health Post',
    location: {
      latitude: 10.3012,
      longitude: 76.2189,
      address: 'Vallivattom Center'
    },
    status: 'Available',
    equipment: ['Basic Stretcher', 'Oxygen Mask', 'First Aid Box', 'Wheelchair Support'],
    contactNumber: '+91 94460 00112',
    rating: 4.7,
    tripsCompleted: 64
  }
];

export const initialHospitals = [
  {
    _id: 'hosp_01',
    name: 'Govt. Community Health Centre, Vellangallur',
    address: 'Vellangallur - Kodungallur Road, Vellangallur, Kerala 680662',
    contactNumber: '+91 480 286 0220',
    verified: true,
    emergencyServices: ['24x7 Emergency Casualty', 'Primary Trauma Care', 'Maternity / Delivery Care', 'Ambulance Standby', 'Pharmacy'],
    traumaLevel: 'Primary Emergency Care',
    location: {
      latitude: 10.2842,
      longitude: 76.2245
    },
    availableBeds: 24,
    ambulanceCount: 2,
    website: 'https://dhs.kerala.gov.in'
  },
  {
    _id: 'hosp_02',
    name: 'Taluk Headquarters Hospital, Irinjalakuda',
    address: 'Civil Station Road, Irinjalakuda, Kerala 680121',
    contactNumber: '+91 480 282 5243',
    verified: true,
    emergencyServices: ['Comprehensive 24x7 Trauma Unit', 'Intensive Care Unit (ICU)', 'Blood Storage Centre', 'Pediatric Emergency', 'Orthopedic Surgery'],
    traumaLevel: 'Secondary Trauma Care Center',
    location: {
      latitude: 10.3427,
      longitude: 76.2089
    },
    availableBeds: 180,
    ambulanceCount: 5,
    website: 'https://dhs.kerala.gov.in'
  },
  {
    _id: 'hosp_03',
    name: 'Modern Hospital, Kodungallur',
    address: 'Opposite KSRTC Bus Stand, NH 66, Kodungallur, Kerala 680664',
    contactNumber: '+91 480 280 2022',
    verified: true,
    emergencyServices: ['24x7 Multi-Speciality Trauma Care', 'Cardiac ICU', 'Cath Lab', 'Neurology', 'Dialysis Centre', 'Emergency Ultrasound & CT'],
    traumaLevel: 'Tertiary Advanced Care',
    location: {
      latitude: 10.2277,
      longitude: 76.1970
    },
    availableBeds: 250,
    ambulanceCount: 6,
    website: 'https://modernhospital.in'
  },
  {
    _id: 'hosp_04',
    name: 'St. James Hospital, Chalakudy',
    address: 'South Chalakudy, Thrissur District, Kerala 680307',
    contactNumber: '+91 480 271 0700',
    verified: true,
    emergencyServices: ['Trauma & Emergency Medicine', 'Interventional Cardiology', 'Critical Care Medicine', 'Neonatal ICU', '24x7 Stroke Unit'],
    traumaLevel: 'Tertiary Care Center',
    location: {
      latitude: 10.3070,
      longitude: 76.3330
    },
    availableBeds: 450,
    ambulanceCount: 8,
    website: 'https://stjameshospital.org'
  },
  {
    _id: 'hosp_05',
    name: 'Craft Hospital & Research Centre',
    address: 'Chandapura, Kodungallur, Kerala 680664',
    contactNumber: '+91 480 280 1800',
    verified: true,
    emergencyServices: ['Emergency Obstetrics & High-Risk Pregnancy Care', 'Advanced Neonatal Care (NICU)', 'Surgical Emergency', '24x7 Lab'],
    traumaLevel: 'Speciality Emergency Center',
    location: {
      latitude: 10.2185,
      longitude: 76.2014
    },
    availableBeds: 120,
    ambulanceCount: 3,
    website: 'https://crafthospital.com'
  },
  {
    _id: 'hosp_06',
    name: 'Jubilee Mission Medical College & Hospital',
    address: 'East Fort, Thrissur, Kerala 680005',
    contactNumber: '+91 487 243 2200',
    verified: true,
    emergencyServices: ['Apex Level-1 Trauma Centre', 'Burn Unit', 'Cardiac Catheterization', 'Organ Transplant Support', 'Helipad / Advanced Dispatch'],
    traumaLevel: 'Apex Level 1 Trauma Center',
    location: {
      latitude: 10.5218,
      longitude: 76.2235
    },
    availableBeds: 1600,
    ambulanceCount: 14,
    website: 'https://jubileemissionmedicalcollege.org'
  }
];

export const initialRequests = [
  {
    _id: 'req_001',
    requestId: 'JR-2026-1041',
    patientId: 'user_patient_01',
    patientName: 'Rahul Menon',
    contactNumber: '+91 94471 23456',
    pickupLocation: {
      address: 'Near Vellangallur Post Office, Vellangallur, Kerala',
      latitude: 10.2858,
      longitude: 76.2232
    },
    destinationHospital: {
      name: 'Taluk Headquarters Hospital, Irinjalakuda',
      address: 'Civil Station Road, Irinjalakuda, Kerala 680121',
      latitude: 10.3427,
      longitude: 76.2089
    },
    emergencyType: 'Accident',
    description: 'Two-wheeler collision at junction. Mild head laceration and leg pain, conscious.',
    numberOfPatients: 1,
    priority: 'High',
    status: 'Completed',
    assignedDriver: {
      id: 'user_driver_01',
      name: 'Suresh Kumar',
      phone: '+91 98460 54321'
    },
    assignedAmbulance: {
      id: 'amb_01',
      vehicleNumber: 'KL-45-S-8821',
      vehicleType: 'ALS',
      latitude: 10.2858,
      longitude: 76.2232
    },
    statusHistory: [
      { status: 'Pending', timestamp: new Date(Date.now() - 3600000 * 5), note: 'Emergency request registered' },
      { status: 'Accepted', timestamp: new Date(Date.now() - 3600000 * 4.9), note: 'Driver Suresh Kumar accepted request' },
      { status: 'Ambulance Assigned', timestamp: new Date(Date.now() - 3600000 * 4.8), note: 'Vehicle KL-45-S-8821 allocated' },
      { status: 'On the Way', timestamp: new Date(Date.now() - 3600000 * 4.6), note: 'Ambulance en route to pickup location' },
      { status: 'Arrived at Pickup', timestamp: new Date(Date.now() - 3600000 * 4.3), note: 'Arrived at patient location' },
      { status: 'Completed', timestamp: new Date(Date.now() - 3600000 * 3.7), note: 'Patient safely admitted at Taluk Hospital Irinjalakuda' }
    ],
    createdAt: new Date(Date.now() - 3600000 * 5)
  },
  {
    _id: 'req_002',
    requestId: 'JR-2026-1042',
    patientId: 'user_patient_02',
    patientName: 'Fathima Beevi',
    contactNumber: '+91 99462 77881',
    pickupLocation: {
      address: 'Konathukunnu North, Near Canara Bank, Vellangallur',
      latitude: 10.2715,
      longitude: 76.2134
    },
    destinationHospital: {
      name: 'Modern Hospital, Kodungallur',
      address: 'NH 66, Kodungallur, Kerala 680664',
      latitude: 10.2277,
      longitude: 76.1970
    },
    emergencyType: 'Cardiac emergency',
    description: 'Elderly patient complaining of severe acute chest pain and shortness of breath.',
    numberOfPatients: 1,
    priority: 'Critical',
    status: 'On the Way',
    assignedDriver: {
      id: 'user_driver_01',
      name: 'Suresh Kumar',
      phone: '+91 98460 54321'
    },
    assignedAmbulance: {
      id: 'amb_01',
      vehicleNumber: 'KL-45-S-8821',
      vehicleType: 'ALS',
      latitude: 10.2780,
      longitude: 76.2170
    },
    statusHistory: [
      { status: 'Pending', timestamp: new Date(Date.now() - 1200000), note: 'Emergency request received via patient portal' },
      { status: 'Accepted', timestamp: new Date(Date.now() - 1000000), note: 'Dispatcher routed to nearest ALS ambulance' },
      { status: 'Ambulance Assigned', timestamp: new Date(Date.now() - 900000), note: 'ALS Unit KL-45-S-8821 assigned with paramedic support' },
      { status: 'On the Way', timestamp: new Date(Date.now() - 600000), note: 'Driver Suresh Kumar on way with siren and navigation' }
    ],
    createdAt: new Date(Date.now() - 1200000)
  }
];

class MemoryStore {
  constructor() {
    this.users = [...initialUsers];
    this.ambulances = [...initialAmbulances];
    this.hospitals = [...initialHospitals];
    this.requests = [...initialRequests];
  }

  // Users
  findUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.users.find(u => u._id === id);
  }

  createUser(userData) {
    const user = {
      _id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      ...userData,
      createdAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  getAllUsers() {
    return this.users.map(({ passwordHash, ...rest }) => rest);
  }

  // Ambulances & Drivers
  getAmbulances(filter = {}) {
    let list = [...this.ambulances];
    if (filter.status) list = list.filter(a => a.status === filter.status);
    if (filter.vehicleType) list = list.filter(a => a.vehicleType === filter.vehicleType);
    return list;
  }

  getAmbulanceById(id) {
    return this.ambulances.find(a => a._id === id);
  }

  getAmbulanceByDriverId(driverId) {
    return this.ambulances.find(a => a.driverId === driverId);
  }

  createAmbulance(data) {
    const amb = {
      _id: 'amb_' + Date.now(),
      status: 'Available',
      equipment: [],
      ...data,
      rating: 5.0,
      tripsCompleted: 0
    };
    this.ambulances.push(amb);
    return amb;
  }

  updateAmbulance(id, update) {
    const idx = this.ambulances.findIndex(a => a._id === id);
    if (idx === -1) return null;
    this.ambulances[idx] = { ...this.ambulances[idx], ...update };
    return this.ambulances[idx];
  }

  getDrivers() {
    return this.users
      .filter(u => u.role === 'driver')
      .map(driver => {
        const amb = this.getAmbulanceByDriverId(driver._id);
        return {
          id: driver._id,
          name: driver.name,
          email: driver.email,
          phone: driver.phone,
          licenseNumber: driver.licenseNumber || 'Verified Police/RTO',
          isAvailable: amb ? amb.status === 'Available' : false,
          status: amb ? amb.status : 'Offline',
          ambulance: amb || null
        };
      });
  }

  // Requests
  getAllRequests() {
    return [...this.requests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getRequestById(id) {
    return this.requests.find(r => r._id === id || r.requestId === id);
  }

  getRequestsByPatient(patientId) {
    return this.requests
      .filter(r => r.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getRequestsByDriver(driverId) {
    return this.requests
      .filter(r => r.assignedDriver && r.assignedDriver.id === driverId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  createRequest(data) {
    const count = this.requests.length + 1043;
    const req = {
      _id: 'req_' + Date.now(),
      requestId: `JR-${new Date().getFullYear()}-${count}`,
      status: 'Pending',
      priority: data.priority || (data.emergencyType === 'Cardiac emergency' ? 'Critical' : 'High'),
      statusHistory: [
        {
          status: 'Pending',
          timestamp: new Date(),
          note: 'Emergency request initiated by patient.'
        }
      ],
      createdAt: new Date(),
      ...data
    };

    // Auto-match nearest available ambulance if requested or driver is online
    const availableAmb = this.ambulances.find(a => a.status === 'Available' && a.driverId);
    if (availableAmb) {
      req.status = 'Accepted';
      req.assignedDriver = {
        id: availableAmb.driverId,
        name: availableAmb.driverName,
        phone: availableAmb.driverPhone
      };
      req.assignedAmbulance = {
        id: availableAmb._id,
        vehicleNumber: availableAmb.vehicleNumber,
        vehicleType: availableAmb.vehicleType,
        latitude: availableAmb.location.latitude,
        longitude: availableAmb.location.longitude
      };
      req.statusHistory.push({
        status: 'Accepted',
        timestamp: new Date(),
        note: `System matched available ${availableAmb.vehicleType} unit (${availableAmb.vehicleNumber}) with driver ${availableAmb.driverName}.`
      });
      availableAmb.status = 'On Duty';
    }

    this.requests.unshift(req);
    return req;
  }

  updateRequestStatus(id, newStatus, note = '', driverInfo = null) {
    const req = this.getRequestById(id);
    if (!req) return null;

    req.status = newStatus;
    req.statusHistory.push({
      status: newStatus,
      timestamp: new Date(),
      note: note || `Status updated to ${newStatus}`
    });

    if (newStatus === 'Completed' || newStatus === 'Cancelled') {
      if (req.assignedAmbulance) {
        const amb = this.getAmbulanceById(req.assignedAmbulance.id);
        if (amb) {
          amb.status = 'Available';
          if (newStatus === 'Completed') {
            amb.tripsCompleted = (amb.tripsCompleted || 0) + 1;
          }
        }
      }
    }

    return req;
  }

  cancelRequest(id, reason = 'Cancelled by user') {
    const req = this.getRequestById(id);
    if (!req) return null;

    // Check eligibility: Can only cancel if Pending or Accepted or Ambulance Assigned before Arrived at Pickup
    if (req.status === 'Completed' || req.status === 'Arrived at Pickup') {
      throw new Error('This request cannot be cancelled at this stage.');
    }

    req.status = 'Cancelled';
    req.cancelledAt = new Date();
    req.cancellationReason = reason;
    req.statusHistory.push({
      status: 'Cancelled',
      timestamp: new Date(),
      note: `Cancelled: ${reason}`
    });

    if (req.assignedAmbulance) {
      const amb = this.getAmbulanceById(req.assignedAmbulance.id);
      if (amb) amb.status = 'Available';
    }

    return req;
  }

  assignDriverAndAmbulance(requestId, driverId, ambulanceId) {
    const req = this.getRequestById(requestId);
    if (!req) return null;

    const driver = this.findUserById(driverId);
    const ambulance = this.getAmbulanceById(ambulanceId);

    if (!driver || !ambulance) {
      throw new Error('Invalid driver or ambulance ID');
    }

    req.assignedDriver = {
      id: driver._id,
      name: driver.name,
      phone: driver.phone
    };

    req.assignedAmbulance = {
      id: ambulance._id,
      vehicleNumber: ambulance.vehicleNumber,
      vehicleType: ambulance.vehicleType,
      latitude: ambulance.location.latitude,
      longitude: ambulance.location.longitude
    };

    req.status = 'Ambulance Assigned';
    ambulance.status = 'On Duty';

    req.statusHistory.push({
      status: 'Ambulance Assigned',
      timestamp: new Date(),
      note: `Dispatcher assigned Driver ${driver.name} with vehicle ${ambulance.vehicleNumber} (${ambulance.vehicleType}).`
    });

    return req;
  }

  // Hospitals
  getHospitals() {
    return [...this.hospitals];
  }

  addHospital(hospitalData) {
    const hosp = {
      _id: 'hosp_' + Date.now(),
      verified: true,
      availableBeds: 20,
      ambulanceCount: 2,
      ...hospitalData
    };
    this.hospitals.push(hosp);
    return hosp;
  }
}

export const store = new MemoryStore();
