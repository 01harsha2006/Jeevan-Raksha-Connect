// Client-side persistent emergency data fallback
// Ensures full functionality whether running locally with Node backend or on static GitHub Pages

const DEFAULT_USERS = [
  {
    _id: 'usr_patient_demo',
    name: 'Rahul Menon',
    email: 'rahul@example.com',
    role: 'patient',
    phone: '+91 94471 23456',
    address: 'Near Vellangallur Junction, Thrissur'
  },
  {
    _id: 'usr_driver_demo',
    name: 'Suresh Kumar',
    email: 'suresh.driver@example.com',
    role: 'driver',
    phone: '+91 98460 11223',
    licenseNumber: 'KL-45/2018/00912',
    address: 'Ambulance Base, CHC Vellangallur'
  },
  {
    _id: 'usr_admin_demo',
    name: 'Dr. Lakshmi Nair',
    email: 'admin@jeevanraksha.gov.in',
    role: 'admin',
    phone: '+91 94470 55667',
    address: 'District Health Administration, Thrissur'
  }
];

const DEFAULT_AMBULANCES = [
  {
    _id: 'amb_01',
    vehicleNumber: 'KL-45-A-1080',
    vehicleType: 'ALS',
    status: 'Available',
    driverName: 'Suresh Kumar',
    driverPhone: '+91 98460 11223',
    baseStation: 'Govt. Community Health Centre, Vellangallur Stand',
    location: { latitude: 10.2858, longitude: 76.2232, address: 'Vellangallur Stand' },
    equipment: ['Defibrillator', 'Ventilator', 'Multipara Cardiac Monitor', 'Oxygen Support', 'Stretcher'],
    rating: 4.9,
    tripsCompleted: 142
  },
  {
    _id: 'amb_02',
    vehicleNumber: 'KL-45-B-2041',
    vehicleType: 'BLS',
    status: 'Available',
    driverName: 'Praveen Das',
    driverPhone: '+91 98471 22334',
    baseStation: 'Taluk Headquarters Hospital, Irinjalakuda Stand',
    location: { latitude: 10.3427, longitude: 76.2089, address: 'Irinjalakuda Stand' },
    equipment: ['Oxygen Unit', 'First Aid Trauma Kit', 'Stretcher'],
    rating: 4.8,
    tripsCompleted: 88
  },
  {
    _id: 'amb_03',
    vehicleNumber: 'KL-45-C-3309',
    vehicleType: 'ICU',
    status: 'On Duty',
    driverName: 'Manoj Varma',
    driverPhone: '+91 94462 33445',
    baseStation: 'Modern Hospital, Kodungallur Stand',
    location: { latitude: 10.2277, longitude: 76.1972, address: 'Kodungallur Stand' },
    equipment: ['Ventilator', 'Syringe Pumps', 'Intensivist Kit', 'Defibrillator'],
    rating: 5.0,
    tripsCompleted: 215
  }
];

const DEFAULT_REQUESTS = [
  {
    _id: 'req_live_demo',
    requestId: 'JR-2026-1045',
    patientId: 'usr_patient_demo',
    patientName: 'Rahul Menon',
    contactNumber: '+91 94471 23456',
    pickupLocation: {
      address: 'Vellangallur Main Junction (Near Bus Stop)',
      latitude: 10.2858,
      longitude: 76.2232
    },
    destinationHospital: {
      name: 'Govt. Community Health Centre, Vellangallur',
      address: 'Vellangallur, Kerala 680662',
      latitude: 10.2842,
      longitude: 76.2245
    },
    emergencyType: 'Cardiac emergency',
    priority: 'Critical',
    description: 'Patient experiencing severe chest pain and radiating shortness of breath.',
    numberOfPatients: 1,
    status: 'On the Way',
    assignedDriver: {
      id: 'usr_driver_demo',
      name: 'Suresh Kumar',
      phone: '+91 98460 11223'
    },
    assignedAmbulance: {
      id: 'amb_01',
      vehicleNumber: 'KL-45-A-1080',
      vehicleType: 'ALS',
      latitude: 10.2872,
      longitude: 76.2215
    },
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    statusHistory: [
      { status: 'Pending', timestamp: new Date(Date.now() - 15 * 60000).toISOString(), note: 'Emergency dispatch triggered' },
      { status: 'Accepted', timestamp: new Date(Date.now() - 13 * 60000).toISOString(), note: 'Crew assigned' },
      { status: 'On the Way', timestamp: new Date(Date.now() - 9 * 60000).toISOString(), note: 'En route with siren active' }
    ]
  }
];

