const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true
    },
    guestName: {
      type: String,
      required: [true, 'Guest name is required'],
      trim: true
    },
    guestEmail: {
      type: String,
      required: [true, 'Guest email is required'],
      trim: true
    },
    guestPhone: {
      type: String,
      required: [true, 'Guest phone is required'],
      trim: true
    },
    checkIn: {
      type: Date,
      required: [true, 'Check-in date is required']
    },
    checkOut: {
      type: Date,
      required: [true, 'Check-out date is required']
    },
    guests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'At least 1 guest is required']
    },
    nights: {
      type: Number,
      required: true,
      min: [1, 'Minimum 1 night required']
    },
    pricePerNight: {
      type: Number,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    bookingStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled'],
      default: 'Confirmed'
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Paid'
    },
    specialRequests: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
