import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBox from '../components/SearchBox';
import RoomCard from '../components/RoomCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import {
  Sparkles,
  Waves,
  Utensils,
  Flower2,
  Car,
  Wine,
  ShieldCheck,
  Clock,
  Award,
  CheckCircle2,
  Star,
  ArrowRight
} from 'lucide-react';

const Home = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/rooms?sort=rating_desc');
        if (res.data?.success) {
          // Take top 3-4 rooms
          setFeaturedRooms(res.data.rooms.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load featured rooms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const facilities = [
    {
      icon: Waves,
      title: 'Heated Infinity Pool',
      desc: 'Panoramic rooftop infinity pool overlooking the ocean with cabana service.'
    },
    {
      icon: Utensils,
      title: 'Michelin-Starred Dining',
      desc: 'Culinary mastery curated by world-renowned chefs using organic local produce.'
    },
    {
      icon: Flower2,
      title: 'Holistic Luxury Spa',
      desc: 'Rejuvenate body and mind with restorative Swedish massages and organic botanicals.'
    },
    {
      icon: Car,
      title: 'Private Chauffeur & Valet',
      desc: 'Complimentary luxury airport transfers in our fleet of electric Mercedes sedans.'
    },
    {
      icon: Wine,
      title: 'Executive Sommelier Lounge',
      desc: 'Evening wine tastings and rare reserve vintage selections in a private club atmosphere.'
    },
    {
      icon: Clock,
      title: '24/7 Bespoke Butler Service',
      desc: 'Dedicated round-the-clock assistance for unpackaging, dining, and city reservations.'
    }
  ];

  const categories = [
    {
      name: 'Deluxe Room',
      desc: 'Spacious sanctuary with city skyline views and rainfall shower.',
      price: 'From $199/night',
      img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80',
      type: 'Deluxe Room'
    },
    {
      name: 'Executive Room',
      desc: 'Ergonomic business workstation with private executive lounge access.',
      price: 'From $299/night',
      img: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80',
      type: 'Executive Room'
    },
    {
      name: 'Royal Suite',
      desc: 'Opulent penthouse living with private jacuzzi terrace and sommelier service.',
      price: 'From $499/night',
      img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80',
      type: 'Suite'
    },
    {
      name: 'Family Sanctuary',
      desc: 'Connecting suites with entertainment hub and child-friendly amenities.',
      price: 'From $260/night',
      img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
      type: 'Family Room'
    }
  ];

  const testimonials = [
    {
      name: 'Victoria Vance',
      role: 'Global Traveler & Architect',
      quote: 'HotelPro redefined luxury for me. The effortless check-in, breathtaking suite aesthetics, and attentiveness of the concierge made our anniversary stay unforgettable.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Jonathan Sterling',
      role: 'Managing Director, Tech Ventures',
      quote: 'The Executive Room setup was flawless for my meetings. High-speed fiber internet, silent soundproofing, and impeccable room service. My top choice whenever I travel.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Elena Rostova',
      role: 'Travel Journalist',
      quote: 'From the heated infinity pool overlooking the sunset to the Michelin-star breakfast buffet, every tiny detail exudes warmth, class, and genuine hospitality.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
    }
  ];

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section
        className="hero-wrapper position-relative text-white py-5"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85")'
        }}
      >
        <div className="hero-overlay" />
        <div className="container position-relative z-1 py-5">
          <div className="row justify-content-center text-center">
            <div className="col-lg-9 col-xl-8">
              <span className="badge badge-gold mb-3 text-uppercase px-3 py-2">
                <Sparkles size={14} className="me-1" /> The Pinnacle of Luxury Stays
              </span>
              <h1 className="display-3 fw-bold mb-3 font-serif">
                Find Your Perfect Stay
              </h1>
              <p className="lead mb-4 text-light opacity-90 mx-auto" style={{ maxWidth: '680px' }}>
                Immerse yourself in world-class architecture, handcrafted comfort, and five-star hospitality. Reserve your sanctuary today with real-time guaranteed availability.
              </p>
            </div>
          </div>

          {/* Floating Search Form */}
          <div className="row justify-content-center">
            <div className="col-12 col-xl-11">
              <div className="hero-search-card">
                <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                  <span className="fw-bold text-dark fs-6 font-serif">Instant Room & Rate Search</span>
                  <span className="badge bg-success-subtle text-success small ms-auto">
                    Live Booking Overlap Engine
                  </span>
                </div>
                <SearchBox />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY CHOOSE HOTELPRO STATS & HIGHLIGHTS */}
      <section className="py-5 bg-white border-bottom">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-6 col-md-3">
              <div className="p-3">
                <ShieldCheck size={36} className="text-warning mb-2" />
                <h3 className="fw-bold text-dark font-serif mb-1">100% Guaranteed</h3>
                <p className="text-muted small mb-0">Direct Booking Best Price Guarantee</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3">
                <Clock size={36} className="text-warning mb-2" />
                <h3 className="fw-bold text-dark font-serif mb-1">Flexible Dates</h3>
                <p className="text-muted small mb-0">Hassle-free cancellation & refunds</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3">
                <Award size={36} className="text-warning mb-2" />
                <h3 className="fw-bold text-dark font-serif mb-1">5-Star Rated</h3>
                <p className="text-muted small mb-0">Over 15,000 satisfied guests served</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3">
                <CheckCircle2 size={36} className="text-warning mb-2" />
                <h3 className="fw-bold text-dark font-serif mb-1">Instant Confirm</h3>
                <p className="text-muted small mb-0">Instant voucher & demo payment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED ROOMS */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between mb-4">
            <div>
              <span className="section-tag">Curated Collections</span>
              <h2 className="display-6 fw-bold text-dark font-serif mb-0">Featured Rooms & Suites</h2>
            </div>
            <Link to="/rooms" className="btn btn-outline-gold mt-3 mt-md-0 d-inline-flex align-items-center gap-2">
              Browse All Rooms <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading featured rooms..." />
          ) : (
            <div className="row g-4">
              {featuredRooms.map((room) => (
                <div key={room._id} className="col-12 col-md-6 col-lg-4">
                  <RoomCard room={room} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. POPULAR CATEGORIES */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-tag">Distinctive Luxury</span>
            <h2 className="display-6 fw-bold text-dark font-serif mb-2">Explore Room Categories</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
              Whether you are planning a solo executive retreat, romantic getaway, or a multi-generation family escape, we have crafted the ideal accommodation.
            </p>
          </div>

          <div className="row g-4">
            {categories.map((cat, idx) => (
              <div key={idx} className="col-12 col-sm-6 col-lg-3">
                <div className="card luxury-card h-100 overflow-hidden border-0">
                  <div className="position-relative" style={{ height: '220px' }}>
                    <img src={cat.img} alt={cat.name} className="room-gallery-img" />
                    <div className="position-absolute bottom-0 start-0 p-3 text-white" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', width: '100%' }}>
                      <span className="badge badge-gold small mb-1">{cat.price}</span>
                      <h5 className="fw-bold font-serif mb-0 text-white">{cat.name}</h5>
                    </div>
                  </div>
                  <div className="card-body p-3 d-flex flex-column justify-content-between">
                    <p className="text-muted small mb-3">{cat.desc}</p>
                    <Link to={`/rooms?roomType=${encodeURIComponent(cat.type)}`} className="btn btn-sm btn-outline-dark w-100 rounded-3">
                      View Suites
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOTEL FACILITIES */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-tag">World-Class Hospitality</span>
            <h2 className="display-6 fw-bold text-dark font-serif mb-2">Hotel Facilities & Amenities</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
              Enjoy curated experiences created to stimulate your senses, unwind your soul, and ensure every moment exceeds expectations.
            </p>
          </div>

          <div className="row g-4">
            {facilities.map((fac, idx) => {
              const IconComponent = fac.icon;
              return (
                <div key={idx} className="col-12 col-md-6 col-lg-4">
                  <div className="p-4 rounded-4 border bg-light h-100 transition-all hover-shadow">
                    <div className="stat-icon mb-3" style={{ backgroundColor: '#fbf7f2', color: '#c5a880' }}>
                      <IconComponent size={28} />
                    </div>
                    <h5 className="fw-bold font-serif text-dark mb-2">{fac.title}</h5>
                    <p className="text-muted small mb-0">{fac.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-tag">Guest Experiences</span>
            <h2 className="display-6 fw-bold text-dark font-serif mb-2">Loved by Discerning Travelers</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
              Read genuine reviews from guests who have experienced the timeless comfort and hospitality of HotelPro.
            </p>
          </div>

          <div className="row g-4">
            {testimonials.map((t, idx) => (
              <div key={idx} className="col-12 col-lg-4">
                <div className="card luxury-card h-100 p-4 border-0">
                  <div className="d-flex align-items-center gap-1 text-warning mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="fst-italic text-secondary mb-4 flex-grow-1">
                    "{t.quote}"
                  </p>
                  <div className="d-flex align-items-center gap-3 pt-3 border-top">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="rounded-circle"
                      style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                    />
                    <div>
                      <div className="fw-bold text-dark">{t.name}</div>
                      <div className="text-muted small">{t.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION */}
      <section className="py-5 bg-dark text-white text-center position-relative overflow-hidden">
        <div className="container py-4">
          <span className="badge badge-gold mb-3 text-uppercase px-3 py-2">
            Limited Season Exclusive
          </span>
          <h2 className="display-5 fw-bold font-serif mb-3 text-white">
            Ready for an Unforgettable Escape?
          </h2>
          <p className="lead text-secondary mx-auto mb-4" style={{ maxWidth: '640px' }}>
            Book directly through our official portal to receive complimentary breakfast, high-floor room assignment, and late checkout until 2:00 PM.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/rooms" className="btn btn-gold px-4 py-3 fs-6 d-flex align-items-center gap-2">
              Browse Available Rooms <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="btn btn-outline-light px-4 py-3 fs-6">
              Contact Concierge
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
