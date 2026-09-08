import React, { useState } from 'react';

const HomeScreen = ({ navigateTo }) => {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    { q: "What are the hospital visiting hours?", a: "Our visiting hours are from 9:00 AM to 9:00 PM. The emergency ward is open 24/7." },
    { q: "How can I book an appointment?", a: "You can book an appointment by logging into your account and selecting the Appointments section." },
    { q: "Do you accept insurance?", a: "Yes, we accept all major insurance companies. Details are available in the Billing section." },
    { q: "Can I get my reports online?", a: "Yes, after logging in, you can download your reports from the Medical Records section." },
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

        .services-bar { background: #0f172a; padding: 10px 30px; display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; }
        .service-btn { background: transparent; border: 1px solid #334155; color: white; border-radius: 8px; padding: 8px 15px; cursor: pointer; display: flex; flex-direction: column; align-items: flex-start; transition: all 0.3s ease; min-width: 170px; }
        .service-btn:hover { background: #1e293b; border-color: #38bdf8; transform: translateY(-2px); }
        .service-title { font-size: 14px; font-weight: 700; display: flex; align-items: center; gap: 5px; }
        .service-desc { font-size: 11px; color: #94a3b8; margin-top: 3px; }
        .emergency-badge { background: #dc2626; color: white; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; margin-left: 5px; }

        /* Modern Hospital Building Background */
        .hero { min-height: 80vh; display: flex; align-items: center; justify-content: center; text-align: center; background: url('https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat; position: relative; }
        .hero-overlay { background: rgba(0, 0, 0, 0.7); width: 100%; height: 100%; padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .hero h1 { font-size: 48px; color: white; margin-bottom: 15px; }
        .hero p { font-size: 20px; color: #e2e8f0; margin-bottom: 30px; max-width: 700px; }
        .cta-btn { padding: 15px 40px; background: linear-gradient(90deg, #0ea5e9, #38bdf8); color: white; border: none; border-radius: 30px; font-size: 18px; font-weight: 700; cursor: pointer; transition: 0.3s; }
        .cta-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(14, 165, 233, 0.4); }

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
          .services-bar { flex-direction: column; align-items: center; }
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

      {/* Services Bar */}
      <div className="services-bar">
        <button className="service-btn" onClick={() => navigateTo('pharmacy')}>
          <span className="service-title">💊 Pharmacy</span>
          <span className="service-desc">Medicines & Online Orders</span>
        </button>
        <button className="service-btn" onClick={() => navigateTo('laboratory')}>
          <span className="service-title">🧪 Laboratory</span>
          <span className="service-desc">Tests & Lab Reports</span>
        </button>
        <button className="service-btn" onClick={() => navigateTo('wards')}>
          <span className="service-title">🛏️ Wards</span>
          <span className="service-desc">Rooms, Beds & Availability</span>
        </button>
        <button className="service-btn" onClick={() => navigateTo('ambulance')}>
          <span className="service-title">🚑 Ambulance <span className="emergency-badge">Emergency: 1122</span></span>
          <span className="service-desc">24/7 Emergency Pickup</span>
        </button>
        <button className="service-btn" onClick={() => navigateTo('settings')}>
          <span className="service-title">⚙️ Settings</span>
          <span className="service-desc">System Configurations</span>
        </button>
      </div>

      {/* Hero (Modern Building Background) */}
      <div className="hero">
        <div className="hero-overlay">
          <h1>Welcome to Afshan Hospital</h1>
          <p>Providing world-class healthcare services with a modern facility. Your health is our priority.</p>
          <button className="cta-btn" onClick={() => navigateTo('login')}>Get Started</button>
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