const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// @desc    Process mock payment for a booking
// @route   POST /api/payments
// @access  Private
const processPayment = async (req, res, next) => {
  try {
    const { bookingId, cardNumber, cardHolder, expiry, cvv, paymentMethod } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID is required'
      });
    }

    // Basic validation for mock payment
    if (!cardNumber || !cardHolder || !expiry || !cvv) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all card payment details (Card Number, Cardholder Name, Expiry, CVV)'
      });
    }

    const cleanCard = cardNumber.replace(/[\s-]/g, '');
    if (cleanCard.length < 13 || cleanCard.length > 19 || !/^\d+$/.test(cleanCard)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid card number format. Please enter a valid 13-19 digit card number.'
      });
    }

    if (!/^\d{3,4}$/.test(cvv.trim())) {
      return res.status(400).json({
        success: false,
        message: 'CVV must be 3 or 4 digits'
      });
    }

    // Find booking
    const booking = await Booking.findById(bookingId).populate('room');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check ownership
    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay for this booking'
      });
    }

    if (booking.paymentStatus === 'Paid') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been paid for'
      });
    }

    if (booking.bookingStatus === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot pay for a cancelled booking'
      });
    }

    // Generate mock transaction identifiers
    const timestamp = Date.now().toString().slice(-6);
    const paymentId = `PAY-HP-${timestamp}`;
    const transactionId = `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const cardLastFour = cleanCard.slice(-4);

    // Create payment record
    const payment = await Payment.create({
      paymentId,
      booking: booking._id,
      user: req.user._id,
      amount: booking.totalAmount,
      paymentMethod: paymentMethod || 'Demo Card Payment',
      paymentStatus: 'Paid',
      transactionId,
      cardLastFour
    });

    // Update booking status
    booking.paymentStatus = 'Paid';
    booking.bookingStatus = 'Confirmed';
    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Demo payment completed successfully! Your booking is now confirmed.',
      payment,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment details by booking ID
// @route   GET /api/payments/:bookingId
// @access  Private
const getPaymentByBooking = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ booking: req.params.bookingId })
      .populate('booking')
      .populate('user', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'No payment record found for this booking'
      });
    }

    // Check ownership or admin
    if (
      payment.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this payment receipt'
      });
    }

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  processPayment,
  getPaymentByBooking
};