export const getStoredUsers = () => {
  try {
    const data = localStorage.getItem('jrc_users');
    return data ? JSON.parse(data) : DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
};

export const saveStoredUsers = (users) => {
  try {
    localStorage.setItem('jrc_users', JSON.stringify(users));
  } catch (e) {
    console.error('Local storage write error:', e);
  }
};

export const getStoredRequests = () => {
  try {
    const data = localStorage.getItem('jrc_requests');
    return data ? JSON.parse(data) : DEFAULT_REQUESTS;
  } catch {
    return DEFAULT_REQUESTS;
  }
};

export const saveStoredRequests = (requests) => {
  try {
    localStorage.setItem('jrc_requests', JSON.stringify(requests));
  } catch (e) {
    console.error('Local storage write error:', e);
  }
};

export const getStoredAmbulances = () => {
  try {
    const data = localStorage.getItem('jrc_ambulances');
    return data ? JSON.parse(data) : DEFAULT_AMBULANCES;
  } catch {
    return DEFAULT_AMBULANCES;
  }
};

export const DEFAULT_HOSPITALS = [
  {
    _id: 'hosp_01',
    name: 'Govt. Community Health Centre, Vellangallur',
    address: 'Vellangallur - Kodungallur Road, Vellangallur, Kerala 680662',
    contactNumber: '+91 480 286 0220',
    verified: true,
    emergencyServices: ['24x7 Emergency Casualty', 'Primary Trauma Care', 'Maternity / Delivery Care', 'Ambulance Standby', 'Pharmacy'],
    traumaLevel: 'Primary Emergency Care',
    location: { latitude: 10.2842, longitude: 76.2245 },
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
    emergencyServices: ['Comprehensive 24x7 Trauma Unit', 'Intensive Care Unit (ICU)', 'Blood Storage Centre', 'Pediatric Emergency'],
    traumaLevel: 'Secondary Trauma Care Center',
    location: { latitude: 10.3427, longitude: 76.2089 },
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
    emergencyServices: ['24x7 Multi-Speciality Trauma Care', 'Cardiac ICU', 'Cath Lab', 'Neurology', 'Dialysis Centre'],
    traumaLevel: 'Tertiary Advanced Care',
    location: { latitude: 10.2277, longitude: 76.1972 },
    availableBeds: 250,
    ambulanceCount: 6,
    website: 'https://modernhospital.in'
  },
  {
    _id: 'hosp_04',
    name: 'Craft Hospital & Research Centre, Kodungallur',
    address: 'Chandapura, Kodungallur, Kerala 680664',
    contactNumber: '+91 480 280 9000',
    verified: true,
    emergencyServices: ['Emergency Care', 'High-Risk Obstetrics & Gynecology', 'Neonatal Intensive Care Unit (NICU)', 'Surgical ICU'],
    traumaLevel: 'Advanced Maternity & Trauma Care',
    location: { latitude: 10.2185, longitude: 76.2023 },
    availableBeds: 120,
    ambulanceCount: 3,
    website: 'https://crafthospital.com'
  },
  {
    _id: 'hosp_05',
    name: 'St. James Hospital, Chalakudy',
    address: 'South Junction, Chalakudy, Kerala 680307',
    contactNumber: '+91 480 270 1801',
    verified: true,
    emergencyServices: ['Accident & Trauma Emergency', 'Cardiology & Cath Lab', 'Neuro Surgery', 'Nephrology', 'Burn Unit'],
    traumaLevel: 'Level 2 Trauma Center',
    location: { latitude: 10.3012, longitude: 76.3315 },
    availableBeds: 450,
    ambulanceCount: 8,
    website: 'https://stjameshospital.org'
  }
];

export const saveStoredAmbulances = (ambulances) => {
  try {
    localStorage.setItem('jrc_ambulances', JSON.stringify(ambulances));
  } catch (e) {
    console.error('Local storage write error:', e);
  }
};
