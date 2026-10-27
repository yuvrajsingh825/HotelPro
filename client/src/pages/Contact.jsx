import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare, HelpCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const faqs = [
    {
      q: 'What are the check-in and check-out times?',
      a: 'Standard check-in begins at 3:00 PM and check-out is at 11:00 AM. Early arrivals and late departures until 2:00 PM may be accommodated complimentary upon request subject to room availability.'
    },
    {
      q: 'Is high-speed wireless internet included?',
      a: 'Yes, all guests enjoy unlimited high-speed fiber WiFi (up to 500 Mbps) across all private suites, meeting spaces, and public lounges.'
    },
    {
      q: 'Can I arrange airport limousine transfers?',
      a: 'Yes, our 24/7 concierge can arrange private airport pickup and drop-off in our electric luxury sedans. Simply specify your flight details in the special requests or email concierge directly.'
    },
    {
      q: 'What is the booking cancellation policy?',
      a: 'Reservations can be cancelled free of charge up to 48 hours prior to 3:00 PM on the scheduled arrival date. Refunds on paid bookings are processed instantly back to your demo payment method.'
    }
  ];

  return (
    <div className="py-5">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="section-tag">24/7 Dedicated Concierge</span>
          <h1 className="display-4 fw-bold font-serif text-dark mb-2">Connect with HotelPro</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '620px' }}>
            Our concierge team is at your service around the clock to arrange airport transfers, private dining reservations, suite customisation, and bespoke itineraries.
          </p>
        </div>

        <div className="row g-5 mb-5">
          {/* Contact Details & Cards */}
          <div className="col-12 col-lg-5">
            <h4 className="fw-bold font-serif text-dark mb-4">Concierge Desk</h4>

            <div className="d-flex flex-column gap-3 mb-4">
              <div className="card luxury-card p-4 border-0">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon" style={{ backgroundColor: '#fbf7f2', color: '#c5a880' }}>
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-1">Estate Location</h6>
                    <p className="text-muted small mb-0">100 Grand Boulevard, Waterfront Harbor, NY 10001</p>
                  </div>
                </div>
              </div>

              <div className="card luxury-card p-4 border-0">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon" style={{ backgroundColor: '#fbf7f2', color: '#c5a880' }}>
                    <Phone size={24} />
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-1">Direct Telephony</h6>
                    <p className="text-muted small mb-0">+1 (800) 555-HOTEL / +1 (212) 555-0199</p>
                  </div>
                </div>
              </div>

              <div className="card luxury-card p-4 border-0">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon" style={{ backgroundColor: '#fbf7f2', color: '#c5a880' }}>
                    <Mail size={24} />
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-1">Electronic Inquiries</h6>
                    <p className="text-muted small mb-0">concierge@hotelpro.com / reservations@hotelpro.com</p>
                  </div>
                </div>
              </div>

              <div className="card luxury-card p-4 border-0">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon" style={{ backgroundColor: '#fbf7f2', color: '#c5a880' }}>
                    <Clock size={24} />
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-1">Concierge Operating Hours</h6>
                    <p className="text-muted small mb-0">24 Hours / 7 Days a Week, 365 Days a Year</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-12 col-lg-7">
            <div className="card luxury-card p-4 p-md-5 border-0">
              <h4 className="fw-bold font-serif text-dark mb-2">Send a Message</h4>
              <p className="text-muted small mb-4">
                Please submit your inquiry below. A senior concierge officer will respond within 2 hours.
              </p>

              {submitted ? (
                <div className="alert alert-success p-4 rounded-4 text-center my-4">
                  <CheckCircle2 size={42} className="text-success mb-2" />
                  <h5 className="fw-bold text-dark">Thank You for Contacting Us</h5>
                  <p className="text-secondary small mb-3">
                    Your message has been received by our senior guest concierge. We look forward to assisting you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
                    }}
                    className="btn btn-outline-success btn-sm px-4"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3 mb-3">
                    <div className="col-12 col-sm-6">
                      <label className="form-label small fw-bold text-muted">Full Name</label>
                      <input
                        type="text"
                        className="form-control rounded-3 py-2"
                        placeholder="e.g. Lord Alexander"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12 col-sm-6">
                      <label className="form-label small fw-bold text-muted">Email Address</label>
                      <input
                        type="email"
                        className="form-control rounded-3 py-2"
                        placeholder="e.g. guest@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-12 col-sm-6">
                      <label className="form-label small fw-bold text-muted">Contact Phone</label>
                      <input
                        type="tel"
                        className="form-control rounded-3 py-2"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-sm-6">
                      <label className="form-label small fw-bold text-muted">Inquiry Subject</label>
                      <select
                        className="form-select rounded-3 py-2"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Special Dietary / Chef Table">Special Dietary / Chef Table</option>
                        <option value="Chauffeur & Airport Limousine">Chauffeur & Airport Limousine</option>
                        <option value="Weddings & Private Celebrations">Weddings & Private Celebrations</option>
                        <option value="Corporate Executive Retreat">Corporate Executive Retreat</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted">Your Message</label>
                    <textarea
                      rows="4"
                      className="form-control rounded-3 py-2"
                      placeholder="How may our concierge team assist you with your upcoming visit?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-gold w-100 py-3 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2"
                  >
                    <Send size={18} /> Send Concierge Request
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-5 pt-4">
          <div className="text-center mb-5">
            <span className="section-tag">Frequently Asked Questions</span>
            <h2 className="display-6 fw-bold font-serif text-dark">Common Guest Inquiries</h2>
          </div>

          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              <div className="accordion accordion-flush" id="faqAccordion">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="accordion-item mb-3 border rounded-3 overflow-hidden shadow-sm">
                    <h2 className="accordion-header" id={`flush-heading${idx}`}>
                      <button
                        className="accordion-button collapsed fw-bold text-dark font-serif"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#flush-collapse${idx}`}
                        aria-expanded="false"
                        aria-controls={`flush-collapse${idx}`}
                      >
                        {faq.q}
                      </button>
                    </h2>
                    <div
                      id={`flush-collapse${idx}`}
                      className="accordion-collapse collapse"
                      aria-labelledby={`flush-heading${idx}`}
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body text-secondary small leading-relaxed">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
