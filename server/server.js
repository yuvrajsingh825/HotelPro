const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { seedDatabase } = require('./seed/seeder');
const User = require('./models/User');

// Routes
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'HotelPro API',
    timestamp: new Date().toISOString()
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Serve static React production build if available
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(path.join(clientDistPath, 'index.html'))) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to HotelPro – Hotel Booking and Management System REST API',
      version: '1.0.0',
      documentation: {
        auth: '/api/auth',
        rooms: '/api/rooms',
        availableRooms: '/api/rooms/available?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD&guests=2',
        bookings: '/api/bookings',
        myBookings: '/api/bookings/my',
        payments: '/api/payments',
        adminDashboard: '/api/admin/dashboard'
      }
    });
  });
}

// Error Handling Middlewares for unhandled routes
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
const startServer = async () => {
  try {
    await connectDB();

    // Check if database is empty; if so, automatically seed
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Server] Database is empty. Running initial seeder...');
      await seedDatabase();
    }

    const server = app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`  HotelPro Backend Server running on port ${PORT}`);
      console.log(`  Health Check: http://localhost:${PORT}/api/health`);
      console.log(`  API Base:     http://localhost:${PORT}/api`);
      console.log(`====================================================`);
    });

    return server;
  } catch (error) {
    console.error(`[Server] Critical Startup Failure: ${error.message}`);
    process.exit(1);
  }
};

startServer();

module.exports = app;
