import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BedDouble,
  PlusCircle,
  CalendarCheck,
  Users,
  ShieldCheck,
  Globe,
  LogOut,
  Building2
} from 'lucide-react';

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="admin-sidebar p-3 shadow-sm">
      {/* Brand & Mode */}
      <div className="pb-3 mb-3 border-bottom border-secondary border-opacity-25">
        <Link to="/admin/dashboard" className="text-white text-decoration-none d-flex align-items-center gap-2">
          <div className="bg-warning text-dark p-2 rounded-3 d-flex align-items-center justify-content-center">
            <Building2 size={20} />
          </div>
          <div>
            <div className="fw-bold fs-5 text-white">HotelPro</div>
            <div className="text-warning small" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
              ADMINISTRATION
            </div>
          </div>
        </Link>
      </div>

      {/* Admin User Info Card */}
      <div className="bg-secondary bg-opacity-25 rounded-3 p-3 mb-4 d-flex align-items-center gap-3">
        <div className="rounded-circle bg-warning text-dark fw-bold d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
          {user?.name?.charAt(0) || 'A'}
        </div>
        <div className="overflow-hidden">
          <div className="text-white fw-bold text-truncate small">{user?.name}</div>
          <div className="text-muted text-truncate" style={{ fontSize: '0.75rem' }}>{user?.email}</div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="nav flex-column mb-auto">
        <span className="text-uppercase text-secondary px-3 mb-2 small fw-bold" style={{ fontSize: '0.68rem', letterSpacing: '0.1em' }}>
          Management
        </span>

        <NavLink to="/admin/dashboard" end className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/rooms" end className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
          <BedDouble size={18} />
          <span>Manage Rooms</span>
        </NavLink>

        <NavLink to="/admin/rooms/add" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
          <PlusCircle size={18} />
          <span>Add New Room</span>
        </NavLink>

        <NavLink to="/admin/bookings" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
          <CalendarCheck size={18} />
          <span>Manage Bookings</span>
        </NavLink>

        <NavLink to="/admin/users" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
          <Users size={18} />
          <span>Manage Users</span>
        </NavLink>

        <NavLink to="/admin/profile" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
          <ShieldCheck size={18} />
          <span>Admin Profile</span>
        </NavLink>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-top border-secondary border-opacity-25 d-flex flex-column gap-2">
        <Link to="/" className="btn btn-outline-light btn-sm text-start d-flex align-items-center gap-2 py-2">
          <Globe size={16} /> Public Website
        </Link>
        <button onClick={handleLogout} className="btn btn-danger btn-sm text-start d-flex align-items-center gap-2 py-2">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
