const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser
} = require('../controllers/adminController');
const {
  getAllBookings,
  updateBookingStatus
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All admin routes protected
router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/bookings', getAllBookings);
router.patch('/bookings/:id/status', updateBookingStatus);

module.exports = router;
