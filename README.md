# Jeevan Raksha Connect 🚑
### Smart Emergency Ambulance Booking and Dispatch System
*Initial Deployment Sector: Vellangallur Grama Panchayat, Thrissur District, Kerala, India (PIN: 680662)*  
**Tagline:** *"Every Second Matters. Every Life Matters."*

---

> **⚠️ ACADEMIC PROTOTYPE NOTICE:**  
> Jeevan Raksha Connect is an academic technology prototype designed to demonstrate rapid patient-driver coordination and transparent emergency dispatch in semi-urban and rural Kerala. It is **not** an operational government emergency service. In a real medical emergency, dial **108** (Kanivu Emergency Ambulance) or **112** (National Emergency Helpline) immediately.

---

## 🌟 Key Highlights & Features

1. **Patient Emergency Portal**:
   - One-tap emergency ambulance request flow with immediate priority triage.
   - HTML5 Geolocation detection and Vellangallur preset landmarks (Vellangallur Junction, Konathukunnu, Vallivattom, Nadavaramba, Poomangalam).
   - Medical classification: Cardiac emergencies, Road accidents, Pregnancy/maternity labor, Acute medical distress.
   - Live Leaflet OpenStreetMap tracking with route polyline, vehicle number, driver contact, and request status timeline.
   - In-app request cancellation with strict safety eligibility rules.

2. **Ambulance Driver Terminal**:
   - Driver profile with verified heavy commercial badge and vehicle registration (e.g., `KL-45-S-8821`).
   - One-touch **Online / Offline Duty Toggle** updating fleet standby in real-time.
   - Incoming emergency dispatch alerts with sound synthesis (Web Audio API) and visual pulse chimes.
   - Step-by-step dispatch workflow: `Accepted` ➔ `Ambulance Assigned` ➔ `On the Way` ➔ `Arrived at Pickup` ➔ `Completed`.
   - Direct patient phone calling shortcut and GPS navigation map.

3. **Central Dispatch Administration**:
   - High-level KPI command center: Total Requests, Pending Dispatch, Active Dispatches, Fleet Availability.
   - Emergency category distribution breakdown and real-time status metrics.
   - Manual Dispatcher Assignment: ability to manually allocate specific drivers and ambulances to pending requests.
   - Comprehensive fleet and driver registry management.

4. **Hospital Directory & Referral Corridor**:
   - Verified hospital directory serving Vellangallur (Govt. CHC Vellangallur, Taluk Hospital Irinjalakuda, Modern Hospital Kodungallur, St. James Chalakudy, Craft Hospital, Jubilee Mission Medical College Thrissur).
   - Dynamic distance calculation relative to patient's live coordinates.
   - One-click Google Maps turn-by-turn driving directions.

5. **Fleet Map & 7-Stage Protocol Simulator**:
   - OpenStreetMap visualization centered on Vellangallur (`10.2858° N, 76.2232° E`).
   - Filter by vehicle support grade: ALS (Advanced Life Support), BLS (Basic Life Support), Cardiac ICU, Patient Transport.
   - Interactive 7-stage protocol lifecycle simulator for educational and evaluation walkthroughs.

---

## 🛠️ Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: Modern Healthcare Design System with CSS tokens, emergency gradients, and glassmorphic cards
- **Icons**: Lucide React
- **Mapping**: Leaflet 1.9 & React-Leaflet with OpenStreetMap
- **Backend**: Node.js & Express.js REST API
- **Database**: MongoDB with Mongoose (with automated integrated memory fallback for zero-setup execution)
- **Authentication**: Role-based JWT (JSON Web Tokens) with bcryptjs password hashing
- **Audio Tone**: Web Audio API emergency chime

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- (Optional) MongoDB local or MongoDB Atlas URI

### 1. Repository Setup & Installation

Clone or extract the repository, then install dependencies for both `server` and `client`:

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Variables Configuration

Copy `.env.example` in `server/`:

```bash
cd ../server
cp .env.example .env
```

Contents of `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/jeevan_raksha
JWT_SECRET=jeevan_raksha_emergency_super_secret_key_2026
NODE_ENV=development
```

> **Note on MongoDB Connection:**  
> If MongoDB is running locally or a valid `MONGODB_URI` is provided, the backend connects automatically. If MongoDB is not running locally, the server seamlessly falls back to the **Integrated In-Memory Store** seeded with full Vellangallur emergency records so the entire platform works out-of-the-box!

