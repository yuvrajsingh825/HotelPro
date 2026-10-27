import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, ShieldCheck, Award, CheckCircle2, AlertCircle } from 'lucide-react';

const MyProfile = () => {
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

      setSuccess('Profile updated successfully!');
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5">
      <div className="container">
        {/* Header */}
        <div className="mb-4">
          <span className="section-tag">Account Settings</span>
          <h1 className="display-6 fw-bold font-serif text-dark mb-1">My Guest Profile</h1>
          <p className="text-muted">Manage your personal information, contact numbers, and security credentials</p>
        </div>

        <div className="row g-4">
          {/* Left: Summary Card */}
          <div className="col-12 col-lg-4">
            <div className="card luxury-card p-4 text-center border-0 mb-4">
              <div className="d-flex justify-content-center mb-3">
                <div
                  className="rounded-circle bg-dark text-warning fw-bold fs-2 d-flex align-items-center justify-content-center shadow"
                  style={{ width: '90px', height: '90px', border: '3px solid #c5a880' }}
                >
                  {user?.name?.charAt(0) || 'G'}
                </div>
              </div>
              <h4 className="fw-bold font-serif text-dark mb-1">{user?.name}</h4>
              <p className="text-muted small mb-2">{user?.email}</p>
              <div className="d-flex justify-content-center gap-2 mb-3">
                <span className="badge badge-gold d-flex align-items-center gap-1">
                  <Award size={14} /> VIP Platinum Guest
                </span>
                <span className="badge bg-dark text-white text-capitalize">
                  {user?.role}
                </span>
              </div>
              <div className="border-top pt-3 text-start small text-secondary">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Contact Phone:</span>
                  <span className="fw-bold text-dark">{user?.phone || 'Not set'}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Account Status:</span>
                  <span className="text-success fw-bold">Active & Verified</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Member Since:</span>
                  <span>{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="card p-3 bg-light rounded-4 border">
              <div className="d-flex align-items-center gap-2 mb-2">
                <ShieldCheck size={20} className="text-success" />
                <h6 className="fw-bold text-dark mb-0">HotelPro Privacy Guarantee</h6>
              </div>
              <p className="text-muted small mb-0">
                Your personal details and stay preferences are guarded with strict encryption standards and never shared with third parties.
              </p>
            </div>
          </div>

          {/* Right: Update Form */}
          <div className="col-12 col-lg-8">
            <div className="card luxury-card p-4 p-md-5 border-0">
              <h4 className="fw-bold font-serif text-dark mb-3">Update Personal Details</h4>

              {success && (
                <div className="alert alert-success py-2 px-3 small d-flex align-items-center gap-2 mb-3">
                  <CheckCircle2 size={16} />
                  <span>{success}</span>
                </div>
              )}

              {error && (
                <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3 mb-4">
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold text-muted">Full Legal Name</label>
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

                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold text-muted">Email (Read Only)</label>
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

                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted">Contact Phone Number</label>
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

                <h5 className="fw-bold font-serif text-dark mb-3 pt-3 border-top">Change Password</h5>
                <p className="text-muted small mb-3">
                  Leave password fields blank if you do not wish to change your current password.
                </p>

                <div className="row g-3 mb-4">
                  <div className="col-12 col-sm-4">
                    <label className="form-label small fw-bold text-muted">Current Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <Lock size={16} className="text-muted" />
                      </span>
                      <input
                        type="password"
                        name="currentPassword"
                        className="form-control border-start-0 ps-0 py-2 rounded-end-3"
                        placeholder="••••••••"
                        value={formData.currentPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-sm-4">
                    <label className="form-label small fw-bold text-muted">New Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <Lock size={16} className="text-muted" />
                      </span>
                      <input
                        type="password"
                        name="newPassword"
                        className="form-control border-start-0 ps-0 py-2 rounded-end-3"
                        placeholder="Min 6 chars"
                        value={formData.newPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-sm-4">
                    <label className="form-label small fw-bold text-muted">Confirm New Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <Lock size={16} className="text-muted" />
                      </span>
                      <input
                        type="password"
                        name="confirmPassword"
                        className="form-control border-start-0 ps-0 py-2 rounded-end-3"
                        placeholder="Re-enter new"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-gold px-4 py-2 fw-bold rounded-3 shadow-sm"
                >
                  {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
