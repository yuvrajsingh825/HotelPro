const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Payment = require('../models/Payment');

// Helper to generate a unique booking reference
const generateBookingId = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `HP-${year}-${random}`;
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const {
      roomId,
      checkIn,
      checkOut,
      guests,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests
    } = req.body;

    if (!roomId || !checkIn || !checkOut || !guests || !guestName || !guestEmail || !guestPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all booking details: roomId, checkIn, checkOut, guests, guestName, guestEmail, guestPhone'
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid check-in or check-out date'
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be strictly after check-in date'
      });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Selected room not found'
      });
    }

    if (room.status !== 'Available') {
      return res.status(400).json({
        success: false,
        message: `This room is currently marked as ${room.status} and cannot be booked.`
      });
    }

    if (Number(guests) > room.capacity) {
      return res.status(400).json({
        success: false,
        message: `Maximum guest capacity for this room is ${room.capacity}. You selected ${guests} guests.`
      });
    }

    // Verify room is not already booked during this date range (date overlap check)
    const existingConflict = await Booking.findOne({
      room: room._id,
      bookingStatus: { $in: ['Pending', 'Confirmed', 'Checked-In'] },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate }
    });

    if (existingConflict) {
      return res.status(400).json({
        success: false,
        message: 'This room is already reserved for the selected dates. Please choose different dates or another room.'
      });
    }

    // Calculate nights & total amount
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const totalAmount = nights * room.price;

    const bookingId = generateBookingId();

    const booking = await Booking.create({
      bookingId,
      user: req.user._id,
      room: room._id,
      guestName: guestName.trim(),
      guestEmail: guestEmail.toLowerCase().trim(),
      guestPhone: guestPhone.trim(),
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: Number(guests),
      nights,
      pricePerNight: room.price,
      totalAmount,
      bookingStatus: 'Pending',
      paymentStatus: 'Pending',
      specialRequests: specialRequests || ''
    });

    const populatedBooking = await Booking.findById(booking._id).populate('room');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully. Please proceed with payment.',
      booking: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking by ID (or booking reference)
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const isObjectId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: req.params.id } : { bookingId: req.params.id };

    const booking = await Booking.findOne(query)
      .populate('room')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify ownership or admin role
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    // Include payment if exists
    const payment = await Payment.findOne({ booking: booking._id });

    res.json({
      success: true,
      booking,
      payment: payment || null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('room');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Ensure authorized
    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if (booking.bookingStatus === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking is already cancelled'
      });
    }

    if (booking.bookingStatus === 'Checked-Out') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a booking that has already completed/checked out'
      });
    }

    booking.bookingStatus = 'Cancelled';
    if (booking.paymentStatus === 'Paid') {
      booking.paymentStatus = 'Refunded';

      // Update payment record if exists
      await Payment.findOneAndUpdate(
        { booking: booking._id },
        { paymentStatus: 'Refunded' }
      );
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully. Any eligible refund has been processed.',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const { status, search, sort } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.bookingStatus = status;
    }

    if (search) {
      query.$or = [
        { bookingId: { $regex: search, $options: 'i' } },
        { guestName: { $regex: search, $options: 'i' } },
        { guestEmail: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'amount_desc') sortOption = { totalAmount: -1 };
    if (sort === 'checkin_asc') sortOption = { checkIn: 1 };

    const bookings = await Booking.find(query)
      .populate('room')
      .populate('user', 'name email phone')
      .sort(sortOption);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      count: bookings.length,
      total,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Admin)
// @route   PATCH /api/admin/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res, next) => {
  try {
    const { bookingStatus } = req.body;
    const allowed = ['Pending', 'Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled'];

    if (!allowed.includes(bookingStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowed.join(', ')}`
      });
    }

    const booking = await Booking.findById(req.params.id).populate('room');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.bookingStatus = bookingStatus;

    if (bookingStatus === 'Cancelled' && booking.paymentStatus === 'Paid') {
      booking.paymentStatus = 'Refunded';
      await Payment.findOneAndUpdate(
        { booking: booking._id },
        { paymentStatus: 'Refunded' }
      );
    }

    await booking.save();

    res.json({
      success: true,
      message: `Booking status updated to ${bookingStatus}`,
      booking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus
};
