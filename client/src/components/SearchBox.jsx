import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { Calendar, Users, Home, Search } from 'lucide-react';

const SearchBox = ({ isCompact = false }) => {
  const navigate = useNavigate();
  const { searchParams, updateSearch, formatDate } = useBooking();

  const [formData, setFormData] = useState({
    checkIn: searchParams.checkIn,
    checkOut: searchParams.checkOut,
    guests: searchParams.guests,
    roomType: searchParams.roomType
  });

  const todayStr = formatDate(new Date());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // If checkIn changes, ensure checkOut is at least 1 day after
      if (name === 'checkIn' && updated.checkOut <= value) {
        const nextDay = new Date(value);
        nextDay.setDate(nextDay.getDate() + 1);
        updated.checkOut = formatDate(nextDay);
      }
      return updated;
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateSearch(formData);
    navigate(`/rooms?checkIn=${formData.checkIn}&checkOut=${formData.checkOut}&guests=${formData.guests}&roomType=${encodeURIComponent(formData.roomType)}`);
  };

  return (
    <form onSubmit={handleSearch} className={`search-form-container ${isCompact ? 'p-2' : ''}`}>
      <div className="row g-3 align-items-end">
        {/* Check-In Date */}
        <div className="col-12 col-md-6 col-lg-3">
          <label className="form-label small fw-bold text-dark d-flex align-items-center gap-1 mb-1">
            <Calendar size={14} className="text-warning" /> Check-in Date
          </label>
          <input
            type="date"
            className="form-control py-2 rounded-3"
            name="checkIn"
            min={todayStr}
            value={formData.checkIn}
            onChange={handleChange}
            required
          />
        </div>

        {/* Check-Out Date */}
        <div className="col-12 col-md-6 col-lg-3">
          <label className="form-label small fw-bold text-dark d-flex align-items-center gap-1 mb-1">
            <Calendar size={14} className="text-warning" /> Check-out Date
          </label>
          <input
            type="date"
            className="form-control py-2 rounded-3"
            name="checkOut"
            min={formData.checkIn || todayStr}
            value={formData.checkOut}
            onChange={handleChange}
            required
          />
        </div>

        {/* Number of Guests */}
        <div className="col-12 col-sm-6 col-lg-2">
          <label className="form-label small fw-bold text-dark d-flex align-items-center gap-1 mb-1">
            <Users size={14} className="text-warning" /> Guests
          </label>
          <select
            className="form-select py-2 rounded-3"
            name="guests"
            value={formData.guests}
            onChange={handleChange}
          >
            <option value="1">1 Guest</option>
            <option value="2">2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4 Guests</option>
            <option value="5">5+ Guests</option>
          </select>
        </div>

        {/* Room Type */}
        <div className="col-12 col-sm-6 col-lg-2">
          <label className="form-label small fw-bold text-dark d-flex align-items-center gap-1 mb-1">
            <Home size={14} className="text-warning" /> Category
          </label>
          <select
            className="form-select py-2 rounded-3"
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
          >
            <option value="All">All Categories</option>
            <option value="Standard Room">Standard Room</option>
            <option value="Deluxe Room">Deluxe Room</option>
            <option value="Executive Room">Executive Room</option>
            <option value="Suite">Royal Suite</option>
            <option value="Family Room">Family Room</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="col-12 col-lg-2">
          <button type="submit" className="btn btn-gold w-100 py-2 d-flex align-items-center justify-content-center gap-2">
            <Search size={18} />
            <span>Search</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBox;
