const express = require('express');
const router = express.Router();
const {
  getAllRooms,
  getRoomById,
  getAvailableRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  updateRoomStatus
} = require('../controllers/roomController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public room routes
router.get('/', getAllRooms);
router.get('/available', getAvailableRooms);
router.get('/:id', getRoomById);

// Admin room management routes
router.post('/', protect, adminOnly, createRoom);
router.put('/:id', protect, adminOnly, updateRoom);
router.delete('/:id', protect, adminOnly, deleteRoom);
router.patch('/:id/status', protect, adminOnly, updateRoomStatus);

module.exports = router;
