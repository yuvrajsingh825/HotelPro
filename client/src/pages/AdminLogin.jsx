import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, Building2, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFillDemoAdmin = () => {
    setFormData({
      email: 'admin@hotelpro.com',
      password: 'AdminPassword@123'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(formData.email, formData.password);
      if (user.role !== 'admin') {
        setError('Access denied: You do not have administrator permissions.');
        return;
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5" style={{ minHeight: '85vh', backgroundColor: '#0f172a' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="card luxury-card p-4 p-md-5 border-0 shadow-lg bg-white">
              {/* Header */}
              <div className="text-center mb-4">
                <div
                  className="bg-dark text-warning p-3 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow"
                  style={{ width: '60px', height: '60px' }}
                >
                  <ShieldCheck size={32} />
                </div>
                <h3 className="fw-bold font-serif text-dark mb-1">HotelPro Staff Portal</h3>
                <p className="text-muted small">Restricted administrative access for hotel management</p>
              </div>

              {/* Demo Helper */}
              <div className="bg-light border rounded-3 p-3 mb-4">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="small fw-bold text-dark">Local Evaluator Access</span>
                  <span className="badge bg-warning text-dark small">Admin</span>
                </div>
                <button
                  type="button"
                  onClick={handleFillDemoAdmin}
                  className="btn btn-sm btn-outline-warning text-dark w-100 d-flex align-items-center justify-content-center gap-2 fw-semibold"
                >
                  <Sparkles size={14} className="text-warning" /> Auto-Fill Admin Credentials
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Admin Email</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <Mail size={16} className="text-muted" />
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="form-control border-start-0 ps-0 py-2 rounded-end-3"
                      placeholder="admin@hotelpro.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">Master Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <Lock size={16} className="text-muted" />
                    </span>
                    <input
                      type="password"
                      name="password"
                      className="form-control border-start-0 ps-0 py-2 rounded-end-3"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-navy w-100 py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
                >
                  {loading ? 'Verifying Authorization...' : (
                    <>
                      <span>Sign In as Admin</span> <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-4 pt-3 border-top">
                <Link to="/login" className="small text-muted text-decoration-none">
                  Looking for the Guest Login page? Click here &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
