# HotelPro – Complete Hotel Booking and Management System

HotelPro is a full-stack, enterprise-grade hotel booking and management platform designed for guests and hotel administrators. Built on the modern MERN stack (React 18, Node.js, Express, MongoDB/Mongoose) with Bootstrap 5 and Chart.js, it combines five-star luxury UI/UX aesthetics with robust algorithmic date overlap availability checking and mock payment workflows.

---

## 1. Project Overview

HotelPro provides an end-to-end hospitality experience:
- **For Discerning Guests:** Browse luxury suites, check real-time guaranteed room availability based on booking date overlap, review pricing breakdowns, make reservations, simulate payments via a dedicated mock gateway, and print official stay vouchers and invoices.
- **For Hotel Administrators:** Access an executive command center featuring live KPI stat cards, interactive revenue and occupancy charts, comprehensive room inventory CRUD, guest status management (Check-in, Check-out, Cancellation), and user account directory controls.

---

## 2. Key Features

### 🛎️ Guest & Public Features
- **Premium Landing Page:** High-definition photography, floating search widget, curated suites, hotel facilities, luxury testimonials, and FAQ accordion.
- **Date Overlap Availability Engine:** Real-time query logic preventing double bookings by comparing requested dates against existing active reservations (`checkIn < requestedCheckOut && checkOut > requestedCheckIn`).
- **Comprehensive Room Directory:** Filter by room category, bed type, price range slider, guest count, and sorting options.
- **Interactive Room Details:** Multi-photo gallery, complete amenities checklist, room specifications, and live price calculator.
- **Mock Payment Gateway:** Fully simulated checkout with credit card formatting, CVV validation, 1-click test card auto-filler, and instant confirmation generation.
- **Guest Dashboard & Booking Voucher:** Real-time countdown to next check-in, historical stay tracking, and printable PDF/paper voucher with QR reference.
- **Guest Profile Management:** Update name, contact phone, and change passwords with bcrypt security.

### 🛡️ Administrator Features
- **Executive Operations Dashboard:**
  - Real-time KPIs: Total Revenue, Total Bookings, Total Users, Available Rooms, Occupied Rooms, Maintenance Rooms, Confirmed Bookings, and Cancelled Stays.
  - Interactive Visual Charts: Monthly revenue & booking volume trends (Bar Chart) and booking status distribution (Doughnut Chart) powered by Chart.js.
  - Recent activity ledger with live status indicators.
- **Room Management (CRUD):** Add new rooms with custom imagery and amenities, modify room rates, toggle room status (`Available`, `Occupied`, `Maintenance`), and delete inactive rooms.
- **Booking Management:** Search and filter all reservations, update guest statuses (`Confirmed`, `Checked-In`, `Checked-Out`, `Cancelled`), and inspect full billing records.
- **User Governance:** Inspect all registered guest accounts, total stays booked, lifetime spend, and toggle administrative privileges.
- **Dedicated Staff Portal:** Secure admin login with role-based JWT middleware protection.

---

## 3. Technology Stack

### Frontend (`client/`)
- **React.js 18** (Vite build tooling)
- **Bootstrap 5.3 & Bootstrap Icons**
- **Lucide React** (Modern luxury icons)
- **React Router DOM v6** (Nested routes & route guards)
- **Axios** (With Bearer token interceptor and global error normalization)
- **Chart.js & React-Chartjs-2** (Dashboard data visualizations)
- **Context API** (`AuthContext` & `BookingContext`)
- **Custom CSS Design System** (Plus Jakarta Sans & Playfair Display luxury typography)

### Backend (`server/`)
- **Node.js** (v18+)
- **Express.js** (REST API architecture)
- **MongoDB & Mongoose ODM**
- **In-Memory MongoDB Support** (`mongodb-memory-server` built-in zero-configuration fallback)
- **JWT (JSON Web Tokens)** for stateless authentication
- **bcryptjs** for 10-round salted password hashing
- **CORS** & **Morgan** HTTP request logging
- **Express Error Middleware** (Normalized CastError, ValidationError, DuplicateKey errors)

---

## 4. System Requirements

- **Operating System:** Windows, macOS, or Linux
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **Browser:** Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari

---

## 5. Installation

Clone or extract the repository:

```bash
cd hotelpro
```

Install backend dependencies:
```bash
cd server
npm install
```

Install frontend dependencies:
```bash
cd ../client
npm install
```

---

## 6. Environment Variables

Create `.env` inside `server/` (or copy from `server/.env.example`):

```bash
cp server/.env.example server/.env
```

### Server Configuration (`server/.env`):
```env
# Server Port
PORT=5000
NODE_ENV=development

# Database Connection:
# Leave empty to automatically use the embedded In-Memory MongoDB (Zero-configuration startup)
# Or specify your local or Atlas MongoDB connection string:
MONGO_URI=

# JWT Secrets
JWT_SECRET=hotelpro_super_secure_jwt_secret_key_2026_production
JWT_EXPIRE=7d
```

