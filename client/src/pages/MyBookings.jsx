import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import {
  CalendarCheck,
  Calendar,
  BedDouble,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  XCircle,
  CreditCard,
  Eye,
  Trash2
} from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/my');
      if (res.data?.success) {
        setBookings(res.data.bookings || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation? If payment was made, your refund will be automatically recorded.')) {
      return;
    }

    setActionLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await api.put(`/bookings/${bookingId}/cancel`);
      if (res.data?.success) {
        setMessage('Reservation cancelled successfully. Any eligible refund has been processed.');
        fetchBookings();
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel booking');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Upcoming') return b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked-In';
    if (activeTab === 'Completed') return b.bookingStatus === 'Checked-Out';
    if (activeTab === 'Cancelled') return b.bookingStatus === 'Cancelled';
    return true;
  });

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

  return (
    <div className="py-5">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <div>
            <span className="section-tag">Booking History</span>
            <h1 className="display-6 fw-bold font-serif text-dark mb-1">My Reservations</h1>
            <p className="text-muted mb-0">View all your past, present, and upcoming luxury stays</p>
          </div>
          <Link to="/rooms" className="btn btn-gold rounded-3 mt-3 mt-md-0 d-inline-flex align-items-center gap-2">
            <BedDouble size={16} /> Explore New Stay
          </Link>
        </div>

        {/* Alerts */}
        {message && (
          <div className="alert alert-success py-2 px-3 small d-flex align-items-center gap-2 mb-4">
            <CheckCircle2 size={18} />
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-4">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Tab Filters */}
        <div className="d-flex gap-2 mb-4 pb-2 border-bottom overflow-x-auto">
          {['All', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`btn btn-sm rounded-pill px-3 py-2 fw-medium ${
                activeTab === tab
                  ? 'btn-dark'
                  : 'btn-outline-secondary border-0 text-muted'
              }`}
            >
              {tab === 'All' && `All (${bookings.length})`}
              {tab === 'Upcoming' && `Active / Upcoming (${bookings.filter(b => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked-In').length})`}
              {tab === 'Completed' && `Completed (${bookings.filter(b => b.bookingStatus === 'Checked-Out').length})`}
              {tab === 'Cancelled' && `Cancelled (${bookings.filter(b => b.bookingStatus === 'Cancelled').length})`}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner text="Fetching your reservations..." />
        ) : filteredBookings.length === 0 ? (
          <EmptyState
            title="No Bookings in This Category"
            description="You currently have no reservations matching this filter status."
            actionText="Reserve a Room"
            actionLink="/rooms"
          />
        ) : (
          <div className="d-flex flex-column gap-4">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="card luxury-card p-4 border-0">
                <div className="row g-4 align-items-center">
                  {/* Room Thumbnail */}
                  <div className="col-12 col-md-3">
                    <img
                      src={booking.room?.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'}
                      alt={booking.room?.roomType}
                      className="rounded-3 w-100"
                      style={{ height: '170px', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Room & Stay Details */}
                  <div className="col-12 col-md-5">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="badge badge-gold small">{booking.room?.roomType}</span>
                      <span className="badge bg-dark text-white small">Room #{booking.room?.roomNumber}</span>
                      {getStatusBadge(booking.bookingStatus)}
                    </div>
                    <h4 className="fw-bold font-serif text-dark mb-1">
                      {booking.room?.roomType} Suite
                    </h4>
                    <p className="text-muted small mb-2">
                      Booking Ref: <strong className="font-monospace text-dark">{booking.bookingId}</strong>
                    </p>

                    <div className="d-flex flex-wrap gap-3 text-secondary small">
                      <div className="d-flex align-items-center gap-1">
                        <Calendar size={14} className="text-warning" />
                        <span>{new Date(booking.checkIn).toLocaleDateString()} &rarr; {new Date(booking.checkOut).toLocaleDateString()}</span>
                      </div>
                      <div>
                        ({booking.nights} {booking.nights === 1 ? 'night' : 'nights'} • {booking.guests} Guests)
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Actions */}
                  <div className="col-12 col-md-4 text-md-end border-start-md ps-md-4">
                    <div className="mb-3">
                      <span className="text-muted small">Total Cost</span>
                      <div className="fs-3 fw-bold text-dark font-serif">${booking.totalAmount}</div>
                      <div>
                        <span className={`badge ${booking.paymentStatus === 'Paid' ? 'bg-success-subtle text-success' : booking.paymentStatus === 'Refunded' ? 'bg-info-subtle text-info' : 'bg-warning-subtle text-warning'}`}>
                          Payment: {booking.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="d-flex gap-2 justify-content-md-end flex-wrap">
                      <Link
                        to={`/bookings/${booking._id}`}
                        className="btn btn-outline-dark btn-sm rounded-3 d-flex align-items-center gap-1 px-3"
                      >
                        <Eye size={14} /> Voucher & Details
                      </Link>

                      {booking.paymentStatus === 'Pending' && booking.bookingStatus !== 'Cancelled' && (
                        <Link
                          to={`/payment?bookingId=${booking._id}`}
                          className="btn btn-warning btn-sm rounded-3 d-flex align-items-center gap-1 px-3 fw-bold"
                        >
                          <CreditCard size={14} /> Pay Now
                        </Link>
                      )}

                      {booking.bookingStatus !== 'Cancelled' && booking.bookingStatus !== 'Checked-Out' && (
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => handleCancelBooking(booking._id)}
                          className="btn btn-outline-danger btn-sm rounded-3 d-flex align-items-center gap-1 px-3"
                        >
                          <XCircle size={14} /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
