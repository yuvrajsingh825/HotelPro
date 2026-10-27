const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Please provide a room number'],
      unique: true,
      trim: true
    },
    roomType: {
      type: String,
      required: [true, 'Please specify the room type'],
      enum: ['Standard Room', 'Deluxe Room', 'Executive Room', 'Suite', 'Family Room']
    },
    description: {
      type: String,
      required: [true, 'Please provide a room description'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Please specify the price per night'],
      min: [0, 'Price must be greater than or equal to 0']
    },
    capacity: {
      type: Number,
      required: [true, 'Please specify maximum guest capacity'],
      min: [1, 'Capacity must be at least 1 guest']
    },
    bedType: {
      type: String,
      required: [true, 'Please specify the bed type'],
      enum: ['Single', 'Double', 'Queen', 'King', 'Twin']
    },
    amenities: {
      type: [String],
      default: ['WiFi', 'AC', 'TV', 'Room Service']
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one room image URL'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A room must have at least one image'
      }
    },
    status: {
      type: String,
      enum: ['Available', 'Maintenance', 'Occupied'],
      default: 'Available'
    },
    size: {
      type: Number, // square feet
      default: 350
    },
    floor: {
      type: Number,
      default: 1
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Room', roomSchema);
