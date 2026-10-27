const Room = require('../models/Room');
const Booking = require('../models/Booking');

// @desc    Get all rooms with filtering, search & pagination
// @route   GET /api/rooms
// @access  Public
const getAllRooms = async (req, res, next) => {
  try {
    const {
      search,
      roomType,
      minPrice,
      maxPrice,
      capacity,
      bedType,
      status,
      sort
    } = req.query;

    const query = {};

    // Filter by status (default shows all or filtered by admin/public)
    if (status) {
      query.status = status;
    }

    // Filter by roomType
    if (roomType && roomType !== 'All') {
      query.roomType = roomType;
    }

    // Filter by bedType
    if (bedType && bedType !== 'All') {
      query.bedType = bedType;
    }

    // Filter by capacity
    if (capacity) {
      query.capacity = { $gte: Number(capacity) };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Search by text in roomNumber or description
    if (search) {
      query.$or = [
        { roomNumber: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { roomType: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating_desc') sortOption = { rating: -1 };
    if (sort === 'capacity_desc') sortOption = { capacity: -1 };

    const rooms = await Room.find(query).sort(sortOption);
    const total = await Room.countDocuments(query);

    res.json({
      success: true,
      count: rooms.length,
      total,
      rooms
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room by ID
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.json({
      success: true,
      room
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check real-time room availability based on date overlap
// @route   GET /api/rooms/available
// @access  Public
const getAvailableRooms = async (req, res, next) => {
  try {
    const { checkIn, checkOut, guests, roomType } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both check-in and check-out dates'
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid check-in or check-out date format'
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be strictly after check-in date'
      });
    }

    // Calculate number of nights
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    // Find all bookings that overlap with requested range:
    // Overlap condition: booking.checkIn < reqCheckOut AND booking.checkOut > reqCheckIn
    // Only count active bookings (not Cancelled)
    const conflictingBookings = await Booking.find({
      bookingStatus: { $in: ['Pending', 'Confirmed', 'Checked-In'] },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate }
    }).select('room');

    const bookedRoomIds = conflictingBookings.map((b) => b.room.toString());

    // Build room query
    const roomQuery = {
      _id: { $nin: bookedRoomIds },
      status: 'Available'
    };

    if (guests) {
      roomQuery.capacity = { $gte: Number(guests) };
    }

    if (roomType && roomType !== 'All') {
      roomQuery.roomType = roomType;
    }

    const availableRooms = await Room.find(roomQuery).sort({ price: 1 });

    // Append estimated total price for the nights
    const roomsWithEstimate = availableRooms.map((room) => {
      const roomObj = room.toObject();
      roomObj.nights = nights;
      roomObj.estimatedTotal = room.price * nights;
      return roomObj;
    });

    res.json({
      success: true,
      nights,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      count: roomsWithEstimate.length,
      rooms: roomsWithEstimate
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new room (Admin)
// @route   POST /api/rooms
// @access  Private/Admin
const createRoom = async (req, res, next) => {
  try {
    const {
      roomNumber,
      roomType,
      description,
      price,
      capacity,
      bedType,
      amenities,
      images,
      status,
      size,
      floor
    } = req.body;

    if (!roomNumber || !roomType || !description || price === undefined || !capacity || !bedType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory fields: roomNumber, roomType, description, price, capacity, bedType'
      });
    }

    const existingRoom = await Room.findOne({ roomNumber: roomNumber.trim() });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: `Room with number ${roomNumber} already exists`
      });
    }

    const room = await Room.create({
      roomNumber: roomNumber.trim(),
      roomType,
      description: description.trim(),
      price: Number(price),
      capacity: Number(capacity),
      bedType,
      amenities: Array.isArray(amenities) ? amenities : ['WiFi', 'AC', 'TV', 'Room Service'],
      images: Array.isArray(images) && images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
      ],
      status: status || 'Available',
      size: size ? Number(size) : 350,
      floor: floor ? Number(floor) : 1
    });

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      room
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room details (Admin)
// @route   PUT /api/rooms/:id
// @access  Private/Admin
const updateRoom = async (req, res, next) => {
  try {
    let room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check room number uniqueness if changed
    if (req.body.roomNumber && req.body.roomNumber !== room.roomNumber) {
      const existing = await Room.findOne({ roomNumber: req.body.roomNumber.trim() });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: `Room number ${req.body.roomNumber} is already in use`
        });
      }
    }

    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Room updated successfully',
      room
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a room (Admin)
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if room has active bookings
    const activeBookings = await Booking.find({
      room: room._id,
      bookingStatus: { $in: ['Confirmed', 'Checked-In', 'Pending'] }
    });

    if (activeBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete room ${room.roomNumber}: it currently has ${activeBookings.length} active booking(s). Please cancel or reassign them first.`
      });
    }

    await Room.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: `Room ${room.roomNumber} deleted successfully`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle room status (Admin)
// @route   PATCH /api/rooms/:id/status
// @access  Private/Admin
const updateRoomStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Available', 'Maintenance', 'Occupied'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be Available, Maintenance, or Occupied'
      });
    }

    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.json({
      success: true,
      message: `Room status updated to ${status}`,
      room
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  getAvailableRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  updateRoomStatus
};