### 3. Running the Application

Open two terminal windows:

**Terminal 1 (Backend Server):**
```bash
cd server
npm run dev
# Server runs on: http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Client runs on: http://localhost:3000
```

Visit **`http://localhost:3000`** in your browser.

---

## 👥 Demo Accounts (1-Click Login Available)

For evaluator convenience, 1-click login buttons are provided on the Login page (`/auth`) and in the top navigation **"Demo Roles"** dropdown:

| Role | Name | Email | Password | Assigned Vehicle |
| :--- | :--- | :--- | :--- | :--- |
| **Patient** | Rahul Menon | `rahul@example.com` | `patient123` | N/A (Vellangallur Resident) |
| **Driver** | Suresh Kumar | `suresh.driver@example.com` | `driver123` | `KL-45-S-8821` (ALS Unit) |
| **Admin** | Dr. Lakshmi Nair | `admin@jeevanraksha.gov.in` | `admin123` | Central Dispatch Controller |

---

## 📡 REST API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Create patient, driver, or admin account
- `POST /api/auth/login` - Authenticate with email & password, returns JWT
- `GET /api/auth/me` - Retrieve authenticated user profile (Bearer Token required)

### Emergency Requests Endpoints
- `POST /api/requests` - Submit new emergency ambulance request
- `GET /api/requests/my` - Fetch requests logged by authenticated patient
- `GET /api/requests/:id` - Fetch single request details (Protected)
- `PATCH /api/requests/:id/status` - Advance request status (`Pending`, `Accepted`, `Ambulance Assigned`, `On the Way`, `Arrived at Pickup`, `Completed`, `Cancelled`)
- `PATCH /api/requests/:id/cancel` - Cancel request with reason (Patient or Admin)
- `GET /api/requests` - Fetch all requests (Admin or authorized)

### Drivers & Ambulance Fleet Endpoints
- `GET /api/drivers/available` - List available active drivers
- `GET /api/drivers/me/requests` - Fetch assignments for logged-in driver
- `PATCH /api/drivers/me/status` - Toggle driver online/offline availability
- `GET /api/ambulances` - List ambulances with optional filters (`status`, `vehicleType`)
- `POST /api/ambulances` - Register new ambulance unit (Admin only)
- `PATCH /api/ambulances/:id` - Update vehicle equipment or location

### Administrative Endpoints
- `GET /api/admin/dashboard` - KPI counts, emergency breakdown analytics, and recent requests
- `GET /api/admin/users` - Directory of registered users
- `GET /api/admin/drivers` - Fleet personnel details
- `PATCH /api/admin/requests/:id/assign` - Dispatcher assigns driver and vehicle to request

### Hospital Directory Endpoints
- `GET /api/hospitals` - Retrieve verified referral hospitals in Vellangallur / Thrissur
- `POST /api/hospitals` - Add verified hospital record (Admin only)

---

## 🧭 Geographic Coverage: Vellangallur Sector

- **Center Coordinates**: `10.2858° N, 76.2232° E` (Vellangallur Main Junction)
- **Key Localities**: Konathukunnu, Vallivattom, Nadavaramba, Poomangalam, Thekkumkara
- **Referral Corridors**:
  - *Primary Level*: Govt. Community Health Centre, Vellangallur (~0.8 km)
  - *Secondary Trauma*: Taluk Headquarters Hospital, Irinjalakuda (~8.4 km)
  - *Tertiary Care*: Modern Hospital, Kodungallur (~9.1 km) & St. James Hospital, Chalakudy (~15.2 km)
  - *Apex Level-1*: Jubilee Mission Medical College & Hospital, Thrissur (~28.5 km)

---

## 🔒 Safety, Privacy & Ethical Protocol

1. **No Misleading GPS Claims**: Maps clearly indicate demonstration coordinates unless connected to hardware OBD-II/GPS telematics.
2. **Transparent Dispatch State**: Requests are not shown as dispatched until a driver has explicitly accepted or dispatch has allocated an ambulance.
3. **Data Security**: Passwords hashed with `bcryptjs` salt rounds; JWT secrets kept in `.env`; patient emergency contacts and health records are protected and never persisted permanently in public storage.

---

## 📜 License & Acknowledgments

Developed as an academic demonstration for the Kerala healthcare transit sector.  
© 2026 **Jeevan Raksha Connect**. All rights reserved.
