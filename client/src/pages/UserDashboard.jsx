import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import {
  CalendarCheck,
  CalendarX,
  CreditCard,
  BedDouble,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const res = await api.get('/bookings/my');
        if (res.data?.success) {
          setBookings(res.data.bookings || []);
        }
      } catch (err) {
        console.error('Failed to load my bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, []);

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked-In');
  const cancelledBookings = bookings.filter((b) => b.bookingStatus === 'Cancelled');
  const totalSpent = bookings
    .filter((b) => b.paymentStatus === 'Paid')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  // Find next upcoming booking
  const upcomingStay = confirmedBookings.find((b) => new Date(b.checkIn) >= new Date()) || confirmedBookings[0];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span className="badge badge-available">Confirmed</span>;
      case 'Checked-In':
        return <span className="badge bg-primary-subtle text-primary border border-primary-subtle">Checked-In</span>;
      case 'Checked-Out':
        return <span className="badge bg-secondary-subtle text-secondary border">Checked-Out</span>;
      case 'Cancelled':
        return <span className="badge badge-occupied">Cancelled</span>;
      default:
        return <span className="badge badge-maintenance">{status}</span>;
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your guest dashboard..." />;
  }

  return (
    <div className="py-5">
      <div className="container">
        {/* Welcome Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 pb-3 border-bottom">
          <div>
            <span className="section-tag">Guest Portal</span>
            <h1 className="display-6 fw-bold font-serif text-dark mb-1">
              Welcome Back, {user?.name}
            </h1>
            <p className="text-muted mb-0">Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
          </div>
          <div className="mt-3 mt-md-0 d-flex gap-2">
            <Link to="/rooms" className="btn btn-gold rounded-3 d-flex align-items-center gap-2">
              <BedDouble size={16} /> Book Another Stay
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="row g-4 mb-5">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card">
              <div>
                <span className="text-muted small fw-bold">Active / Upcoming</span>
                <h3 className="fw-bold text-dark font-serif mt-1 mb-0">{confirmedBookings.length}</h3>
              </div>
              <div className="stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
                <CalendarCheck size={26} />
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card">
              <div>
                <span className="text-muted small fw-bold">Total Reservations</span>
                <h3 className="fw-bold text-dark font-serif mt-1 mb-0">{totalBookings}</h3>
              </div>
              <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <BedDouble size={26} />
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card">
              <div>
                <span className="text-muted small fw-bold">Cancelled Stays</span>
                <h3 className="fw-bold text-dark font-serif mt-1 mb-0">{cancelledBookings.length}</h3>
              </div>
              <div className="stat-icon" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
                <CalendarX size={26} />
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card">
              <div>
                <span className="text-muted small fw-bold">Total Spent</span>
                <h3 className="fw-bold text-dark font-serif mt-1 mb-0">${totalSpent}</h3>
              </div>
              <div className="stat-icon" style={{ backgroundColor: '#fbf7f2', color: '#c5a880' }}>
                <CreditCard size={26} />
              </div>
            </div>
          </div>
        </div>

        {/* Next Upcoming Stay Card (if exists) */}
        {upcomingStay && (
          <div className="card luxury-card p-4 mb-5 border-0 bg-white">
            <div className="row align-items-center g-4">
              <div className="col-12 col-md-4">
                <img
                  src={upcomingStay.room?.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'}
                  alt={upcomingStay.room?.roomType}
                  className="rounded-3 w-100"
                  style={{ height: '180px', objectFit: 'cover' }}
                />
              </div>
              <div className="col-12 col-md-5">
                <span className="badge badge-gold mb-2">Next Upcoming Stay</span>
                <h4 className="fw-bold font-serif text-dark mb-1">
                  {upcomingStay.room?.roomType} Suite #{upcomingStay.room?.roomNumber}
                </h4>
                <p className="text-muted small mb-2 d-flex align-items-center gap-1">
                  <MapPin size={14} className="text-warning" /> 100 Grand Boulevard, Waterfront Harbor
                </p>
                <div className="d-flex align-items-center gap-3 text-secondary small">
                  <div>
                    <strong>Check-in:</strong> {new Date(upcomingStay.checkIn).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Check-out:</strong> {new Date(upcomingStay.checkOut).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-3 text-md-end">
                <div className="text-muted small">Reservation Ref</div>
                <div className="fw-bold text-dark font-serif fs-5 mb-2">{upcomingStay.bookingId}</div>
                <Link to={`/bookings/${upcomingStay._id}`} className="btn btn-outline-dark btn-sm rounded-3">
                  View Voucher & Invoice
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Recent Bookings Table */}
        <div className="card luxury-card p-4 border-0">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h5 className="fw-bold font-serif text-dark mb-1">Recent Booking History</h5>
              <p className="text-muted small mb-0">Overview of your reservations and current payment statuses</p>
            </div>
            <Link to="/my-bookings" className="btn btn-sm btn-outline-secondary rounded-pill px-3">
              View All Bookings
            </Link>
          </div>

          {bookings.length === 0 ? (
            <EmptyState
              title="No Bookings Found"
              description="You have not made any reservations yet. Browse our luxury suites to plan your first stay."
              actionText="Explore Suites"
              actionLink="/rooms"
            />
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr className="small text-muted text-uppercase">
                    <th>Booking Ref</th>
                    <th>Suite / Room</th>
                    <th>Stay Dates</th>
                    <th>Guests</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 5).map((booking) => (
                    <tr key={booking._id}>
                      <td className="fw-bold text-dark font-monospace small">
                        {booking.bookingId}
                      </td>
                      <td>
                        <div className="fw-bold text-dark">{booking.room?.roomType}</div>
                        <div className="text-muted small">Room #{booking.room?.roomNumber}</div>
                      </td>
                      <td className="small text-secondary">
                        {new Date(booking.checkIn).toLocaleDateString()} &rarr; {new Date(booking.checkOut).toLocaleDateString()}
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                          ({booking.nights} {booking.nights === 1 ? 'night' : 'nights'})
                        </div>
                      </td>
                      <td className="small text-secondary">{booking.guests} Guests</td>
                      <td className="fw-bold text-dark">${booking.totalAmount}</td>
                      <td>
                        <span className={`badge ${booking.paymentStatus === 'Paid' ? 'bg-success-subtle text-success' : booking.paymentStatus === 'Refunded' ? 'bg-info-subtle text-info' : 'bg-warning-subtle text-warning'}`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td>{getStatusBadge(booking.bookingStatus)}</td>
                      <td className="text-end">
                        <Link
                          to={`/bookings/${booking._id}`}
                          className="btn btn-sm btn-outline-dark rounded-3 px-3"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
