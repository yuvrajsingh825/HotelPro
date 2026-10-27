import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import {
  BedDouble,
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: 'Deluxe Room',
    description: '',
    price: 199,
    capacity: 2,
    bedType: 'King',
    amenities: [],
    images: '',
    status: 'Available',
    size: 400,
    floor: 2
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const availableAmenities = [
    'WiFi',
    'AC',
    'TV',
    'Room Service',
    'Breakfast',
    'Parking',
    'Swimming Pool',
    'Safe',
    'Mini Bar',
    'Ocean View',
    'Gym Access',
    'Hairdryer'
  ];

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${id}`);
        if (res.data?.success) {
          const r = res.data.room;
          setFormData({
            roomNumber: r.roomNumber,
            roomType: r.roomType,
            description: r.description,
            price: r.price,
            capacity: r.capacity,
            bedType: r.bedType,
            amenities: r.amenities || [],
            images: r.images?.join('\n') || '',
            status: r.status,
            size: r.size || 350,
            floor: r.floor || 1
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to load room details');
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const imagesArray = formData.images
        .split('\n')
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      const res = await api.put(`/rooms/${id}`, {
        ...formData,
        price: Number(formData.price),
        capacity: Number(formData.capacity),
        size: Number(formData.size),
        floor: Number(formData.floor),
        images: imagesArray.length > 0 ? imagesArray : undefined
      });

      if (res.data?.success) {
        setSuccess('Room updated successfully!');
        setTimeout(() => navigate('/admin/rooms'), 1200);
      }
    } catch (err) {
      setError(err.message || 'Failed to update room');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex min-vh-100 bg-light">
        <AdminSidebar />
        <div className="flex-grow-1 p-5">
          <LoadingSpinner text="Fetching room specifications..." />
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex min-vh-100 bg-light">
      <AdminSidebar />

      <div className="flex-grow-1 p-4 p-md-5 overflow-auto" style={{ maxHeight: '100vh' }}>
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
          <div>
            <span className="section-tag">Inventory Modification</span>
            <h1 className="display-6 fw-bold font-serif text-dark mb-1">
              Edit Room #{formData.roomNumber}
            </h1>
            <p className="text-muted mb-0">Update pricing, description, imagery, or room status</p>
          </div>
          <Link to="/admin/rooms" className="btn btn-outline-secondary rounded-3 d-flex align-items-center gap-1 mt-3 mt-md-0">
            <ArrowLeft size={16} /> Cancel & Back
          </Link>
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
          <div className="col-12 col-lg-8">
            <div className="card luxury-card p-4 p-md-5 border-0">
              <form onSubmit={handleSubmit}>
                <h5 className="fw-bold font-serif text-dark mb-3">General Information</h5>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold text-muted">Room Number *</label>
                    <input
                      type="text"
                      name="roomNumber"
                      className="form-control rounded-3 py-2"
                      value={formData.roomNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-bold text-muted">Room Category *</label>
                    <select
                      name="roomType"
                      className="form-select rounded-3 py-2"
                      value={formData.roomType}
                      onChange={handleChange}
                      required
                    >
                      <option value="Standard Room">Standard Room</option>
                      <option value="Deluxe Room">Deluxe Room</option>
                      <option value="Executive Room">Executive Room</option>
                      <option value="Suite">Royal Suite</option>
                      <option value="Family Room">Family Room</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Description *</label>
                  <textarea
                    name="description"
                    rows="3"
                    className="form-control rounded-3 py-2"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-6 col-sm-3">
                    <label className="form-label small fw-bold text-muted">Price / Night ($) *</label>
                    <input
                      type="number"
                      name="price"
                      min="1"
                      className="form-control rounded-3 py-2"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-6 col-sm-3">
                    <label className="form-label small fw-bold text-muted">Max Guests *</label>
                    <input
                      type="number"
                      name="capacity"
                      min="1"
                      max="10"
                      className="form-control rounded-3 py-2"
                      value={formData.capacity}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-6 col-sm-3">
                    <label className="form-label small fw-bold text-muted">Bed Type *</label>
                    <select
                      name="bedType"
                      className="form-select rounded-3 py-2"
                      value={formData.bedType}
                      onChange={handleChange}
                    >
                      <option value="Single">Single</option>
                      <option value="Double">Double</option>
                      <option value="Queen">Queen</option>
                      <option value="King">King</option>
                      <option value="Twin">Twin</option>
                    </select>
                  </div>

                  <div className="col-6 col-sm-3">
                    <label className="form-label small fw-bold text-muted">Room Status</label>
                    <select
                      name="status"
                      className="form-select rounded-3 py-2"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="Available">Available</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Occupied">Occupied</option>
                    </select>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted">Floor Level</label>
                    <input
                      type="number"
                      name="floor"
                      min="1"
                      max="50"
                      className="form-control rounded-3 py-2"
                      value={formData.floor}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted">Room Area (sq ft)</label>
                    <input
                      type="number"
                      name="size"
                      min="100"
                      className="form-control rounded-3 py-2"
                      value={formData.size}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Amenities */}
                <h5 className="fw-bold font-serif text-dark mb-3 pt-3 border-top">Amenities</h5>
                <div className="row g-2 mb-4">
                  {availableAmenities.map((amenity) => {
                    const checked = formData.amenities.includes(amenity);
                    return (
                      <div key={amenity} className="col-6 col-sm-4">
                        <div
                          onClick={() => handleAmenityToggle(amenity)}
                          className={`p-2 rounded-3 border d-flex align-items-center gap-2 cursor-pointer ${checked ? 'bg-warning-subtle border-warning fw-semibold' : 'bg-light'}`}
                          style={{ cursor: 'pointer' }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {}}
                            className="form-check-input mt-0"
                          />
                          <span className="small">{amenity}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Images */}
                <h5 className="fw-bold font-serif text-dark mb-3 pt-3 border-top">Images</h5>
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">Image URLs (1 per line)</label>
                  <textarea
                    name="images"
                    rows="3"
                    className="form-control rounded-3 py-2 font-monospace small"
                    value={formData.images}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-gold px-5 py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center gap-2 fs-6"
                >
                  <Save size={18} />
                  {saving ? 'Updating Room...' : 'Save Room Changes'}
                </button>
              </form>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="col-12 col-lg-4">
            <div className="sticky-top" style={{ top: '100px' }}>
              <div className="small fw-bold text-muted text-uppercase mb-2">Live Preview</div>
              <div className="card luxury-card border-0">
                <div className="position-relative" style={{ height: '200px' }}>
                  <img
                    src={formData.images.split('\n')[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'}
                    alt="Preview"
                    className="w-100 h-100 rounded-top"
                    style={{ objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <span className="badge badge-gold position-absolute top-0 start-0 m-2">
                    Room #{formData.roomNumber || '---'}
                  </span>
                </div>
                <div className="card-body p-3">
                  <h5 className="fw-bold font-serif text-dark mb-1">{formData.roomType}</h5>
                  <p className="text-muted small line-clamp-2 mb-2">{formData.description}</p>
                  <div className="d-flex justify-content-between text-secondary small mb-2 border-top border-bottom py-1">
                    <span>{formData.capacity} Guests</span>
                    <span>{formData.bedType} Bed</span>
                    <span>{formData.size} sq ft</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-baseline">
                    <span className="fs-5 fw-bold text-dark font-serif">${formData.price}</span>
                    <span className="badge badge-available">{formData.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRoom;
