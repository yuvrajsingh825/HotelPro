import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  CheckCircle2,
  Calendar,
  BedDouble,
  CreditCard,
  MapPin,
  ArrowRight,
  Printer,
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';

const BookingConfirmation = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const paymentId = searchParams.get('paymentId');

  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfirmedBooking = async () => {
      if (!bookingId) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get(`/bookings/${bookingId}`);
        if (res.data?.success) {
          setBooking(res.data.booking);
          setPayment(res.data.payment);
        }
      } catch (err) {
        console.error('Failed to load confirmation details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmedBooking();
  }, [bookingId]);

  if (loading) {
    return <LoadingSpinner text="Generating confirmation receipt..." />;
  }

  return (
    <div className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="card luxury-card p-4 p-md-5 border-0 shadow-lg text-center">
              {/* Celebration Icon */}
              <div className="mb-4">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center text-success mb-3 shadow"
                  style={{ width: '84px', height: '84px', backgroundColor: '#ecfdf5', border: '3px solid #10b981' }}
                >
                  <CheckCircle2 size={46} />
                </div>
                <span className="badge badge-gold d-block mx-auto mb-2" style={{ maxWidth: '200px' }}>
                  <Sparkles size={14} className="me-1" /> Reservation Confirmed
                </span>
                <h1 className="display-5 fw-bold font-serif text-dark mb-2">
                  Thank You for Your Reservation!
                </h1>
                <p className="text-secondary lead mx-auto" style={{ maxWidth: '580px' }}>
                  We are delighted to welcome you to HotelPro. A confirmation email and printable stay voucher have been generated for your convenience.
                </p>
              </div>

              {/* Reference ID Pill */}
              <div className="bg-light p-3 rounded-4 border d-inline-block mx-auto mb-4" style={{ minWidth: '320px' }}>
                <div className="small text-muted text-uppercase tracking-wider">Booking Reference</div>
                <div className="fs-3 fw-bold text-dark font-monospace">
                  {booking?.bookingId || 'HP-CONFIRMED'}
                </div>
                {paymentId && (
                  <div className="text-muted small">
                    Payment ID: <span className="font-monospace text-dark">{paymentId}</span>
                  </div>
                )}
              </div>

              {/* Booking Highlights Card */}
              {booking && (
                <div className="card bg-white border rounded-4 p-4 text-start mb-4 shadow-sm">
                  <h5 className="fw-bold font-serif text-dark mb-3 border-bottom pb-2">
                    Reservation Highlights
                  </h5>
                  <div className="row g-3">
                    <div className="col-12 col-sm-6">
                      <div className="text-muted small">Suite / Accommodation</div>
                      <div className="fw-bold text-dark fs-6">
                        {booking.room?.roomType} Suite (Room #{booking.room?.roomNumber})
                      </div>
                      <div className="text-muted small">Bed: {booking.room?.bedType} Bed</div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div className="text-muted small">Guest Details</div>
                      <div className="fw-bold text-dark">{booking.guestName}</div>
                      <div className="text-muted small">{booking.guestEmail} • {booking.guestPhone}</div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div className="text-muted small">Stay Dates</div>
                      <div className="fw-bold text-dark">
                        {new Date(booking.checkIn).toLocaleDateString()} &rarr; {new Date(booking.checkOut).toLocaleDateString()}
                      </div>
                      <div className="text-muted small">
                        {booking.nights} {booking.nights === 1 ? 'night' : 'nights'} • {booking.guests} Guests
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div className="text-muted small">Amount Paid</div>
                      <div className="fs-4 fw-bold text-warning font-serif">
                        ${booking.totalAmount}
                      </div>
                      <span className="badge bg-success-subtle text-success">
                        Status: Paid & Confirmed
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Arrival Guidelines */}
              <div className="p-3 bg-light rounded-3 text-start small text-secondary mb-4">
                <div className="d-flex align-items-center gap-2 fw-bold text-dark mb-1">
                  <MapPin size={16} className="text-warning" /> Location & Check-in
                </div>
                <div>100 Grand Boulevard, Waterfront Harbor, NY 10001</div>
                <div>Check-in opens at 3:00 PM. Please present a valid government-issued photo ID upon arrival.</div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                {booking && (
                  <Link
                    to={`/bookings/${booking._id}`}
                    className="btn btn-gold px-4 py-2 d-flex align-items-center gap-2"
                  >
                    View Voucher & Invoice <ArrowRight size={16} />
                  </Link>
                )}
                <Link to="/my-bookings" className="btn btn-outline-dark px-4 py-2">
                  My Bookings
                </Link>
                <Link to="/" className="btn btn-link text-muted text-decoration-none">
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
