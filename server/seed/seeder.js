const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const { users, rooms } = require('./seedData');

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('[Seeder] Clearing old records...');
    await Promise.all([
      User.deleteMany(),
      Room.deleteMany(),
      Booking.deleteMany(),
      Payment.deleteMany()
    ]);

    console.log('[Seeder] Inserting users...');
    // Use User.create so pre-save password hash hooks execute!
    const createdUsers = await User.create(users);
    console.log(`[Seeder] Created ${createdUsers.length} users (1 Admin, ${createdUsers.length - 1} Guests).`);

    console.log('[Seeder] Inserting rooms...');
    const createdRooms = await Room.create(rooms);
    console.log(`[Seeder] Created ${createdRooms.length} luxury rooms across 5 categories.`);

    // Find admin and regular guests
    const adminUser = createdUsers.find((u) => u.role === 'admin');
    const guestUsers = createdUsers.filter((u) => u.role === 'user');

    console.log('[Seeder] Creating realistic sample bookings and payments...');
    const now = new Date();

    // Booking 1: Sarah Jenkins - Confirmed upcoming stay in Deluxe Room 201
    const checkIn1 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3);
    const checkOut1 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
    const nights1 = 4;
    const room1 = createdRooms.find((r) => r.roomNumber === '201');
    const total1 = nights1 * room1.price;

    const booking1 = await Booking.create({
      bookingId: 'HP-2026-891234',
      user: guestUsers[0]._id,
      room: room1._id,
      guestName: guestUsers[0].name,
      guestEmail: guestUsers[0].email,
      guestPhone: guestUsers[0].phone,
      checkIn: checkIn1,
      checkOut: checkOut1,
      guests: 2,
      nights: nights1,
      pricePerNight: room1.price,
      totalAmount: total1,
      bookingStatus: 'Confirmed',
      paymentStatus: 'Paid',
      specialRequests: 'High floor preferred, arriving late around 8 PM.'
    });

    await Payment.create({
      paymentId: 'PAY-HP-100201',
      booking: booking1._id,
      user: guestUsers[0]._id,
      amount: total1,
      paymentMethod: 'Credit Card (Visa)',
      paymentStatus: 'Paid',
      transactionId: 'TXN-HP948271',
      cardLastFour: '4242'
    });

    // Booking 2: David Miller - Currently Checked-In in Deluxe Room 203
    const checkIn2 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const checkOut2 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);
    const nights2 = 3;
    const room2 = createdRooms.find((r) => r.roomNumber === '203');
    const total2 = nights2 * room2.price;

    const booking2 = await Booking.create({
      bookingId: 'HP-2026-773412',
      user: guestUsers[1]._id,
      room: room2._id,
      guestName: guestUsers[1].name,
      guestEmail: guestUsers[1].email,
      guestPhone: guestUsers[1].phone,
      checkIn: checkIn2,
      checkOut: checkOut2,
      guests: 2,
      nights: nights2,
      pricePerNight: room2.price,
      totalAmount: total2,
      bookingStatus: 'Checked-In',
      paymentStatus: 'Paid',
      specialRequests: 'Honeymoon couple, complimentary champagne requested.'
    });

    await Payment.create({
      paymentId: 'PAY-HP-100202',
      booking: booking2._id,
      user: guestUsers[1]._id,
      amount: total2,
      paymentMethod: 'Mastercard (Demo)',
      paymentStatus: 'Paid',
      transactionId: 'TXN-HP338291',
      cardLastFour: '8821'
    });

    // Booking 3: Emily Clark - Checked-Out past stay in Executive Room 301
    const checkIn3 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10);
    const checkOut3 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    const nights3 = 3;
    const room3 = createdRooms.find((r) => r.roomNumber === '301');
    const total3 = nights3 * room3.price;

    const booking3 = await Booking.create({
      bookingId: 'HP-2026-554190',
      user: guestUsers[2]._id,
      room: room3._id,
      guestName: guestUsers[2].name,
      guestEmail: guestUsers[2].email,
      guestPhone: guestUsers[2].phone,
      checkIn: checkIn3,
      checkOut: checkOut3,
      guests: 1,
      nights: nights3,
      pricePerNight: room3.price,
      totalAmount: total3,
      bookingStatus: 'Checked-Out',
      paymentStatus: 'Paid',
      specialRequests: 'Quiet room for remote video conferences.'
    });

    await Payment.create({
      paymentId: 'PAY-HP-100203',
      booking: booking3._id,
      user: guestUsers[2]._id,
      amount: total3,
      paymentMethod: 'American Express (Demo)',
      paymentStatus: 'Paid',
      transactionId: 'TXN-HP662914',
      cardLastFour: '1004'
    });

    // Booking 4: Michael Ross - Cancelled stay in Suite 401
    const checkIn4 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14);
    const checkOut4 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 18);
    const nights4 = 4;
    const room4 = createdRooms.find((r) => r.roomNumber === '401');
    const total4 = nights4 * room4.price;

    const booking4 = await Booking.create({
      bookingId: 'HP-2026-382910',
      user: guestUsers[3]._id,
      room: room4._id,
      guestName: guestUsers[3].name,
      guestEmail: guestUsers[3].email,
      guestPhone: guestUsers[3].phone,
      checkIn: checkIn4,
      checkOut: checkOut4,
      guests: 3,
      nights: nights4,
      pricePerNight: room4.price,
      totalAmount: total4,
      bookingStatus: 'Cancelled',
      paymentStatus: 'Refunded',
      specialRequests: 'Flight cancellation caused trip postponement.'
    });

    await Payment.create({
      paymentId: 'PAY-HP-100204',
      booking: booking4._id,
      user: guestUsers[3]._id,
      amount: total4,
      paymentMethod: 'Visa (Demo)',
      paymentStatus: 'Refunded',
      transactionId: 'TXN-HP119283',
      cardLastFour: '4242'
    });

    // Booking 5: Sophia Martinez - Upcoming Family Suite stay
    const checkIn5 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5);
    const checkOut5 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 9);
    const nights5 = 4;
    const room5 = createdRooms.find((r) => r.roomNumber === '501');
    const total5 = nights5 * room5.price;

    const booking5 = await Booking.create({
      bookingId: 'HP-2026-645892',
      user: guestUsers[4]._id,
      room: room5._id,
      guestName: guestUsers[4].name,
      guestEmail: guestUsers[4].email,
      guestPhone: guestUsers[4].phone,
      checkIn: checkIn5,
      checkOut: checkOut5,
      guests: 4,
      nights: nights5,
      pricePerNight: room5.price,
      totalAmount: total5,
      bookingStatus: 'Confirmed',
      paymentStatus: 'Paid',
      specialRequests: 'Traveling with 2 kids, extra towels and pool passes.'
    });

    await Payment.create({
      paymentId: 'PAY-HP-100205',
      booking: booking5._id,
      user: guestUsers[4]._id,
      amount: total5,
      paymentMethod: 'Credit Card (Visa)',
      paymentStatus: 'Paid',
      transactionId: 'TXN-HP552019',
      cardLastFour: '4242'
    });

    // Booking 6: James Wilson - Pending stay in Standard Room 102
    const checkIn6 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8);
    const checkOut6 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10);
    const nights6 = 2;
    const room6 = createdRooms.find((r) => r.roomNumber === '102');
    const total6 = nights6 * room6.price;

    await Booking.create({
      bookingId: 'HP-2026-192837',
      user: guestUsers[5]._id,
      room: room6._id,
      guestName: guestUsers[5].name,
      guestEmail: guestUsers[5].email,
      guestPhone: guestUsers[5].phone,
      checkIn: checkIn6,
      checkOut: checkOut6,
      guests: 2,
      nights: nights6,
      pricePerNight: room6.price,
      totalAmount: total6,
      bookingStatus: 'Pending',
      paymentStatus: 'Pending',
      specialRequests: 'Early check-in around 11 AM if room is ready.'
    });

    console.log('[Seeder] Database successfully seeded with full production test data!');
    return true;
  } catch (error) {
    console.error('[Seeder] Error seeding database:', error);
    throw error;
  }
};

// If run directly via CLI
if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      await disconnectDB();
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  })();
}

module.exports = { seedDatabase };
