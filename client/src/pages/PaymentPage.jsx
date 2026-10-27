import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  CreditCard,
  ShieldCheck,
  Lock,
  Building2,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info
} from 'lucide-react';

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState(null);

  // Card Form State
  const [cardForm, setCardForm] = useState({
    cardHolder: user?.name || 'Sarah Jenkins',
    cardNumber: '4242 4242 4242 4242',
    expiry: '12/28',
    cvv: '888',
    paymentMethod: 'Demo Visa Card'
  });

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setError('No booking ID specified');
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/bookings/${bookingId}`);
        if (res.data?.success) {
          setBooking(res.data.booking);

          // If already paid, redirect to confirmation directly
          if (res.data.booking.paymentStatus === 'Paid') {
            navigate(`/confirmation?bookingId=${res.data.booking._id}`);
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load booking');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, navigate]);

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardForm({ ...cardForm, cardNumber: formatted });
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 3) {
      val = `${val.substring(0, 2)}/${val.substring(2)}`;
    }
    setCardForm({ ...cardForm, expiry: val });
  };

  const handleFillDemo = () => {
    setCardForm({
      cardHolder: user?.name || 'Alexander Sterling',
      cardNumber: '4242 4242 4242 4242',
      expiry: '12/28',
      cvv: '999',
      paymentMethod: 'Demo Mastercard'
    });
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setError(null);
    setPaying(true);

    try {
      const res = await api.post('/payments', {
        bookingId: booking._id,
        cardNumber: cardForm.cardNumber,
        cardHolder: cardForm.cardHolder,
        expiry: cardForm.expiry,
        cvv: cardForm.cvv,
        paymentMethod: cardForm.paymentMethod
      });

      if (res.data?.success) {
        navigate(`/confirmation?bookingId=${booking._id}&paymentId=${res.data.payment?.paymentId}`);
      }
    } catch (err) {
      setError(err.message || 'Payment processing failed');
      setPaying(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Setting up secure mock checkout..." />;
  }

  if (error || !booking) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger p-4 rounded-3 d-inline-block">
          <h4>Payment Initialization Error</h4>
          <p>{error || 'Booking could not be loaded.'}</p>
          <Link to="/my-bookings" className="btn btn-outline-danger mt-2">
            View My Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5">
      <div className="container">
        {/* Banner: Clearly labeled as DEMO/MOCK */}
        <div className="alert alert-warning border border-warning-subtle shadow-sm p-3 mb-4 rounded-3 d-flex align-items-center gap-3">
          <Info size={24} className="text-warning flex-shrink-0" />
          <div className="small">
            <strong>DEMO / MOCK PAYMENT WORKFLOW:</strong> This checkout runs in sandbox demo mode for testing and evaluation purposes. No real bank accounts or financial instruments will be charged.
          </div>
        </div>

        <div className="row g-5">
          {/* LEFT: Booking Summary */}
          <div className="col-12 col-lg-5 order-lg-2">
            <div className="card luxury-card p-4 sticky-top border-0 shadow-sm" style={{ top: '100px' }}>
              <h5 className="fw-bold font-serif text-dark mb-3">Booking Summary</h5>

              <div className="d-flex gap-3 mb-3 pb-3 border-bottom">
                <img
                  src={booking.room?.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80'}
                  alt={booking.room?.roomType}
                  className="rounded-3"
                  style={{ width: '100px', height: '80px', objectFit: 'cover' }}
                />
                <div>
                  <h6 className="fw-bold text-dark font-serif mb-1">{booking.room?.roomType} Suite</h6>
                  <div className="text-muted small">Room #{booking.room?.roomNumber}</div>
                  <div className="text-muted small">{booking.guests} Guests • {booking.nights} Nights</div>
                </div>
              </div>

              {/* Schedule */}
              <div className="bg-light p-3 rounded-3 mb-3 small">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted">Check-in:</span>
                  <strong className="text-dark">{new Date(booking.checkIn).toLocaleDateString()}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Check-out:</span>
                  <strong className="text-dark">{new Date(booking.checkOut).toLocaleDateString()}</strong>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="small text-secondary mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Room rate (${booking.pricePerNight} x {booking.nights} nts)</span>
                  <span className="fw-bold text-dark">${booking.pricePerNight * booking.nights}</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Hospitality Tax & Destination Fee (10%)</span>
                  <span className="fw-bold text-dark">${Math.round(booking.totalAmount * 0.1)}</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between fs-5 fw-bold text-dark font-serif">
                  <span>Grand Total</span>
                  <span className="text-warning">${booking.totalAmount}</span>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2 text-success small pt-2 border-top">
                <ShieldCheck size={18} />
                <span>Instant Confirmation & Real-Time Lock</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Payment Form */}
          <div className="col-12 col-lg-7 order-lg-1">
            <div className="card luxury-card p-4 p-md-5 border-0">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <span className="section-tag">Step 2 of 2</span>
                  <h3 className="fw-bold font-serif text-dark mb-0">Payment Details</h3>
                </div>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="btn btn-sm btn-outline-warning text-dark d-flex align-items-center gap-1"
                >
                  <Sparkles size={14} className="text-warning" /> Auto-Fill Demo Card
                </button>
              </div>

              {error && (
                <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-4">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Mock Credit Card Visual */}
              <div
                className="rounded-4 p-4 text-white mb-4 shadow"
                style={{
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
                  minHeight: '190px',
                  border: '1px solid #c5a880'
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <CreditCard size={32} className="text-warning" />
                  <span className="badge badge-gold">MOCK DEMO CARD</span>
                </div>
                <div className="fs-5 tracking-widest font-monospace mb-4">
                  {cardForm.cardNumber || '•••• •••• •••• ••••'}
                </div>
                <div className="d-flex justify-content-between align-items-end text-uppercase small">
                  <div>
                    <div className="text-muted" style={{ fontSize: '0.65rem' }}>Cardholder</div>
                    <div className="fw-bold">{cardForm.cardHolder || 'GUEST NAME'}</div>
                  </div>
                  <div>
                    <div className="text-muted" style={{ fontSize: '0.65rem' }}>Expires</div>
                    <div className="fw-bold">{cardForm.expiry || 'MM/YY'}</div>
                  </div>
                </div>
              </div>

              {/* Form Controls */}
              <form onSubmit={handleProcessPayment}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Cardholder Full Name</label>
                  <input
                    type="text"
                    className="form-control py-2 rounded-3"
                    placeholder="Name as it appears on card"
                    value={cardForm.cardHolder}
                    onChange={(e) => setCardForm({ ...cardForm, cardHolder: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Card Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <CreditCard size={18} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0 py-2 rounded-end-3 font-monospace"
                      placeholder="4242 4242 4242 4242"
                      value={cardForm.cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength="19"
                      required
                    />
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted">Expiration Date</label>
                    <input
                      type="text"
                      className="form-control py-2 rounded-3 text-center font-monospace"
                      placeholder="MM/YY"
                      value={cardForm.expiry}
                      onChange={handleExpiryChange}
                      maxLength="5"
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted">CVV / CVC</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <Lock size={16} className="text-muted" />
                      </span>
                      <input
                        type="password"
                        className="form-control border-start-0 ps-0 py-2 rounded-end-3 text-center font-monospace"
                        placeholder="•••"
                        value={cardForm.cvv}
                        onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.substring(0, 4) })}
                        maxLength="4"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={paying}
                  className="btn btn-gold w-100 py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2 fs-6"
                >
                  {paying ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                      <span>Simulating Demo Payment Authorization...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      <span>Authorize Demo Payment (${booking.totalAmount})</span>
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-4 text-muted small">
                By completing this mock transaction, your room status will update in real time to Confirmed.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
