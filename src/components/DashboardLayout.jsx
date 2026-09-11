import React, { useState } from 'react';

const DashboardLayout = ({ role, activeRoute, navigateTo, onLogout, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menus = {
    Admin: [

      { label: 'Dashboard / Overview', icon: '📊', route: 'admin-overview' },
                  { label: 'Doctor Verification', icon: '🩺', route: 'admin-verify-doctors' },

      { label: 'Manage Users', icon: '👥', route: 'admin-users' },
      { label: 'Manage Doctors', icon: '👨‍⚕️', route: 'admin-doctors' },
      { label: 'Manage Patients', icon: '🛌', route: 'admin-patients' },
      { label: 'Manage Specialties', icon: '🏷️', route: 'admin-specialties' },
      { label: 'Appointments', icon: '📅', route: 'admin-appointments' },
      { label: 'Reports / Analytics', icon: '📈', route: 'admin-reports' },
    ],
    Doctor: [
      { label: 'Dashboard / Overview', icon: '📊', route: 'doctor-overview' },
      { label: 'My Appointments', icon: '📅', route: 'doctor-appointments' },
      { label: "Today's Queue", icon: '📋', route: 'doctor-queue' },
      { label: 'Patients', icon: '👥', route: 'doctor-patients' },
      { label: 'Medical Records', icon: '🗂️', route: 'doctor-medical-records' },
      { label: 'Prescriptions', icon: '💊', route: 'doctor-prescriptions' },
      { label: 'My Availability', icon: '🕒', route: 'doctor-availability' },
    ],
    Nurse: [
      { label: 'Dashboard / Overview', icon: '📊', route: 'nurse-overview' },
      { label: "Today's Queue", icon: '📋', route: 'nurse-queue' },
      { label: 'Patient Check-in', icon: '✅', route: 'nurse-checkin' },
      { label: 'Patient Information', icon: '👤', route: 'nurse-info' },
    ],
    Patient: [
      { label: 'Dashboard / Overview', icon: '🏠', route: 'patient-overview' },
      { label: 'My Profile', icon: '👤', route: 'patient-profile' },
      { label: 'Book Appointment', icon: '📅', route: 'patient-book' },
      { label: 'My Appointments', icon: '🗓️', route: 'patient-appointments' },
      { label: 'Medical Records', icon: '📋', route: 'patient-records' },
      { label: 'Prescriptions', icon: '💊', route: 'patient-prescriptions' },
      { label: 'Lab Reports', icon: '🧪', route: 'patient-labs' },
      { label: 'My Invoices', icon: '💰', route: 'patient-invoices' },
      { label: 'Notifications', icon: '🔔', route: 'patient-notifications' },
    ],
    Receptionist: [
      { label: 'Dashboard / Overview', icon: '📊', route: 'receptionist-overview' },
      { label: 'Register Patient', icon: '📝', route: 'receptionist-register' },
      { label: 'Patients', icon: '👥', route: 'receptionist-patients' },
      { label: 'Book Appointment', icon: '📅', route: 'receptionist-book' },
      { label: 'Appointments', icon: '🗓️', route: 'receptionist-appointments' },
      { label: 'Check-in', icon: '✅', route: 'receptionist-checkin' },
      { label: 'Billing', icon: '💰', route: 'receptionist-billing' },
    ],
  };

  const menuItems = menus[role] || [];

  const handleMenuClick = (route) => {
    navigateTo(route);
    setSidebarOpen(false);
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; }
        .layout-container { display: flex; min-height: 100vh; background-color: #f4f6f9; }
        .sidebar {
          width: 260px;
          background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          padding: 25px;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          height: 100vh;
          position: sticky;
          top: 0;
          overflow-y: auto;
          transition: transform 0.3s ease;
          z-index: 1000;
        }
        .sidebar h2 { font-size: 22px; margin-bottom: 20px; font-weight: 800; color: #fff; }
        .nav-menu { flex: 1; display: flex; flex-direction: column; gap: 5px; }
        .nav-item {
          padding: 10px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #fff;
          transition: 0.3s;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .nav-item:hover, .nav-item.active { background: rgba(255, 255, 255, 0.2); }
        .logout-btn {
          padding: 12px 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.3);
          color: #fff;
          cursor: pointer;
          margin-top: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: 0.3s;
        }
        .logout-btn:hover { background: #e11d48; border-radius: 8px; }
        .main-content {
          flex: 1;
          padding: 30px;
          overflow-y: auto;
          min-height: 100vh;
        }
        .mobile-topbar {
          display: none;
          background: linear-gradient(90deg, #667eea, #764ba2);
          color: white;
          padding: 15px;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 900;
        }
        .hamburger {
          font-size: 24px;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        }
        .mobile-title { font-size: 18px; font-weight: 600; }
        .overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          z-index: 999;
        }
        .overlay.active { display: block; }
        @media (max-width: 768px) {
          .layout-container { flex-direction: column; }
          .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            transform: translateX(-100%);
            width: 260px;
          }
          .sidebar.open { transform: translateX(0); }
          .mobile-topbar { display: flex; }
          .main-content { padding: 20px; }
        }
      `}</style>

      <div className="layout-container">
        <div className="mobile-topbar">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <span className="mobile-title">{role} Panel</span>
          <div style={{ width: '24px' }}></div>
        </div>

        <div className={`overlay ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}></div>

        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <h2>{role} Panel</h2>
          <div className="nav-menu">
            {menuItems.map((item) => (
              <div
                key={item.route}
                className={`nav-item ${activeRoute === item.route ? 'active' : ''}`}
                onClick={() => handleMenuClick(item.route)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div className="logout-btn" onClick={onLogout}>
            <span>🚪</span> Logout
          </div>
        </div>

        <div className="main-content">
          {children}
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;