> **Note:** If `MONGO_URI` is omitted or left blank, the application automatically boots an embedded in-memory MongoDB instance. No separate MongoDB installation is required to evaluate or run the system!

---

## 7. Database Setup & Seeding

The database includes an automated seeder that populates 1 Administrator, 6 Guests, 12 Luxury Suites across 5 categories, 6 realistic Bookings, and verified Payment records.

To run the seeder manually:
```bash
cd server
npm run seed
```

*(Note: If booting for the first time with an empty database, `server.js` will automatically seed the initial records on startup!)*

---

## 8. Running the Application

### Option A: Running Backend and Frontend Simultaneously
From the root `hotelpro/` directory:
```bash
# Terminal 1: Start Backend Server
cd server
npm start

# Terminal 2: Start Frontend Client
cd client
npm run dev
```

### Option B: Build and Preview Production Frontend
```bash
cd client
npm run build
npm run preview
```

Open your browser at:
- **Frontend Web Application:** [http://localhost:3000](http://localhost:3000)
- **Backend API & Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 9. API Documentation

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Public | System status and timestamp |
| **POST** | `/api/auth/register` | Public | Register new guest account |
| **POST** | `/api/auth/login` | Public | Authenticate user & return JWT |
| **GET** | `/api/auth/profile` | Private | Retrieve current user profile |
| **PUT** | `/api/auth/profile` | Private | Update name, phone, or password |
| **GET** | `/api/rooms` | Public | List rooms with filters & sorting |
| **GET** | `/api/rooms/available` | Public | **Availability engine with date overlap logic** |
| **GET** | `/api/rooms/:id` | Public | Retrieve single room specifications |
| **POST** | `/api/rooms` | Admin | Create a new room suite |
| **PUT** | `/api/rooms/:id` | Admin | Update room specifications |
| **DELETE** | `/api/rooms/:id` | Admin | Delete room (checks active bookings) |
| **PATCH** | `/api/rooms/:id/status`| Admin | Toggle room status |
| **POST** | `/api/bookings` | Private | Create pending reservation |
| **GET** | `/api/bookings/my` | Private | Get authenticated user's stays |
| **GET** | `/api/bookings/:id` | Private | Get booking voucher / invoice |
| **PUT** | `/api/bookings/:id/cancel` | Private | Cancel stay & issue refund record |
| **POST** | `/api/payments` | Private | Process mock payment & confirm |
| **GET** | `/api/payments/:bookingId` | Private | Retrieve payment receipt |
| **GET** | `/api/admin/dashboard`| Admin | Dashboard metrics & chart datasets |
| **GET** | `/api/admin/bookings` | Admin | Get all bookings with filtering |
| **PATCH**| `/api/admin/bookings/:id/status` | Admin | Update booking status |
| **GET** | `/api/admin/users` | Admin | List all registered users & stats |
| **PATCH**| `/api/admin/users/:id/role` | Admin | Update user privileges |
| **DELETE**| `/api/admin/users/:id` | Admin | Delete user account |

A ready-to-import Postman collection is included in the root directory: `hotelpro.postman_collection.json`.

---

## 10. User Roles & Permissions

| Role | Permissions & Capabilities |
| :--- | :--- |
| **Guest / User** | Browse rooms, search availability with date range, view room details, book rooms, pay via mock card, view booking vouchers, cancel bookings, update profile. |
| **Administrator** | Access Admin Dashboard, view charts & KPIs, manage room inventory (CRUD), update room statuses, check-in & check-out guests, manage user accounts. |

---

## 11. Demo Credentials (For Evaluation & Local Development)

For rapid grading and live testing, both the Guest and Admin login pages feature **1-Click Auto-Fill Demo Credentials** buttons.

### Administrator Account
- **Email:** `admin@hotelpro.com`
- **Password:** `AdminPassword@123`
- **Role:** Administrator (Full Permissions)

### Sample Guest Account
- **Email:** `sarah.jenkins@example.com`
- **Password:** `GuestPassword@123`
- **Role:** Guest Member

*(Additional guest accounts: `david.miller@example.com`, `emily.clark@example.com`, with password `GuestPassword@123`)*

---

## 12. Screenshots & Page Previews

```
+-------------------------------------------------------------------------------+
|  HotelPro                    Rooms & Suites   About   Contact   [Sign In]     |
|                                                                               |
|                   FIND YOUR PERFECT STAY                                      |
|    Experience world-class architecture, handcrafted comfort, and 5-star ease  |
|                                                                               |
|   +-----------------------------------------------------------------------+   |
|   | Check-in: 11/15 | Check-out: 11/18 | Guests: 2 | Category: Suite | [Search]|  |
|   +-----------------------------------------------------------------------+   |
+-------------------------------------------------------------------------------+
|  [Featured Deluxe Room]        [Executive Suite]        [Penthouse Panorama]  |
|  $199/night                    $299/night               $499/night            |
+-------------------------------------------------------------------------------+
```

### Complete Page Directory (21 Pages Implemented):
1. **Home (`/`)**: Premium landing page, hero search, facilities, categories, testimonials, CTA.
2. **Rooms (`/rooms`)**: Live search, date overlap filtering, category/price filters, room cards.
3. **Room Details (`/rooms/:id`)**: Gallery, amenity checklist, interactive booking widget, price calculation.
4. **About Us (`/about`)**: Hotel history, leadership team, brand pillars, awards.
5. **Contact & Concierge (`/contact`)**: Contact form, property map preview, hotlines, FAQ accordion.
6. **Guest Login (`/login`)**: Email/password sign-in with 1-click guest & admin demo buttons.
7. **Guest Register (`/register`)**: Full validation and instant session initialization.
8. **Guest Dashboard (`/dashboard`)**: Metric cards, next upcoming stay card, recent reservations.
9. **My Profile (`/profile`)**: Update full name, phone number, and change password.
10. **My Bookings (`/my-bookings`)**: Filter tabs (All, Upcoming, Completed, Cancelled), cancel actions.
11. **Booking Details / Invoice (`/bookings/:id`)**: Printable reservation voucher with invoice table.
12. **Payment Page (`/payment`)**: Demo checkout with live card preview, 1-click test card filler.
13. **Booking Confirmation (`/confirmation`)**: Celebration screen with booking ID reference.
14. **Admin Login (`/admin/login`)**: Dedicated staff portal authentication.
15. **Admin Dashboard (`/admin/dashboard`)**: 8 KPI cards, Bar Chart, Doughnut Chart, recent ledger.
16. **Manage Rooms (`/admin/rooms`)**: Inventory table with inline status toggles, edit & delete.
17. **Add Room (`/admin/rooms/add`)**: Create room form with live preview and multi-amenity selectors.
18. **Edit Room (`/admin/rooms/edit/:id`)**: Update room specifications and imagery.
19. **Manage Bookings (`/admin/bookings`)**: Check-in, check-out, and cancellation operations.
20. **Manage Users (`/admin/users`)**: User directory, booking counts, lifetime spend, role promotions.
21. **Admin Profile (`/admin/profile`)**: Master password update and runtime environment summary.

---

## 13. Project Structure

```
hotelpro/
├── client/                     # Frontend React Application
│   ├── public/                 # Static assets & icons
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── RoomCard.jsx
│   │   │   ├── SearchBox.jsx
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── AdminRoute.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── context/            # React Context Providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── BookingContext.jsx
│   │   ├── pages/              # 21 application pages
│   │   │   ├── Home.jsx
│   │   │   ├── Rooms.jsx
│   │   │   ├── RoomDetails.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── MyProfile.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   ├── BookingDetails.jsx
│   │   │   ├── BookingConfirmation.jsx
│   │   │   ├── PaymentPage.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ManageRooms.jsx
│   │   │   ├── AddRoom.jsx
│   │   │   ├── EditRoom.jsx
│   │   │   ├── ManageBookings.jsx
│   │   │   ├── ManageUsers.jsx
│   │   │   └── AdminProfile.jsx
│   │   ├── services/           # Axios API configuration
│   │   │   └── api.js
│   │   ├── styles/             # Custom luxury design system
│   │   │   └── custom.css
│   │   ├── App.jsx             # Main Router switchboard
│   │   └── main.jsx            # Application entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend Express REST API
│   ├── config/
│   │   └── db.js               # Mongoose & In-Memory MongoDB connector
│   ├── controllers/
│   │   ├── authController.js   # JWT Auth & Profile management
│   │   ├── roomController.js   # Room CRUD & Date Overlap Availability
│   │   ├── bookingController.js# Reservation workflows & cancellations
│   │   ├── paymentController.js# Mock payment processor
│   │   └── adminController.js  # Dashboard KPIs & Chart aggregations
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT Protect & AdminOnly guards
│   │   └── errorMiddleware.js  # Centralized Express error handler
│   ├── models/
│   │   ├── User.js             # User Schema with bcrypt hook
│   │   ├── Room.js             # Room & Amenity Schema
│   │   ├── Booking.js          # Booking Schema
│   │   └── Payment.js          # Payment Receipt Schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── roomRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── adminRoutes.js
│   ├── seed/
│   │   ├── seedData.js         # Curated luxury rooms & user dataset
│   │   └── seeder.js           # CLI and programmatic seed runner
│   ├── utils/
│   │   └── jwt.js              # Token signing utility
│   ├── .env.example
│   ├── package.json
│   ├── server.js               # Express application entry point
│   └── test-api.js             # Automated end-to-end API verification
│
├── .gitignore
├── .env.example
├── hotelpro.postman_collection.json
├── package.json                # Root orchestration scripts
└── README.md
```

---

## 14. Future Enhancements

- Integration with live Stripe / PayPal payment gateways
- Real-time front-desk notifications via Socket.io
- Multi-currency currency switcher (USD, EUR, GBP, JPY)
- Guest loyalty points & reward redemption system
- Multi-language localization (i18n)

---

## 15. Contributors & Evaluation Notice

- Developed as a production-grade full-stack hotel booking and operations management system.
- Suitable for university senior evaluations, portfolio presentations, mentor reviews, and production deployment.
