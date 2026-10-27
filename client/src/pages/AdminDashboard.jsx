import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import {
  Users,
  BedDouble,
  CalendarCheck,
  CalendarX,
  CreditCard,
  TrendingUp,
  PlusCircle,
  Eye,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        if (res.data?.success) {
          setDashboardData(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex">
        <AdminSidebar />
        <div className="flex-grow-1 p-5">
          <LoadingSpinner text="Computing real-time analytics & KPIs..." />
        </div>
      </div>
    );
  }

  const { stats, charts, recentBookings } = dashboardData || {};

  // Monthly Revenue & Bookings Bar Chart config
  const monthlyLabels = charts?.monthlyChartData?.map((item) => item.month) || [];
  const monthlyRevenues = charts?.monthlyChartData?.map((item) => item.revenue) || [];
  const monthlyBookingsCount = charts?.monthlyChartData?.map((item) => item.bookings) || [];

  const revenueChartData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: 'Revenue ($)',
        data: monthlyRevenues,
        backgroundColor: 'rgba(197, 168, 128, 0.85)',
        borderColor: '#c5a880',
        borderWidth: 1,
        borderRadius: 6,
        yAxisID: 'y'
      },
      {
        label: 'Bookings Count',
        data: monthlyBookingsCount,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        borderColor: '#0f172a',
        borderWidth: 1,
        borderRadius: 6,
        yAxisID: 'y1'
      }
    ]
  };

  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Revenue ($)' },
        grid: { color: '#f1f5f9' }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: { display: true, text: 'Bookings' },
        grid: { drawOnChartArea: false }
      }
    }
  };

  // Status Distribution Doughnut Chart config
  const statusLabels = charts?.statusDistribution?.map((s) => s.status) || [];
  const statusCounts = charts?.statusDistribution?.map((s) => s.count) || [];

  const doughnutData = {
    labels: statusLabels,
    datasets: [
      {
        data: statusCounts,
        backgroundColor: [
          '#10b981', // Confirmed (Emerald)
          '#3b82f6', // Checked-In (Blue)
          '#64748b', // Checked-Out (Slate)
          '#ef4444', // Cancelled (Red)
          '#f59e0b'  // Pending (Amber)
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Admin Content */}
      <div className="flex-grow-1 p-4 p-md-5 overflow-auto" style={{ maxHeight: '100vh' }}>
        {/* Top Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 pb-3 border-bottom">
          <div>
            <span className="section-tag">Executive Management</span>
            <h1 className="display-6 fw-bold font-serif text-dark mb-1">
              Operations & Analytics Dashboard
            </h1>
            <p className="text-muted mb-0">Live MongoDB system statistics, occupancy, and revenue streams</p>
          </div>
          <div className="d-flex gap-2 mt-3 mt-md-0">
            <Link to="/admin/rooms/add" className="btn btn-gold rounded-3 d-flex align-items-center gap-1 shadow-sm">
              <PlusCircle size={16} /> Add Room
            </Link>
            <Link to="/admin/bookings" className="btn btn-outline-dark rounded-3 d-flex align-items-center gap-1">
              <CalendarCheck size={16} /> Manage Bookings
            </Link>
          </div>
        </div>

        {/* 8 Primary KPI Cards */}
        <div className="row g-3 mb-5">
          {/* Total Revenue */}
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="stat-card">
              <div>
                <span className="text-muted small fw-bold text-uppercase">Total Revenue</span>
                <h3 className="fw-bold text-dark font-serif mt-1 mb-0">${stats?.totalRevenue?.toLocaleString()}</h3>
                <span className="text-success small fw-semibold d-flex align-items-center gap-1 mt-1">
                  <TrendingUp size={14} /> Paid Bookings
                </span>
              </div>
              <div className="stat-icon" style={{ backgroundColor: '#fbf7f2', color: '#c5a880' }}>
                <CreditCard size={26} />
              </div>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="stat-card">
              <div>
                <span className="text-muted small fw-bold text-uppercase">Total Bookings</span>
                <h3 className="fw-bold text-dark font-serif mt-1 mb-0">{stats?.totalBookings}</h3>
                <span className="text-muted small">All Time Volume</span>
              </div>
              <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <CalendarCheck size={26} />
              </div>
            </div>
          </div>

          {/* Available Rooms */}
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="stat-card">
              <div>
                <span className="text-muted small fw-bold text-uppercase">Available Rooms</span>
                <h3 className="fw-bold text-success font-serif mt-1 mb-0">{stats?.availableRooms}</h3>
                <span className="text-muted small">Out of {stats?.totalRooms} Suites</span>
              </div>
              <div className="stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
                <BedDouble size={26} />
              </div>
            </div>
          </div>

          {/* Occupied Rooms */}
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="stat-card">
              <div>
                <span className="text-muted small fw-bold text-uppercase">Occupied / Maint.</span>
                <h3 className="fw-bold text-danger font-serif mt-1 mb-0">
                  {stats?.occupiedRooms} / {stats?.maintenanceRooms}
                </h3>
                <span className="text-muted small">Active occupancy</span>
              </div>
              <div className="stat-icon" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
                <BedDouble size={26} />
              </div>
            </div>
          </div>

          {/* Total Users */}
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="stat-card">
              <div>
                <span className="text-muted small fw-bold text-uppercase">Registered Guests</span>
                <h3 className="fw-bold text-dark font-serif mt-1 mb-0">{stats?.totalUsers}</h3>
                <span className="text-muted small">Member accounts</span>
              </div>
              <div className="stat-icon" style={{ backgroundColor: '#f8fafc', color: '#475569' }}>
                <Users size={26} />
              </div>
            </div>
          </div>

          {/* Confirmed Bookings */}
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="stat-card">
              <div>
                <span className="text-muted small fw-bold text-uppercase">Confirmed Stays</span>
                <h3 className="fw-bold text-dark font-serif mt-1 mb-0">{stats?.confirmedBookings}</h3>
                <span className="text-success small fw-semibold">Upcoming Arrivals</span>
              </div>
              <div className="stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
                <CheckCircle2 size={26} />
              </div>
            </div>
          </div>

          {/* Cancelled Bookings */}
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="stat-card">
              <div>
                <span className="text-muted small fw-bold text-uppercase">Cancelled Stays</span>
                <h3 className="fw-bold text-dark font-serif mt-1 mb-0">{stats?.cancelledBookings}</h3>
                <span className="text-danger small fw-semibold">Refunded / Voided</span>
              </div>
              <div className="stat-icon" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
                <CalendarX size={26} />
              </div>
            </div>
          </div>

          {/* Occupancy Rate */}
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="stat-card">
              <div>
                <span className="text-muted small fw-bold text-uppercase">Occupancy Rate</span>
                <h3 className="fw-bold text-primary font-serif mt-1 mb-0">
                  {stats?.totalRooms ? Math.round(((stats.totalRooms - stats.availableRooms) / stats.totalRooms) * 100) : 0}%
                </h3>
                <span className="text-muted small">Current utilization</span>
              </div>
              <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <TrendingUp size={26} />
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Charts Row */}
        <div className="row g-4 mb-5">
          {/* Monthly Revenue & Bookings Bar Chart */}
          <div className="col-12 col-xl-8">
            <div className="card luxury-card p-4 border-0 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="fw-bold font-serif text-dark mb-1">Revenue & Bookings Trend</h5>
                  <p className="text-muted small mb-0">Monthly aggregate from confirmed paid stays</p>
                </div>
              </div>
              <div style={{ height: '320px' }}>
                <Bar data={revenueChartData} options={revenueChartOptions} />
              </div>
            </div>
          </div>

          {/* Status Distribution Doughnut */}
          <div className="col-12 col-xl-4">
            <div className="card luxury-card p-4 border-0 h-100">
              <div className="mb-3">
                <h5 className="fw-bold font-serif text-dark mb-1">Booking Status Breakdown</h5>
                <p className="text-muted small mb-0">Distribution of all reservation states</p>
              </div>
              <div style={{ height: '320px' }}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="card luxury-card p-4 border-0">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="fw-bold font-serif text-dark mb-1">Recent Activity & Reservations</h5>
              <p className="text-muted small mb-0">Latest real-time guest booking submissions</p>
            </div>
            <Link to="/admin/bookings" className="btn btn-outline-dark btn-sm rounded-pill px-3">
              View All Bookings
            </Link>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr className="small text-muted text-uppercase">
                  <th>Ref ID</th>
                  <th>Guest</th>
                  <th>Room</th>
                  <th>Stay Dates</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th className="text-end">Manage</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings?.map((booking) => (
                  <tr key={booking._id}>
                    <td className="fw-bold font-monospace small text-dark">
                      {booking.bookingId}
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{booking.guestName}</div>
                      <div className="text-muted small">{booking.guestEmail}</div>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{booking.room?.roomType}</div>
                      <div className="text-muted small">Room #{booking.room?.roomNumber}</div>
                    </td>
                    <td className="small text-secondary">
                      {new Date(booking.checkIn).toLocaleDateString()} &rarr; {new Date(booking.checkOut).toLocaleDateString()}
                    </td>
                    <td className="fw-bold text-dark">${booking.totalAmount}</td>
                    <td>
                      <span className={`badge ${booking.paymentStatus === 'Paid' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${booking.bookingStatus === 'Confirmed' ? 'badge-available' : booking.bookingStatus === 'Cancelled' ? 'badge-occupied' : 'badge-maintenance'}`}>
                        {booking.bookingStatus}
                      </span>
                    </td>
                    <td className="text-end">
                      <Link
                        to={`/bookings/${booking._id}`}
                        className="btn btn-sm btn-outline-secondary rounded-3 px-3"
                      >
                        <Eye size={14} className="me-1" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
