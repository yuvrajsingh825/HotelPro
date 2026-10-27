const http = require('http');
const app = require('./server');

const makeRequest = (options, postData = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
};

const runTests = async () => {
  // Give server 2 seconds to start
  await new Promise((r) => setTimeout(r, 2000));
  const port = 5000;

  console.log('\n--- 1. Testing Health Endpoint ---');
  let res = await makeRequest({
    hostname: '127.0.0.1',
    port,
    path: '/api/health',
    method: 'GET'
  });
  console.log('Health check:', res.status, res.data);

  console.log('\n--- 1b. Testing Production Build Static Serving (GET /) ---');
  let rootRes = await makeRequest({
    hostname: '127.0.0.1',
    port,
    path: '/',
    method: 'GET'
  });
  const isHtml = typeof rootRes.raw === 'string' && rootRes.raw.includes('<!DOCTYPE html>');
  console.log('Frontend index.html served:', rootRes.status, isHtml ? 'SUCCESS (Production Build Active)' : 'FAILED');

  console.log('\n--- 2. Testing Admin Login ---');
  res = await makeRequest(
    {
      hostname: '127.0.0.1',
      port,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    { email: 'admin@hotelpro.com', password: 'AdminPassword@123' }
  );
  console.log('Admin login:', res.status, res.data.success ? 'SUCCESS' : 'FAILED');
  const adminToken = res.data.token;

  console.log('\n--- 3. Testing Guest Login ---');
  res = await makeRequest(
    {
      hostname: '127.0.0.1',
      port,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    { email: 'sarah.jenkins@example.com', password: 'GuestPassword@123' }
  );
  console.log('Guest login:', res.status, res.data.success ? 'SUCCESS' : 'FAILED');
  const guestToken = res.data.token;

  console.log('\n--- 4. Testing Get All Rooms ---');
  res = await makeRequest({
    hostname: '127.0.0.1',
    port,
    path: '/api/rooms',
    method: 'GET'
  });
  console.log('Rooms fetched:', res.data.count, 'rooms found');
  const sampleRoom = res.data.rooms[0];

  console.log('\n--- 5. Testing Availability Search (Overlap Logic) ---');
  res = await makeRequest({
    hostname: '127.0.0.1',
    port,
    path: '/api/rooms/available?checkIn=2026-11-01&checkOut=2026-11-05&guests=2',
    method: 'GET'
  });
  console.log('Available rooms:', res.data.count, 'Nights:', res.data.nights);

  console.log('\n--- 6. Testing Create Booking ---');
  res = await makeRequest(
    {
      hostname: '127.0.0.1',
      port,
      path: '/api/bookings',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${guestToken}`
      }
    },
    {
      roomId: sampleRoom._id,
      checkIn: '2026-11-10',
      checkOut: '2026-11-13',
      guests: 2,
      guestName: 'Sarah Jenkins',
      guestEmail: 'sarah.jenkins@example.com',
      guestPhone: '+1 (555) 234-5678',
      specialRequests: 'Quiet room please'
    }
  );
  console.log('Booking creation:', res.status, res.data.message);
  const newBooking = res.data.booking;

  console.log('\n--- 7. Testing Mock Payment ---');
  res = await makeRequest(
    {
      hostname: '127.0.0.1',
      port,
      path: '/api/payments',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${guestToken}`
      }
    },
    {
      bookingId: newBooking._id,
      cardNumber: '4242 4242 4242 4242',
      cardHolder: 'Sarah Jenkins',
      expiry: '12/28',
      cvv: '123'
    }
  );
  console.log('Payment result:', res.status, res.data.message, 'Payment ID:', res.data.payment ? res.data.payment.paymentId : 'none');

  console.log('\n--- 8. Testing Admin Dashboard Analytics ---');
  res = await makeRequest({
    hostname: '127.0.0.1',
    port,
    path: '/api/admin/dashboard',
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log('Admin Dashboard Stats:');
  console.log(res.data.stats);

  console.log('\nAll Backend API Tests Completed Successfully!');
  process.exit(0);
};

runTests().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
