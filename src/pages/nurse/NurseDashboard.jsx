import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const NurseDashboard = ({ onLogout, navigateTo }) => {
  const [stats, setStats] = useState({ waiting: 0, checkedIn: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'queue'));
        const allQueue = querySnapshot.docs.map(doc => doc.data());
        setStats({
          waiting: allQueue.filter(item => item.status === 'Waiting').length,
          checkedIn: allQueue.filter(item => item.status === 'Checked-in' || item.status === 'In Consultation').length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  const nurseMenu = [
    { label: 'Dashboard / Overview', icon: '📊', route: 'nurse-overview' },
    { label: "Today's Queue", icon: '📋', route: 'nurse-queue' },
    { label: 'Patient Check-in', icon: '✅', route: 'nurse-checkin' },
    { label: 'Patient Information', icon: '👤', route: 'nurse-info' },
    { label: 'Queue Management', icon: '⚙️', route: 'nurse-queue-mgmt' },
  ];

  return (
    <>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; } .dashboard-layout { display: flex; height: 100vh; background-color: #f4f6f9; } .sidebar { width: 260px; background: linear-gradient(180deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 25px; display: flex; flex-direction: column; flex-shrink: 0; } .sidebar h2 { font-size: 22px; margin-bottom: 20px; font-weight: 800; color: #fff; } .nav-menu { flex: 1; display: flex; flex-direction: column; gap: 5px; overflow-y: auto; padding-right: 5px; } .nav-item { padding: 10px 12px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; color: #fff; transition: 0.3s; white-space: nowrap; } .nav-item:hover, .nav-item.active { background: rgba(255, 255, 255, 0.2); } .logout-btn { padding: 12px 16px; border-top: 1px solid rgba(255, 255, 255, 0.3); color: #fff; cursor: pointer; margin-top: 15px; transition: 0.3s; } .logout-btn:hover { background: #e11d48; border-radius: 8px; } .main-content { flex: 1; padding: 30px; overflow-y: auto; } .content-header { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; background: white; padding: 15px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); } .back-home-btn { background: linear-gradient(90deg, #667eea, #764ba2); color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; transition: 0.3s; } h1 { font-size: 28px; color: #1e293b; margin: 0; } .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; } .stat-card { background: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); } .stat-card h3 { font-size: 36px; color: #667eea; margin: 0; } .stat-card p { color: #64748b; margin: 5px 0 0; } .empty-state { background: white; padding: 40px; text-align: center; border-radius: 12px; color: #64748b; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border: 2px dashed #cbd5e1; } @media (max-width: 768px) { .dashboard-layout { flex-direction: column; } .sidebar { width: 100%; height: auto; } .nav-menu { max-height: 200px; } .stats-grid { grid-template-columns: 1fr; } }`}</style>
      <div className="dashboard-layout">
        <div className="sidebar">
          <h2>Nurse Panel</h2>
          <div className="nav-menu">
            {nurseMenu.map((item) => (
              <div key={item.route} className="nav-item" onClick={() => navigateTo(item.route)}>{item.icon} {item.label}</div>
            ))}
          </div>
          <div className="logout-btn" onClick={onLogout}>🚪 Logout</div>
        </div>
        <div className="main-content">
          <div className="content-header">
            <button className="back-home-btn" onClick={() => navigateTo('home')}>← Back to Home</button>
            <h1>Nurse Dashboard</h1>
          </div>

          <div className="stats-grid">
            <div className="stat-card"><h3>{stats.waiting}</h3><p>Waiting Patients</p></div>
            <div className="stat-card"><h3>{stats.checkedIn}</h3><p>Checked-in / In Consultation</p></div>
          </div>

          <div className="empty-state">
            <h3>Welcome to Nurse Portal</h3>
            <p>Select an option from the sidebar to manage the patient queue.</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default NurseDashboard;