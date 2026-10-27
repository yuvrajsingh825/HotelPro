import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Building2,
  Calendar,
  Users,
  BedDouble,
  CreditCard,
  Printer,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MapPin,
  Clock,
  ShieldCheck,
  QrCode
} from 'lucide-react';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState(null);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/bookings/${id}`);
      if (res.data?.success) {
        setBooking(res.data.booking);
        setPayment(res.data.payment);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve booking information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking? Refund will be issued if payment was completed.')) {
      return;
    }

    setCancelling(true);
    try {
      const res = await api.put(`/bookings/${booking._id}/cancel`);
      if (res.data?.success) {
        setCancelMessage('Booking successfully cancelled and refund recorded.');
        fetchDetails();
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Generating booking receipt & voucher..." />;
  }

  if (error || !booking) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger p-4 rounded-3 d-inline-block">
          <h4>Unable to Load Booking</h4>
          <p>{error || 'Reservation could not be found.'}</p>
          <Link to="/my-bookings" className="btn btn-outline-danger mt-2">
            Back to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5">
      <div className="container">
        {/* Top Controls (Hidden in Print) */}
        <div className="no-print d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
          <Link to="/my-bookings" className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 rounded-pill px-3">
            <ArrowLeft size={16} /> Back to Reservations
          </Link>

          <div className="d-flex gap-2">
            <button
              onClick={() => window.print()}
              className="btn btn-dark btn-sm rounded-3 d-flex align-items-center gap-2 px-3"
            >
              <Printer size={16} /> Print Voucher / Invoice
            </button>

            {booking.bookingStatus !== 'Cancelled' && booking.bookingStatus !== 'Checked-Out' && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="btn btn-outline-danger btn-sm rounded-3 d-flex align-items-center gap-1 px-3"
              >
                <XCircle size={16} /> Cancel Stay
              </button>
            )}

            {booking.paymentStatus === 'Pending' && booking.bookingStatus !== 'Cancelled' && (
              <Link
                to={`/payment?bookingId=${booking._id}`}
                className="btn btn-warning btn-sm rounded-3 d-flex align-items-center gap-1 px-3 fw-bold"
              >
                <CreditCard size={16} /> Complete Payment
              </Link>
            )}
          </div>
        </div>

        {cancelMessage && (
          <div className="alert alert-success py-2 px-3 small d-flex align-items-center gap-2 mb-4 no-print">
            <CheckCircle2 size={16} />
            <span>{cancelMessage}</span>
          </div>
        )}

        {/* Printable Voucher Card */}
        <div className="card luxury-card p-4 p-md-5 border-0 shadow-sm print-invoice bg-white">
          {/* Header */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center pb-4 mb-4 border-bottom gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-dark text-warning p-3 rounded-3 d-flex align-items-center justify-content-center">
                <Building2 size={32} />
              </div>
              <div>
                <h3 className="fw-bold font-serif text-dark mb-0">Hotel<span style={{ color: '#c5a880' }}>Pro</span></h3>
                <div className="text-muted small">Official Guest Reservation Voucher & Invoice</div>
              </div>
            </div>

            <div className="text-sm-end">
              <span className="badge badge-gold px-3 py-2 fs-6 mb-1">
                Ref: {booking.bookingId}
              </span>
              <div className="text-muted small">
                Issued on {new Date(booking.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Status Banner */}
          <div className={`alert ${booking.bookingStatus === 'Confirmed' ? 'alert-success' : booking.bookingStatus === 'Cancelled' ? 'alert-danger' : 'alert-info'} p-3 rounded-3 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4`}>
            <div className="d-flex align-items-center gap-2">
              <CheckCircle2 size={20} />
              <div>
                <strong>Reservation Status: {booking.bookingStatus}</strong>
                <span className="mx-2">•</span>
                <span>Payment: {booking.paymentStatus}</span>
              </div>
            </div>
            <div className="small text-muted">
              Guaranteed Reservation
            </div>
          </div>

          {/* Booking Summary Columns */}
          <div className="row g-4 mb-5">
            {/* Guest Info */}
            <div className="col-12 col-md-6 col-lg-3">
              <h6 className="text-uppercase text-muted small fw-bold mb-3">Primary Guest</h6>
              <div className="fw-bold text-dark fs-6">{booking.guestName}</div>
              <div className="text-secondary small">{booking.guestEmail}</div>
              <div className="text-secondary small">{booking.guestPhone}</div>
              <div className="text-muted small mt-2">Guests: {booking.guests}</div>
            </div>

            {/* Room Details */}
            <div className="col-12 col-md-6 col-lg-3">
              <h6 className="text-uppercase text-muted small fw-bold mb-3">Accommodation</h6>
              <div className="fw-bold text-dark fs-6">{booking.room?.roomType} Suite</div>
              <div className="text-secondary small">Room #{booking.room?.roomNumber} (Floor {booking.room?.floor || 1})</div>
              <div className="text-secondary small">Bedding: {booking.room?.bedType}</div>
              <div className="text-secondary small">Area: {booking.room?.size || 350} sq ft</div>
            </div>

            {/* Stay Dates */}
            <div className="col-12 col-md-6 col-lg-3">
              <h6 className="text-uppercase text-muted small fw-bold mb-3">Schedule</h6>
              <div className="small">
                <span className="text-muted d-block">Check-in:</span>
                <strong className="text-dark">{new Date(booking.checkIn).toLocaleDateString()} (3:00 PM)</strong>
              </div>
              <div className="small mt-2">
                <span className="text-muted d-block">Check-out:</span>
                <strong className="text-dark">{new Date(booking.checkOut).toLocaleDateString()} (11:00 AM)</strong>
              </div>
              <div className="text-muted small mt-1">Duration: {booking.nights} {booking.nights === 1 ? 'night' : 'nights'}</div>
            </div>

            {/* Hotel Location & Security */}
            <div className="col-12 col-md-6 col-lg-3">
              <h6 className="text-uppercase text-muted small fw-bold mb-3">Property Details</h6>
              <div className="small text-secondary">
                <MapPin size={14} className="text-warning me-1" />
                100 Grand Boulevard, Waterfront Harbor, NY 10001
              </div>
              <div className="small text-secondary mt-1">
                Concierge: +1 (800) 555-HOTEL
              </div>
              <div className="d-flex align-items-center gap-1 text-success small mt-2">
                <ShieldCheck size={16} /> Verified Booking
              </div>
            </div>
          </div>

          {/* Payment & Invoice Breakdown */}
          <div className="border rounded-3 p-4 mb-4 bg-light">
            <h5 className="fw-bold font-serif text-dark mb-3">Billing & Payment Summary</h5>
            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0">
                <thead>
                  <tr className="border-bottom small text-muted text-uppercase">
                    <th>Description</th>
                    <th className="text-center">Rate</th>
                    <th className="text-center">Nights</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-bottom">
                    <td>
                      <div className="fw-bold text-dark">{booking.room?.roomType} Suite Room #{booking.room?.roomNumber}</div>
                      <div className="text-muted small">Standard luxury accommodation, daily housekeeping, organic bath amenities</div>
                    </td>
                    <td className="text-center">${booking.pricePerNight}</td>
                    <td className="text-center">{booking.nights}</td>
                    <td className="text-end fw-bold">${booking.pricePerNight * booking.nights}</td>
                  </tr>
                  <tr className="border-bottom text-muted small">
                    <td colSpan="3">Hospitality Tax & Destination Fee (10% included)</td>
                    <td className="text-end fw-medium text-dark">${Math.round(booking.totalAmount * 0.1)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="fs-5 fw-bold text-dark font-serif text-end pt-3">
                      Total Invoice Amount:
                    </td>
                    <td className="fs-4 fw-bold text-warning font-serif text-end pt-3">
                      ${booking.totalAmount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment Record Details if Paid */}
            {payment && (
              <div className="mt-3 pt-3 border-top small text-secondary d-flex flex-wrap justify-content-between gap-2">
                <div>
                  <strong>Payment ID:</strong> {payment.paymentId}
                </div>
                <div>
                  <strong>Transaction ID:</strong> {payment.transactionId}
                </div>
                <div>
                  <strong>Method:</strong> {payment.paymentMethod} (ending in {payment.cardLastFour})
                </div>
                <div>
                  <strong>Status:</strong> <span className="badge bg-success">{payment.paymentStatus}</span>
                </div>
              </div>
            )}
          </div>

          {/* Special Requests */}
          {booking.specialRequests && (
            <div className="p-3 bg-white border rounded-3 mb-4">
              <strong className="text-dark small d-block mb-1">Guest Special Requests:</strong>
              <p className="text-secondary small mb-0 fst-italic">"{booking.specialRequests}"</p>
            </div>
          )}

          {/* Footer note */}
          <div className="text-center text-muted small pt-3 border-top">
            Thank you for choosing HotelPro. Please present this confirmation voucher or booking reference at the front desk upon arrival.
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
