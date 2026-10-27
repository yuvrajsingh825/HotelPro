import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Compass, HeartHandshake, Leaf, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

const About = () => {
  const leaders = [
    {
      name: 'Alexander Sterling',
      role: 'Founder & Managing Director',
      bio: 'Over 25 years of luxury hospitality leadership at premier five-star destinations across Europe and North America.',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Claire Dupont',
      role: 'Chief Hospitality Architect',
      bio: 'Renowned interior designer dedicated to blending classical French elegance with modern minimalist wellness aesthetics.',
      img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Chef Marcus Vance',
      role: 'Executive Culinary Director',
      bio: 'Two Michelin-starred maestro bringing sustainable farm-to-table culinary brilliance to our signature restaurants.',
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const milestones = [
    { year: '2016', title: 'The Vision Conceived', desc: 'HotelPro was born from the desire to create a friction-free, tech-forward luxury sanctuary.' },
    { year: '2019', title: 'Grand Harbor Opening', desc: 'Unveiled our premier waterfront estate featuring 120 custom-designed suites and penthouse villas.' },
    { year: '2023', title: 'Sustainability Award', desc: 'Attained 100% renewable power certification and zero single-use plastic recognition.' },
    { year: '2026', title: 'HotelPro 2.0 Launch', desc: 'Introduced real-time algorithmic room allocation and automated contactless guest concierge.' }
  ];

  return (
    <div className="py-5">
      <div className="container">
        {/* Hero Section */}
        <div className="row align-items-center g-5 mb-5 pb-4">
          <div className="col-12 col-lg-6">
            <span className="section-tag">Our Heritage & Vision</span>
            <h1 className="display-4 fw-bold font-serif text-dark mb-4">
              Where Bespoke Elegance Meets Thoughtful Modern Hospitality
            </h1>
            <p className="lead text-secondary mb-4">
              HotelPro was founded with a singular conviction: luxury is not simply grandeur, but the profound feeling of being seamlessly cared for in every moment.
            </p>
            <p className="text-secondary">
              Nestled at the edge of the vibrant waterfront, our hotel marries acoustic architectural tranquility with intuitive digital convenience. From our automated date overlap booking engine to our personal butler team, every facet is designed around your absolute ease.
            </p>
          </div>
          <div className="col-12 col-lg-6">
            <div className="position-relative">
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80"
                alt="HotelPro Architecture"
                className="img-fluid rounded-4 shadow-lg w-100"
                style={{ height: '420px', objectFit: 'cover' }}
              />
              <div className="card position-absolute bottom-0 start-0 m-4 p-3 bg-white rounded-3 shadow border-0" style={{ maxWidth: '280px' }}>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <Award size={22} className="text-warning" />
                  <span className="fw-bold text-dark font-serif">Five-Star Diamond</span>
                </div>
                <div className="small text-muted">Awarded Global Best Luxury Boutique Hotel 2026</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillars / Values */}
        <div className="mb-5 pb-4">
          <div className="text-center mb-5">
            <span className="section-tag">Our Guiding Principles</span>
            <h2 className="display-6 fw-bold font-serif text-dark">The Pillars of HotelPro</h2>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card luxury-card h-100 p-4 border-0">
                <div className="stat-icon mb-3" style={{ backgroundColor: '#fbf7f2', color: '#c5a880' }}>
                  <Sparkles size={26} />
                </div>
                <h5 className="fw-bold font-serif text-dark mb-2">Uncompromising Luxury</h5>
                <p className="text-muted small mb-0">
                  Custom Italian linens, curated art collections, and acoustic tranquility in every private suite.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="card luxury-card h-100 p-4 border-0">
                <div className="stat-icon mb-3" style={{ backgroundColor: '#fbf7f2', color: '#c5a880' }}>
                  <HeartHandshake size={26} />
                </div>
                <h5 className="fw-bold font-serif text-dark mb-2">Intuitive Hospitality</h5>
                <p className="text-muted small mb-0">
                  Warm, personalized service that anticipates your preferences without intrusion.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="card luxury-card h-100 p-4 border-0">
                <div className="stat-icon mb-3" style={{ backgroundColor: '#fbf7f2', color: '#c5a880' }}>
                  <Compass size={26} />
                </div>
                <h5 className="fw-bold font-serif text-dark mb-2">Smart Technology</h5>
                <p className="text-muted small mb-0">
                  Instant real-time room availability, frictionless mock checkout, and seamless digital concierge.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div className="card luxury-card h-100 p-4 border-0">
                <div className="stat-icon mb-3" style={{ backgroundColor: '#fbf7f2', color: '#c5a880' }}>
                  <Leaf size={26} />
                </div>
                <h5 className="fw-bold font-serif text-dark mb-2">Green Stewardship</h5>
                <p className="text-muted small mb-0">
                  Solar-assisted thermal heating, zero plastic toiletries, and certified organic culinary sourcing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Milestones Timeline */}
        <div className="bg-white p-5 rounded-4 shadow-sm border mb-5">
          <div className="text-center mb-5">
            <span className="section-tag">A Decade of Excellence</span>
            <h2 className="display-6 fw-bold font-serif text-dark">Our Journey</h2>
          </div>

          <div className="row g-4">
            {milestones.map((m, idx) => (
              <div key={idx} className="col-12 col-sm-6 col-lg-3">
                <div className="border-start border-warning border-3 ps-3">
                  <div className="fs-3 fw-bold text-warning font-serif mb-1">{m.year}</div>
                  <h6 className="fw-bold text-dark mb-1">{m.title}</h6>
                  <p className="text-muted small mb-0">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Leadership Team */}
        <div className="mb-5">
          <div className="text-center mb-5">
            <span className="section-tag">The Visionaries</span>
            <h2 className="display-6 fw-bold font-serif text-dark">Executive Leadership</h2>
          </div>

          <div className="row g-4">
            {leaders.map((leader, idx) => (
              <div key={idx} className="col-12 col-md-4">
                <div className="card luxury-card h-100 border-0 overflow-hidden text-center">
                  <img
                    src={leader.img}
                    alt={leader.name}
                    className="w-100"
                    style={{ height: '300px', objectFit: 'cover' }}
                  />
                  <div className="card-body p-4">
                    <h5 className="fw-bold font-serif text-dark mb-1">{leader.name}</h5>
                    <div className="badge badge-gold mb-3">{leader.role}</div>
                    <p className="text-muted small mb-0">{leader.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center py-4 bg-light rounded-4 border p-5">
          <h3 className="fw-bold font-serif text-dark mb-2">Experience HotelPro in Person</h3>
          <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '500px' }}>
            Book your upcoming getaway today and discover why discerning travelers call HotelPro their second home.
          </p>
          <Link to="/rooms" className="btn btn-gold px-4 py-2 d-inline-flex align-items-center gap-2">
            Explore Rooms & Suites <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
