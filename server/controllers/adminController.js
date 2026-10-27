const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

// @desc    Get Admin Dashboard KPIs and Chart Analytics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    // Basic counts
    const [
      totalUsers,
      totalRooms,
      availableRooms,
      occupiedRooms,
      maintenanceRooms,
      totalBookings,
      confirmedBookings,
      checkedInBookings,
      checkedOutBookings,
      cancelledBookings,
      pendingBookings
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Room.countDocuments(),
      Room.countDocuments({ status: 'Available' }),
      Room.countDocuments({ status: 'Occupied' }),
      Room.countDocuments({ status: 'Maintenance' }),
      Booking.countDocuments(),
      Booking.countDocuments({ bookingStatus: 'Confirmed' }),
      Booking.countDocuments({ bookingStatus: 'Checked-In' }),
      Booking.countDocuments({ bookingStatus: 'Checked-Out' }),
      Booking.countDocuments({ bookingStatus: 'Cancelled' }),
      Booking.countDocuments({ bookingStatus: 'Pending' })
    ]);

    // Calculate total revenue from paid bookings
    const revenueAgg = await Booking.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Monthly bookings and revenue aggregation (past 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyStats = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          bookingsCount: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [{ $eq: ['$paymentStatus', 'Paid'] }, '$totalAmount', 0]
            }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Format months array for chart display
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyChartData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mYear = d.getFullYear();
      const mMonth = d.getMonth() + 1;
      const monthLabel = `${monthNames[mMonth - 1]} ${mYear}`;

      const matched = monthlyStats.find(
        (item) => item._id.year === mYear && item._id.month === mMonth
      );

      monthlyChartData.push({
        month: monthLabel,
        bookings: matched ? matched.bookingsCount : 0,
        revenue: matched ? matched.revenue : 0
      });
    }

    // Room categories distribution
    const roomTypeDistribution = await Room.aggregate([
      {
        $group: {
          _id: '$roomType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent 6 bookings
    const recentBookings = await Booking.find()
      .populate('room', 'roomNumber roomType price')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalRooms,
        availableRooms,
        occupiedRooms,
        maintenanceRooms,
        totalBookings,
        confirmedBookings,
        checkedInBookings,
        checkedOutBookings,
        cancelledBookings,
        pendingBookings,
        totalRevenue
      },
      charts: {
        monthlyChartData,
        roomTypeDistribution: roomTypeDistribution.map((item) => ({
          type: item._id,
          count: item.count
        })),
        statusDistribution: [
          { status: 'Confirmed', count: confirmedBookings },
          { status: 'Checked-In', count: checkedInBookings },
          { status: 'Checked-Out', count: checkedOutBookings },
          { status: 'Cancelled', count: cancelledBookings },
          { status: 'Pending', count: pendingBookings }
        ]
      },
      recentBookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with booking stats (Admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    // Aggregate booking counts & spending per user
    const userStats = await Booking.aggregate([
      {
        $group: {
          _id: '$user',
          totalBookings: { $sum: 1 },
          totalSpent: {
            $sum: {
              $cond: [{ $eq: ['$paymentStatus', 'Paid'] }, '$totalAmount', 0]
            }
          }
        }
      }
    ]);

    const statsMap = new Map();
    userStats.forEach((s) => {
      statsMap.set(s._id.toString(), s);
    });

    const enrichedUsers = users.map((u) => {
      const uObj = u.toObject();
      const stats = statsMap.get(u._id.toString());
      uObj.totalBookings = stats ? stats.totalBookings : 0;
      uObj.totalSpent = stats ? stats.totalSpent : 0;
      return uObj;
    });

    res.json({
      success: true,
      count: enrichedUsers.length,
      users: enrichedUsers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (Admin)
// @route   PATCH /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be user or admin'
      });
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own admin account'
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser
};
