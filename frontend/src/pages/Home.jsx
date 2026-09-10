import React, { useState } from 'react';

const HomeScreen = ({ navigateTo }) => {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    { q: "What are the hospital visiting hours?", a: "Our visiting hours are from 9:00 AM to 9:00 PM. The emergency ward is open 24/7." },
    { q: "How can I book an appointment?", a: "You can book an appointment by logging into your account and selecting the Appointments section." },
    { q: "Can I get my reports online?", a: "Yes, after logging in, you can download your reports from the Medical Records section." },
    { q: "How can I contact the hospital for emergencies?", a: "For any emergency, please call us immediately at 03181485676 or email us at afshanahmed@548gmail.com. Our team is available 24/7." },
  ];

  // Service data (6 cards now)
  const services = [
    {
      icon: "💊",
      title: "Pharmacy",
      description: "Our in-house pharmacy is fully stocked with a wide range of prescription and over‑the‑counter medicines. We offer online ordering and home delivery services for your convenience.",
      features: ["24/7 availability", "Prescription refills", "Online ordering", "Home delivery"]
    },
    {
      icon: "🧪",
      title: "Laboratory",
      description: "State‑of‑the‑art diagnostic lab equipped with the latest technology for accurate and fast test results. We cover everything from blood work to microbiology.",
      features: ["100+ test panels", "Same‑day reports", "Experienced pathologists", "Digital reports"]
    },
    {
      icon: "🛏️",
      title: "Wards & Rooms",
      description: "Comfortable and hygienic patient rooms with modern amenities. We offer private, semi‑private, and general wards to suit every need.",
      features: ["Air‑conditioned rooms", "Attached washrooms", "TV & Wi‑Fi", "Nurse call system"]
    },
    {
      icon: "🚑",
      title: "Ambulance Services",
      description: "Our emergency ambulance fleet is available 24/7 for rapid response. All ambulances are equipped with life‑support equipment and staffed by trained paramedics.",
      features: ["24/7 emergency pickup", "Free for critical cases", "GPS tracking", "Toll‑free number: 1122"],
      emergency: true
    },
    {
      icon: "🚨",
      title: "Emergency Services",
      description: "Round-the-clock emergency care with trained medical staff, modern life-support equipment, and rapid response teams. We are always ready when you need us most.",
      features: ["24/7 Emergency Ward", "Trained Paramedics", "Life-Support Equipment", "Quick Response Time"],
      emergency: true
    },
    {
      icon: "📝",
      title: "Complaints & Feedback",
      description: "We value your opinion. Share your complaints, suggestions, or feedback to help us improve our services. Every voice matters — we listen and act.",
      features: ["24/7 Online Submission", "Anonymous Option Available", "Quick Resolution", "Track Your Complaint Status"]
    }
  ];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; }
        
        .home-header { background: #1e293b; color: white; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; }
        .logo-title { font-size: 24px; font-weight: 800; color: #fff; }
        .logo-title span { color: #38bdf8; }
        .auth-buttons { display: flex; gap: 10px; }
        .header-btn { padding: 10px 20px; border: none; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer; transition: 0.3s; }
        .login-btn { background: transparent; color: white; border: 1px solid #64748b; }
        .login-btn:hover { background: #334155; }
        .register-btn { background: linear-gradient(90deg, #0ea5e9, #38bdf8); color: white; }
        .register-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(14, 165, 233, 0.4); }

        /* Hero Section */
        .hero { min-height: 80vh; display: flex; align-items: center; justify-content: center; text-align: center; background: url('https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat; position: relative; }
        .hero-overlay { background: rgba(0, 0, 0, 0.7); width: 100%; height: 100%; padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .hero h1 { font-size: 48px; color: white; margin-bottom: 15px; }
        .hero p { font-size: 20px; color: #e2e8f0; margin-bottom: 30px; max-width: 700px; }
        .cta-btn { padding: 15px 40px; background: linear-gradient(90deg, #0ea5e9, #38bdf8); color: white; border: none; border-radius: 30px; font-size: 18px; font-weight: 700; cursor: pointer; transition: 0.3s; }
        .cta-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(14, 165, 233, 0.4); }

        /* Services Detail Section */
        .services-section { padding: 60px 30px; background: #f8fafc; }
        .services-header { text-align: center; margin-bottom: 40px; }
        .services-header h2 { font-size: 36px; color: #1e293b; font-weight: 800; }
        .services-header p { font-size: 16px; color: #64748b; margin-top: 5px; }
        .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; max-width: 1200px; margin: 0 auto; }
        .service-card { background: white; border-radius: 16px; padding: 25px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .service-card:hover { transform: translateY(-8px); box-shadow: 0 12px 30px rgba(0,0,0,0.1); }
        .service-icon { font-size: 40px; margin-bottom: 15px; display: block; }
        .service-title { font-size: 24px; font-weight: 700; color: #1e293b; margin-bottom: 10px; }
        .service-desc { color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 15px; }
        .service-features { list-style: none; padding: 0; margin: 0; }
        .service-features li { padding: 5px 0; font-size: 14px; color: #334155; display: flex; align-items: center; gap: 8px; }
        .service-features li::before { content: "✔"; color: #0ea5e9; font-weight: bold; }
        .emergency-tag { background: #dc2626; color: white; font-size: 12px; font-weight: 800; padding: 4px 12px; border-radius: 20px; display: inline-block; margin-top: 10px; }
        .contact-tag { background: #0ea5e9; color: white; font-size: 12px; font-weight: 800; padding: 4px 12px; border-radius: 20px; display: inline-block; margin-top: 10px; }

        /* Contact Section (4 columns) */
        .contact-section { padding: 60px 30px; background: #1e293b; color: white; }
        .contact-header { text-align: center; margin-bottom: 40px; }
        .contact-header h2 { font-size: 36px; font-weight: 800; }
        .contact-header p { font-size: 16px; color: #94a3b8; margin-top: 5px; }
        .contact-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; max-width: 1200px; margin: 0 auto; }
        .contact-item { background: #0f172a; padding: 25px; border-radius: 12px; text-align: center; border: 1px solid #334155; transition: 0.3s; }
        .contact-item:hover { border-color: #38bdf8; transform: translateY(-5px); }
        .contact-icon { font-size: 32px; margin-bottom: 10px; display: block; }
        .contact-item h4 { font-size: 18px; color: #f1f5f9; margin-bottom: 8px; }
        .contact-item p { font-size: 15px; color: #94a3b8; margin: 0; }
        .contact-item a { color: #38bdf8; text-decoration: none; }
        .contact-item a:hover { text-decoration: underline; }

        /* FAQ Section */
        .faq-section { padding: 60px 30px; background: #f8fafc; }
        .faq-header { text-align: center; margin-bottom: 40px; }
        .faq-title { font-size: 36px; color: #1e293b; font-weight: 800; margin-bottom: 10px; }
        .faq-subtitle { font-size: 16px; color: #64748b; }
        .faq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 1000px; margin: 0 auto; }
        .faq-item { background: white; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 10px rgba(0,0,0,0.03); overflow: hidden; transition: all 0.3s ease; }
        .faq-item.active { border-color: #38bdf8; box-shadow: 0 10px 25px rgba(14, 165, 233, 0.15); }
        .faq-question { padding: 20px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-size: 17px; font-weight: 700; color: #1e293b; background: transparent; transition: background 0.3s ease; }
        .faq-item:hover .faq-question { background: #f1f5f9; }
        .faq-item.active .faq-question { background: #f0f9ff; color: #0369a1; }
        .faq-icon { display: flex; justify-content: center; align-items: center; width: 28px; height: 28px; border-radius: 50%; background: #e2e8f0; color: #1e293b; font-size: 18px; font-weight: 700; transition: all 0.4s ease; }
        .faq-item.active .faq-icon { background: linear-gradient(135deg, #0ea5e9, #38bdf8); color: white; transform: rotate(45deg); }
        .faq-answer { padding: 0 20px 20px 20px; color: #475569; font-size: 15px; line-height: 1.7; border-top: 1px solid #f1f5f9; max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease, padding 0.4s ease, opacity 0.4s ease; }
        .faq-item.active .faq-answer { max-height: 300px; opacity: 1; padding-top: 15px; }

        .home-footer { background: #1e293b; color: #94a3b8; text-align: center; padding: 40px 20px; }
        .footer-links { margin-bottom: 20px; }
        .footer-links span { cursor: pointer; margin: 0 15px; transition: 0.3s; }
        .footer-links span:hover { color: #38bdf8; }
        .copyright { font-size: 14px; }

        @media (max-width: 768px) {
          .hero h1 { font-size: 32px; }
          .hero p { font-size: 16px; }
          .home-header { padding: 15px; }
          .faq-grid { grid-template-columns: 1fr; }
          .services-grid { grid-template-columns: 1fr; }
          .contact-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 480px) {
          .contact-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Header */}
      <div className="home-header">
        <div className="logo-title">Afshan <span>Hospital</span></div>
        <div className="auth-buttons">
          <button className="header-btn login-btn" onClick={() => navigateTo('login')}>Login</button>
          <button className="header-btn register-btn" onClick={() => navigateTo('register')}>Register</button>
        </div>
      </div>

      {/* Hero */}
      <div className="hero">
        <div className="hero-overlay">
          <h1>Welcome to Afshan Hospital</h1>
          <p>Providing world-class healthcare services with a modern facility. Your health is our priority.</p>
          <button className="cta-btn" onClick={() => navigateTo('login')}>Get Started</button>
        </div>
      </div>

      {/* Services Section (6 cards) */}
      <div className="services-section">
        <div className="services-header">
          <h2>Our Services</h2>
          <p>Explore the comprehensive range of healthcare services we offer</p>
        </div>
        <div className="services-grid">
          {services.map((service, idx) => (
            <div className="service-card" key={idx}>
              <span className="service-icon">{service.icon}</span>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-desc">{service.description}</p>
              <ul className="service-features">
                {service.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
              {service.emergency && <span className="emergency-tag">🚨 Emergency: 1122</span>}
              {service.contact && <span className="contact-tag">📞 24/7 Support</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section (4 columns) */}
      <div className="contact-section">
        <div className="contact-header">
          <h2>Get in Touch</h2>
          <p>We are here to help you. Reach out to us anytime.</p>
        </div>
        <div className="contact-grid">
          <div className="contact-item">
            <span className="contact-icon">📱</span>
            <h4>Phone</h4>
            <p><a href="tel:+923181485676">03181485676</a></p>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📧</span>
            <h4>Email</h4>
            <p><a href="mailto:afshanahmed@548gmail.com">afshanahmed@548gmail.com</a></p>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📍</span>
            <h4>Address</h4>
            <p>Main Hospital Road, Afshan City</p>
          </div>
          <div className="contact-item">
            <span className="contact-icon">🕒</span>
            <h4>Working Hours</h4>
            <p>24/7 - Always Open</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="faq-section">
        <div className="faq-header">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">Find answers to common questions here</p>
        </div>
        <div className="faq-grid">
          {faqs.map((faq, index) => (
            <div className={`faq-item ${openFaq === index ? 'active' : ''}`} key={index}>
              <div className="faq-question" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                {faq.q}
                <span className="faq-icon">+</span>
              </div>
              <div className="faq-answer">{faq.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="home-footer">
        <div className="footer-links">
          <span>Home</span>
          <span onClick={() => navigateTo('login')}>Patient Login</span>
          <span>Services</span>
          <span>Contact Us</span>
        </div>
        <div className="copyright">© 2026 Afshan Hospital. All rights reserved.</div>
      </div>
    </>
  );
};

export default HomeScreen;