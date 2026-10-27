import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle2,
  AlertCircle,
  Server,
  Database,
  Cpu
} from 'lucide-react';

const AdminProfile = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      if (formData.newPassword.length < 6) {
        setError('New password must be at least 6 characters');
        return;
      }
      if (!formData.currentPassword) {
        setError('Please enter your current password to set a new password');
        return;
      }
    }

    setLoading(true);
    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        currentPassword: formData.currentPassword || undefined,
        newPassword: formData.newPassword || undefined
      });

      setSuccess('Administrator profile updated successfully!');
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      setError(err.message || 'Failed to update admin profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <AdminSidebar />

      <div className="flex-grow-1 p-4 p-md-5 overflow-auto" style={{ maxHeight: '100vh' }}>
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
          <div>
            <span className="section-tag">Security & Identity</span>
            <h1 className="display-6 fw-bold font-serif text-dark mb-1">Administrator Profile</h1>
            <p className="text-muted mb-0">System credentials and environment configuration</p>
          </div>
        </div>

        {success && (
          <div className="alert alert-success py-2 px-3 small d-flex align-items-center gap-2 mb-4">
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-4">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="row g-4">
          {/* Left: Form */}
          <div className="col-12 col-lg-7">
            <div className="card luxury-card p-4 p-md-5 border-0">
              <h5 className="fw-bold font-serif text-dark mb-3">Administrator Details</h5>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Legal Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <User size={16} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      name="name"
                      className="form-control border-start-0 ps-0 py-2 rounded-end-3"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-sm-6">
                    <label className="form-label small fw-bold text-muted">Email (Read-Only)</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Mail size={16} className="text-muted" />
                      </span>
                      <input
                        type="email"
                        className="form-control bg-light border-start-0 ps-0 py-2 rounded-end-3"
                        value={user?.email || ''}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label small fw-bold text-muted">Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <Phone size={16} className="text-muted" />
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control border-start-0 ps-0 py-2 rounded-end-3"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <h5 className="fw-bold font-serif text-dark mb-3 pt-3 border-top">Update Admin Password</h5>

                <div className="row g-3 mb-4">
                  <div className="col-12 col-sm-4">
                    <label className="form-label small fw-bold text-muted">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      className="form-control py-2 rounded-3"
                      placeholder="••••••••"
                      value={formData.currentPassword}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12 col-sm-4">
                    <label className="form-label small fw-bold text-muted">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      className="form-control py-2 rounded-3"
                      placeholder="Min 6 chars"
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12 col-sm-4">
                    <label className="form-label small fw-bold text-muted">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control py-2 rounded-3"
                      placeholder="Re-enter new"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-navy px-4 py-2 fw-bold rounded-3 shadow-sm"
                >
                  {loading ? 'Saving Changes...' : 'Update Admin Credentials'}
                </button>
              </form>
            </div>
          </div>

          {/* Right: System Information */}
          <div className="col-12 col-lg-5">
            <div className="card luxury-card p-4 border-0 mb-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <ShieldCheck size={22} className="text-warning" />
                <h5 className="fw-bold font-serif text-dark mb-0">Role & Security Privileges</h5>
              </div>
              <p className="text-muted small mb-3">
                This account holds Root Administrator status with full authority to modify room rates, cancel or reassign guest reservations, manage team access, and audit financial payments.
              </p>
              <div className="bg-light p-3 rounded-3 small text-secondary">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Role:</span>
                  <span className="badge bg-dark text-warning">System Administrator</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Auth Scheme:</span>
                  <span>JWT (Bearer) • 7-day TTL</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Encryption:</span>
                  <span>bcrypt (10 rounds)</span>
                </div>
              </div>
            </div>

            <div className="card luxury-card p-4 border-0">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Server size={22} className="text-primary" />
                <h5 className="fw-bold font-serif text-dark mb-0">Runtime Environment</h5>
              </div>
              <ul className="list-unstyled small text-secondary mb-0 d-flex flex-column gap-2">
                <li className="d-flex justify-content-between">
                  <span className="text-muted">Application:</span>
                  <span className="fw-bold text-dark">HotelPro v1.0.0</span>
                </li>
                <li className="d-flex justify-content-between">
                  <span className="text-muted">Database Engine:</span>
                  <span>MongoDB / Mongoose ODM</span>
                </li>
                <li className="d-flex justify-content-between">
                  <span className="text-muted">Backend Runtime:</span>
                  <span>Node.js / Express.js REST</span>
                </li>
                <li className="d-flex justify-content-between">
                  <span className="text-muted">Frontend Architecture:</span>
                  <span>React.js + Vite + Bootstrap 5</span>
                </li>
                <li className="d-flex justify-content-between">
                  <span className="text-muted">Availability Logic:</span>
                  <span className="text-success fw-bold">Date Overlap Algorithmic</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
