import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import api from '../services/api';
import {
  BedDouble,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter
} from 'lucide-react';

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await api.get('/rooms');
      if (res.data?.success) {
        setRooms(res.data.rooms || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleStatusChange = async (roomId, newStatus) => {
    try {
      const res = await api.patch(`/rooms/${roomId}/status`, { status: newStatus });
      if (res.data?.success) {
        setMessage(`Room status updated to ${newStatus}`);
        setRooms(rooms.map((r) => (r._id === roomId ? { ...r, status: newStatus } : r)));
      }
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  };

  const handleDeleteRoom = async (roomId, roomNumber) => {
    if (!window.confirm(`Are you sure you want to permanently delete Room #${roomNumber}?`)) {
      return;
    }

    try {
      const res = await api.delete(`/rooms/${roomId}`);
      if (res.data?.success) {
        setMessage(`Room #${roomNumber} was successfully deleted.`);
        setRooms(rooms.filter((r) => r._id !== roomId));
      }
    } catch (err) {
      setError(err.message || 'Failed to delete room');
    }
  };

  const filteredRooms = rooms.filter((r) => {
    const matchesSearch =
      r.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.roomType.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesType = typeFilter === 'All' || r.roomType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="d-flex min-vh-100 bg-light">
      <AdminSidebar />

      <div className="flex-grow-1 p-4 p-md-5 overflow-auto" style={{ maxHeight: '100vh' }}>
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
          <div>
            <span className="section-tag">Inventory Control</span>
            <h1 className="display-6 fw-bold font-serif text-dark mb-1">Room Management</h1>
            <p className="text-muted mb-0">Total of {rooms.length} rooms & suites currently registered in the system</p>
          </div>
          <Link to="/admin/rooms/add" className="btn btn-gold rounded-3 d-flex align-items-center gap-2 mt-3 mt-md-0 shadow-sm">
            <PlusCircle size={18} /> Add New Room
          </Link>
        </div>

        {/* Alerts */}
        {message && (
          <div className="alert alert-success py-2 px-3 small d-flex align-items-center gap-2 mb-4">
            <CheckCircle2 size={16} />
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-4">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="card luxury-card p-3 mb-4 border-0">
          <div className="row g-3">
            <div className="col-12 col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Search size={16} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search by room number or category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-6 col-md-3">
              <select
                className="form-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Standard Room">Standard Room</option>
                <option value="Deluxe Room">Deluxe Room</option>
                <option value="Executive Room">Executive Room</option>
                <option value="Suite">Royal Suite</option>
                <option value="Family Room">Family Room</option>
              </select>
            </div>

            <div className="col-6 col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <div className="col-12 col-md-1 d-flex align-items-center justify-content-end">
              <span className="badge bg-light text-secondary border p-2">
                {filteredRooms.length}
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <LoadingSpinner text="Fetching room directory..." />
        ) : filteredRooms.length === 0 ? (
          <EmptyState
            title="No Rooms Match Filter"
            description="No room records were found matching your current search parameters."
            actionText="Clear Filters"
            onAction={() => {
              setSearch('');
              setStatusFilter('All');
              setTypeFilter('All');
            }}
          />
        ) : (
          <div className="card luxury-card border-0 p-3">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr className="small text-muted text-uppercase">
                    <th>Room</th>
                    <th>Category</th>
                    <th>Price / Night</th>
                    <th>Capacity & Bed</th>
                    <th>Floor & Size</th>
                    <th>Availability Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRooms.map((room) => (
                    <tr key={room._id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=200&q=80'}
                            alt={`Room ${room.roomNumber}`}
                            className="rounded-3"
                            style={{ width: '60px', height: '48px', objectFit: 'cover' }}
                          />
                          <div>
                            <span className="fw-bold text-dark fs-6">#{room.roomNumber}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-gold">{room.roomType}</span>
                      </td>
                      <td className="fw-bold text-dark font-serif fs-6">
                        ${room.price}
                      </td>
                      <td className="small text-secondary">
                        <div>{room.capacity} Guests</div>
                        <div className="text-muted">{room.bedType} Bed</div>
                      </td>
                      <td className="small text-secondary">
                        <div>Floor {room.floor || 1}</div>
                        <div className="text-muted">{room.size || 350} sq ft</div>
                      </td>
                      <td>
                        <select
                          className={`form-select form-select-sm fw-semibold ${room.status === 'Available' ? 'text-success' : room.status === 'Occupied' ? 'text-danger' : 'text-warning'}`}
                          style={{ maxWidth: '140px' }}
                          value={room.status}
                          onChange={(e) => handleStatusChange(room._id, e.target.value)}
                        >
                          <option value="Available">Available</option>
                          <option value="Occupied">Occupied</option>
                          <option value="Maintenance">Maintenance</option>
                        </select>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <Link
                            to={`/rooms/${room._id}`}
                            className="btn btn-sm btn-outline-secondary p-2"
                            title="Preview Public Page"
                          >
                            <Eye size={15} />
                          </Link>
                          <Link
                            to={`/admin/rooms/edit/${room._id}`}
                            className="btn btn-sm btn-outline-primary p-2"
                            title="Edit Room"
                          >
                            <Edit size={15} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteRoom(room._id, room.roomNumber)}
                            className="btn btn-sm btn-outline-danger p-2"
                            title="Delete Room"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageRooms;
