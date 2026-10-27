import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Award, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-5 border-top border-secondary">
      <div className="container">
        <div className="row g-4 mb-5">
          {/* Brand & Overview */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="bg-warning text-dark p-2 rounded-3 d-flex align-items-center justify-content-center">
                <Building2 size={24} />
              </div>
              <span className="fs-3 fw-bold text-white tracking-tight">Hotel<span style={{ color: '#c5a880' }}>Pro</span></span>
            </div>
            <p className="text-secondary mb-4 pe-lg-4">
              A bespoke luxury hospitality experience designed for discerning travelers. Unmatched comfort, Michelin-inspired dining, and tailored concierge services.
            </p>
            <div className="d-flex align-items-center gap-2 text-warning small">
              <Award size={18} />
              <span className="text-light">Five-Star Diamond Hospitality Excellence 2026</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-uppercase tracking-wider fw-bold text-warning mb-3 small">Navigation</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 text-secondary">
              <li><Link to="/" className="text-secondary text-decoration-none hover-light">Home</Link></li>
              <li><Link to="/rooms" className="text-secondary text-decoration-none hover-light">Rooms & Suites</Link></li>
              <li><Link to="/about" className="text-secondary text-decoration-none hover-light">About Us</Link></li>
              <li><Link to="/contact" className="text-secondary text-decoration-none hover-light">Concierge & Contact</Link></li>
              <li><Link to="/login" className="text-secondary text-decoration-none hover-light">Guest Login</Link></li>
            </ul>
          </div>

          {/* Room Categories */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-uppercase tracking-wider fw-bold text-warning mb-3 small">Suites & Rooms</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 text-secondary">
              <li><Link to="/rooms?type=Standard+Room" className="text-secondary text-decoration-none hover-light">Standard Room</Link></li>
              <li><Link to="/rooms?type=Deluxe+Room" className="text-secondary text-decoration-none hover-light">Deluxe Room</Link></li>
              <li><Link to="/rooms?type=Executive+Room" className="text-secondary text-decoration-none hover-light">Executive Room</Link></li>
              <li><Link to="/rooms?type=Suite" className="text-secondary text-decoration-none hover-light">Royal Suite</Link></li>
              <li><Link to="/rooms?type=Family+Room" className="text-secondary text-decoration-none hover-light">Family Haven</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-lg-4 col-md-6">
            <h6 className="text-uppercase tracking-wider fw-bold text-warning mb-3 small">Hotel Concierge</h6>
            <ul className="list-unstyled d-flex flex-column gap-3 text-secondary">
              <li className="d-flex align-items-start gap-3">
                <MapPin size={20} className="text-warning flex-shrink-0 mt-1" />
                <span>100 Grand Boulevard, Waterfront Harbor, NY 10001, United States</span>
              </li>
              <li className="d-flex align-items-center gap-3">
                <Phone size={20} className="text-warning flex-shrink-0" />
                <span>+1 (800) 555-HOTEL (4683)</span>
              </li>
              <li className="d-flex align-items-center gap-3">
                <Mail size={20} className="text-warning flex-shrink-0" />
                <span>reservations@hotelpro-luxury.com</span>
              </li>
              <li className="d-flex align-items-center gap-3">
                <ShieldCheck size={20} className="text-success flex-shrink-0" />
                <span>Secure 256-Bit SSL Encrypted Reservations</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary opacity-25 my-4" />

        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 text-secondary small">
          <div>
            &copy; {new Date().getFullYear()} HotelPro Luxury Hospitality Inc. All rights reserved.
          </div>
          <div className="d-flex gap-4">
            <Link to="/about" className="text-secondary text-decoration-none">Privacy Policy</Link>
            <Link to="/about" className="text-secondary text-decoration-none">Terms of Service</Link>
            <Link to="/admin/login" className="text-warning text-decoration-none">Staff Access</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
