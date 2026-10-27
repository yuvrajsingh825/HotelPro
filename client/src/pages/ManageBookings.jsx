import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import api from '../services/api';
import {
  CalendarCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Eye,
  UserCheck,
  LogOut,
  XCircle,
  Clock
} from 'lucide-react';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/bookings');
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

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const res = await api.patch(`/admin/bookings/${bookingId}/status`, {
        bookingStatus: newStatus
      });
      if (res.data?.success) {
        setMessage(`Booking status updated to ${newStatus}`);
        setBookings(
          bookings.map((b) =>
            b._id === bookingId ? { ...b, bookingStatus: newStatus } : b
          )
        );
      }
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'All' || b.bookingStatus === statusFilter;
    const matchesSearch =
      b.bookingId.toLowerCase().includes(search.toLowerCase()) ||
      b.guestName.toLowerCase().includes(search.toLowerCase()) ||
      b.guestEmail.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
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
    <div className="d-flex min-vh-100 bg-light">
      <AdminSidebar />

      <div className="flex-grow-1 p-4 p-md-5 overflow-auto" style={{ maxHeight: '100vh' }}>
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
          <div>
            <span className="section-tag">Front Desk & Concierge Operations</span>
            <h1 className="display-6 fw-bold font-serif text-dark mb-1">Manage All Bookings</h1>
            <p className="text-muted mb-0">Monitor check-ins, departures, cancellations, and reservation statuses</p>
          </div>
        </div>

        {/* Alerts */}
        {message && (
          <div className="alert alert-success py-2 px-3 small d-flex align-items-center gap-2 mb-4">
            <CheckCircle2 size={16} />
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-4">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Filter Bar */}
        <div className="card luxury-card p-3 mb-4 border-0">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Search size={16} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search by Booking ID, Guest Name, or Email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-12 col-md-4">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Booking Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Checked-In">Checked-In</option>
                <option value="Checked-Out">Checked-Out</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="col-12 col-md-2 d-flex align-items-center justify-content-end">
              <span className="badge bg-light text-secondary border p-2">
                {filteredBookings.length} of {bookings.length}
              </span>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        {loading ? (
          <LoadingSpinner text="Retrieving booking ledger..." />
        ) : filteredBookings.length === 0 ? (
          <EmptyState
            title="No Bookings Found"
            description="No reservations match the specified search or filter criteria."
            actionText="Clear Filters"
            onAction={() => {
              setSearch('');
              setStatusFilter('All');
            }}
          />
        ) : (
          <div className="card luxury-card border-0 p-3">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr className="small text-muted text-uppercase">
                    <th>Booking Ref</th>
                    <th>Guest</th>
                    <th>Room</th>
                    <th>Dates & Nights</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th className="text-end">Manage Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b._id}>
                      <td className="fw-bold font-monospace small text-dark">
                        {b.bookingId}
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">{b.guestName}</div>
                        <div className="text-muted small">{b.guestEmail}</div>
                        <div className="text-muted small">{b.guestPhone}</div>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">{b.room?.roomType}</div>
                        <div className="text-muted small">Room #{b.room?.roomNumber}</div>
                      </td>
                      <td className="small text-secondary">
                        <div>
                          {new Date(b.checkIn).toLocaleDateString()} &rarr; {new Date(b.checkOut).toLocaleDateString()}
                        </div>
                        <div className="text-muted">
                          {b.nights} {b.nights === 1 ? 'night' : 'nights'} • {b.guests} Guests
                        </div>
                      </td>
                      <td className="fw-bold text-dark font-serif fs-6">
                        ${b.totalAmount}
                      </td>
                      <td>
                        <span className={`badge ${b.paymentStatus === 'Paid' ? 'bg-success-subtle text-success' : b.paymentStatus === 'Refunded' ? 'bg-info-subtle text-info' : 'bg-warning-subtle text-warning'}`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td>{getStatusBadge(b.bookingStatus)}</td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-1 flex-wrap">
                          <Link
                            to={`/bookings/${b._id}`}
                            className="btn btn-sm btn-outline-secondary p-1 px-2"
                            title="View Voucher"
                          >
                            <Eye size={14} /> View
                          </Link>

                          {b.bookingStatus === 'Pending' && (
                            <button
                              type="button"
                              onClick={() => handleStatusUpdate(b._id, 'Confirmed')}
                              className="btn btn-sm btn-success p-1 px-2 small"
                              title="Confirm Booking"
                            >
                              Confirm
                            </button>
                          )}

                          {b.bookingStatus === 'Confirmed' && (
                            <button
                              type="button"
                              onClick={() => handleStatusUpdate(b._id, 'Checked-In')}
                              className="btn btn-sm btn-primary p-1 px-2 small"
                              title="Check-in Guest"
                            >
                              Check-In
                            </button>
                          )}

                          {b.bookingStatus === 'Checked-In' && (
                            <button
                              type="button"
                              onClick={() => handleStatusUpdate(b._id, 'Checked-Out')}
                              className="btn btn-sm btn-secondary p-1 px-2 small"
                              title="Check-out Guest"
                            >
                              Check-Out
                            </button>
                          )}

                          {b.bookingStatus !== 'Cancelled' && b.bookingStatus !== 'Checked-Out' && (
                            <button
                              type="button"
                              onClick={() => handleStatusUpdate(b._id, 'Cancelled')}
                              className="btn btn-sm btn-outline-danger p-1 px-2 small"
                              title="Cancel Reservation"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBookings;
