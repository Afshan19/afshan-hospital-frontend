import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const PatientDashboard = ({ onLogout, navigateTo, userName }) => {
  const [displayName, setDisplayName] = useState(userName || 'Patient');
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const patientMenu = [
    { label: 'Dashboard / Overview', icon: '🏠', route: 'patient-overview' },
    { label: 'MyProfile', icon: '👤', route: 'patient-profile' },
    { label: 'BookAppointment', icon: '📅', route: 'patient-book' },
    { label: 'MyAppointments', icon: '🗓️', route: 'patient-appointments' },
    { label: 'MedicalRecords', icon: '📁', route: 'patient-records' },
    { label: 'Prescriptions', icon: '💊', route: 'patient-prescriptions' },
    { label: 'LabReports', icon: '🔬', route: 'patient-labs' },
    { label: 'MyInvoices', icon: '💰', route: 'patient-invoices' },
    { label: 'Notifications', icon: '🔔', route: 'patient-notifications' },
  ];

  useEffect(() => {
    const fetchUserName = async () => {
      if (auth.currentUser) {
        try {
          const q = query(collection(db, 'patients'), where('uid', '==', auth.currentUser.uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
            setDisplayName(data.name || 'Patient');
          }
        } catch (error) {
          console.error('Error fetching name:', error);
        }
      }
      setIsLoadingUser(false);
    };
    fetchUserName();
  }, []);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; }
        .dashboard-layout { display: flex; height: 100vh; background-color: #F0F4F8; }
        .sidebar { width: 260px; background: #2D3748; color: #E2E8F0; padding: 25px; display: flex; flex-direction: column; flex-shrink: 0; }
        .profile-header { display: flex; align-items: center; gap: 15px; margin-bottom: 30px; border-bottom: 1px solid #4A5568; padding-bottom: 20px; }
        .profile-img { width: 45px; height: 45px; border-radius: 50%; background: #4A5568; display: flex; justify-content: center; align-items: center; }
        .profile-name { font-size: 16px; font-weight: 700; color: #fff; }
        .profile-title { font-size: 12px; color: #A0AEC0; }
        .nav-menu { flex: 1; display: flex; flex-direction: column; gap: 5px; overflow-y: auto; }
        .nav-item { padding: 12px 15px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; color: #CBD5E0; transition: 0.3s; display: flex; align-items: center; gap: 10px; }
        .nav-item:hover, .nav-item.active { background: #4A5568; color: #fff; }
        .logout-btn { padding: 12px 15px; border-top: 1px solid #4A5568; color: #F56565; cursor: pointer; margin-top: 15px; display: flex; align-items: center; gap: 10px; }
        .logout-btn:hover { background: #4A5568; border-radius: 8px; color: #fff; }
        .main-content { flex: 1; padding: 30px; overflow-y: auto; }
        .content-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .back-home-btn { background: transparent; border: 2px solid #667eea; color: #667eea; padding: 8px 15px; border-radius: 8px; font-weight: 700; cursor: pointer; }
        .back-home-btn:hover { background: #667eea; color: white; }
        .welcome-banner { background: linear-gradient(135deg, #36D1DC 0%, #5B86E5 100%); border-radius: 15px; padding: 30px 40px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; color: white; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .welcome-text h1 { font-size: 32px; font-weight: 800; margin-bottom: 5px; }
        .welcome-text p { font-size: 16px; opacity: 0.9; }
        .hero-img { width: 200px; }
        .hero-img img { width: 100%; height: auto; max-height: 150px; object-fit: contain; filter: drop-shadow(5px 5px 10px rgba(0,0,0,0.2)); }
        .dashboard-clean-area { background: white; border-radius: 12px; padding: 40px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border: 2px dashed #cbd5e1; }
        @media (max-width: 900px) { .dashboard-layout { flex-direction: column; } .sidebar { width: 100%; height: auto; } .nav-menu { max-height: 200px; } .welcome-banner { flex-direction: column; text-align: center; gap: 20px; } }
      `}</style>

      <div className="dashboard-layout">
        <div className="sidebar">
          <div className="profile-header">
            <div className="profile-img"><span style={{fontSize: '25px'}}>👤</span></div>
            <div>
              <div className="profile-title">PATIENT PORTAL</div>
              <div className="profile-name">{isLoadingUser ? 'Loading...' : displayName}</div>
            </div>
          </div>

          <div className="nav-menu">
            {patientMenu.map((item) => (
              <div key={item.route} className={`nav-item ${item.route === 'patient-overview' ? 'active' : ''}`} onClick={() => navigateTo(item.route)}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div className="logout-btn" onClick={onLogout}><span>🚪</span> Logout</div>
        </div>

        <div className="main-content">
          <div className="content-header">
            <h1 style={{color: '#1e293b'}}>Patient Dashboard</h1>
            <button className="back-home-btn" onClick={() => navigateTo('home')}>← Back to Home</button>
          </div>

          <div className="welcome-banner">
            <div className="welcome-text">
              <h1>Welcome Back, {displayName}!</h1>
              <p>Your health is our priority.</p>
            </div>
            <div className="hero-img">
               <img src="https://img.freepik.com/free-vector/doctors-concept-illustration_114360-1515.jpg?w=740&t=st=1690000000~exp=1690000600~hmac=xyz" alt="Doctors" />
            </div>
          </div>

          <div className="dashboard-clean-area">
            <h3>Welcome to your Patient Portal</h3>
            <p>Select an option from the sidebar to manage your health records.</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default PatientDashboard;