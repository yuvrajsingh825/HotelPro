import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Public Pages
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import RoomDetails from './pages/RoomDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

// User Pages
import UserDashboard from './pages/UserDashboard';
import MyProfile from './pages/MyProfile';
import MyBookings from './pages/MyBookings';
import BookingDetails from './pages/BookingDetails';
import BookingConfirmation from './pages/BookingConfirmation';
import PaymentPage from './pages/PaymentPage';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ManageRooms from './pages/ManageRooms';
import AddRoom from './pages/AddRoom';
import EditRoom from './pages/EditRoom';
import ManageBookings from './pages/ManageBookings';
import ManageUsers from './pages/ManageUsers';
import AdminProfile from './pages/AdminProfile';

function App() {
  const location = useLocation();
  const isAdminDashboardView = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Do not show public navbar on admin dashboard pages */}
      {!isAdminDashboardView && <Navbar />}

      <main className="flex-grow-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MyProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings/:id"
            element={
              <ProtectedRoute>
                <BookingDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/confirmation"
            element={
              <ProtectedRoute>
                <BookingConfirmation />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/rooms"
            element={
              <AdminRoute>
                <ManageRooms />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/rooms/add"
            element={
              <AdminRoute>
                <AddRoom />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/rooms/edit/:id"
            element={
              <AdminRoute>
                <EditRoom />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <AdminRoute>
                <ManageBookings />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <ManageUsers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <AdminRoute>
                <AdminProfile />
              </AdminRoute>
            }
          />

          {/* 404 Catch All */}
          <Route
            path="*"
            element={
              <div className="container py-5 text-center my-5">
                <h1 className="display-1 fw-bold text-dark font-serif">404</h1>
                <h3 className="fw-bold text-dark font-serif mb-3">Page Not Found</h3>
                <p className="text-muted mb-4">The page you are looking for does not exist or has been relocated.</p>
                <a href="/" className="btn btn-gold px-4 py-2">
                  Return to Home
                </a>
              </div>
            }
          />
        </Routes>
      </main>

      {/* Do not show public footer on admin dashboard pages */}
      {!isAdminDashboardView && <Footer />}
    </div>
  );
}

export default App;
