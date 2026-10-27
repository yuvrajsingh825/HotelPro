import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, BedDouble, Maximize2, Star, Wifi, Tv, Wind, Coffee, ArrowRight } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

const RoomCard = ({ room, nights = 1, showBookingControls = true }) => {
  const navigate = useNavigate();
  const { setBookingDraft, searchParams } = useBooking();

  const handleBookNow = () => {
    setBookingDraft({
      room,
      checkIn: searchParams.checkIn,
      checkOut: searchParams.checkOut,
      guests: searchParams.guests,
      nights,
      totalAmount: room.price * nights
    });
    navigate(`/rooms/${room._id}`);
  };

  const statusBadge = () => {
    if (room.status === 'Available') {
      return <span className="badge badge-available">Available</span>;
    } else if (room.status === 'Occupied') {
      return <span className="badge badge-occupied">Occupied</span>;
    } else {
      return <span className="badge badge-maintenance">Maintenance</span>;
    }
  };

  return (
    <div className="card luxury-card h-100">
      {/* Image & Badges */}
      <div className="position-relative overflow-hidden" style={{ height: '230px' }}>
        <img
          src={room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'}
          alt={`${room.roomType} ${room.roomNumber}`}
          className="room-gallery-img"
        />
        <div className="position-absolute top-0 start-0 m-3 d-flex gap-2">
          {statusBadge()}
          <span className="badge bg-dark text-white rounded-pill px-3 py-2">
            Room #{room.roomNumber}
          </span>
        </div>
        <div className="position-absolute bottom-0 end-0 m-3">
          <span className="badge bg-white text-dark shadow-sm d-flex align-items-center gap-1 rounded-pill px-2 py-1">
            <Star size={14} className="star-rating fill-warning text-warning" />
            <span className="fw-bold">{room.rating || 4.8}</span>
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body p-4 d-flex flex-column">
        <div className="mb-2">
          <span className="text-uppercase small tracking-wider text-muted fw-bold">
            {room.roomType}
          </span>
          <h5 className="card-title text-dark fw-bold mb-1 mt-1 font-serif">
            {room.roomType} Suite
          </h5>
          <p className="card-text text-muted small line-clamp-2" style={{ minHeight: '38px' }}>
            {room.description}
          </p>
        </div>

        {/* Room Specs */}
        <div className="d-flex align-items-center justify-content-between border-top border-bottom py-2 my-2 text-secondary small">
          <span className="d-flex align-items-center gap-1" title="Max Guests">
            <Users size={16} className="text-muted" /> {room.capacity} Guests
          </span>
          <span className="d-flex align-items-center gap-1" title="Bed Type">
            <BedDouble size={16} className="text-muted" /> {room.bedType}
          </span>
          <span className="d-flex align-items-center gap-1" title="Room Size">
            <Maximize2 size={16} className="text-muted" /> {room.size || 350} sq ft
          </span>
        </div>

        {/* Top Amenities Pills */}
        <div className="d-flex flex-wrap gap-1 mb-3 pt-1">
          {room.amenities?.slice(0, 3).map((amenity, idx) => (
            <span key={idx} className="badge bg-light text-secondary border fw-normal small px-2 py-1">
              {amenity}
            </span>
          ))}
          {room.amenities?.length > 3 && (
            <span className="badge bg-light text-secondary border fw-normal small px-2 py-1">
              +{room.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Pricing and Action */}
        <div className="mt-auto pt-3 border-top d-flex align-items-center justify-content-between">
          <div>
            <div className="text-muted small">Starting from</div>
            <div className="d-flex align-items-baseline gap-1">
              <span className="fs-4 fw-bold text-dark font-serif">${room.price}</span>
              <span className="text-muted small">/ night</span>
            </div>
            {nights > 1 && (
              <div className="text-success small fw-medium">
                ${room.price * nights} total ({nights} nights)
              </div>
            )}
          </div>

          <div className="d-flex gap-2">
            <Link
              to={`/rooms/${room._id}`}
              className="btn btn-outline-dark btn-sm rounded-3 px-3 d-flex align-items-center gap-1"
            >
              Details
            </Link>
            {room.status === 'Available' && (
              <button
                type="button"
                onClick={handleBookNow}
                className="btn btn-gold btn-sm rounded-3 px-3 d-flex align-items-center gap-1"
              >
                Book <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
