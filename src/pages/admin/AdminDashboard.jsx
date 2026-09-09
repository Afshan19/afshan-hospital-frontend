import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const AdminDashboard = ({ onLogout, navigateTo }) => {
  const [stats, setStats] = useState({ users: 0, doctors: 0, patients: 0, appointments: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersSnap, docsSnap, patsSnap, apptsSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'doctors')),
          getDocs(collection(db, 'patients')),
          getDocs(collection(db, 'appointments'))
        ]);
        setStats({
          users: usersSnap.size,
          doctors: docsSnap.size,
          patients: patsSnap.size,
          appointments: apptsSnap.size
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  const adminMenu = [
    { label: 'Dashboard / Overview', icon: '📊', route: 'admin-overview' },
    { label: 'Manage Users', icon: '👥', route: 'admin-users' },
    { label: 'Manage Doctors', icon: '👨‍⚕️', route: 'admin-doctors' },
    { label: 'Manage Patients', icon: '🛌', route: 'admin-patients' },
    { label: 'Manage Specialties', icon: '🏷️', route: 'admin-specialties' },
    { label: 'Appointments', icon: '📅', route: 'admin-appointments' },

    { label: 'Reports / Analytics', icon: '📈', route: 'admin-reports' },
  ];

  return (
    <>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; } .dashboard-layout { display: flex; height: 100vh; background-color: #f4f6f9; } .sidebar { width: 260px; background: linear-gradient(180deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 25px; display: flex; flex-direction: column; flex-shrink: 0; } .sidebar h2 { font-size: 22px; margin-bottom: 20px; font-weight: 800; color: #fff; } .nav-menu { flex: 1; display: flex; flex-direction: column; gap: 5px; overflow-y: auto; padding-right: 5px; } .nav-item { padding: 10px 12px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; color: #fff; transition: 0.3s; } .nav-item:hover, .nav-item.active { background: rgba(255, 255, 255, 0.2); } .logout-btn { padding: 12px 16px; border-top: 1px solid rgba(255, 255, 255, 0.3); color: #fff; cursor: pointer; margin-top: 15px; } .logout-btn:hover { background: #e11d48; border-radius: 8px; } .main-content { flex: 1; padding: 30px; overflow-y: auto; } .content-header { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; background: white; padding: 15px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); } .back-home-btn { background: linear-gradient(90deg, #667eea, #764ba2); color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; } h1 { font-size: 28px; color: #1e293b; margin: 0; } .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; } .stat-card { background: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); } .stat-card h3 { font-size: 32px; margin: 0; color: #667eea; } .stat-card p { color: #64748b; margin: 5px 0 0; } .empty-state { background: white; padding: 40px; text-align: center; border-radius: 12px; color: #64748b; border: 2px dashed #cbd5e1; } @media (max-width: 900px) { .dashboard-layout { flex-direction: column; } .sidebar { width: 100%; } .stats-grid { grid-template-columns: 1fr 1fr; } }`}</style>
      <div className="dashboard-layout">
        <div className="sidebar">
          <h2>Admin Panel</h2>
          <div className="nav-menu">{adminMenu.map((item) => <div key={item.route} className="nav-item" onClick={() => navigateTo(item.route)}>{item.icon} {item.label}</div>)}</div>
          <div className="logout-btn" onClick={onLogout}>🚪 Logout</div>
        </div>
        <div className="main-content">
          <div className="content-header"><button className="back-home-btn" onClick={() => navigateTo('home')}>← Back to Home</button><h1>Admin Dashboard</h1></div>
          <div className="stats-grid">
            <div className="stat-card"><h3>{stats.users}</h3><p>Total Users</p></div>
            <div className="stat-card"><h3>{stats.doctors}</h3><p>Doctors</p></div>
            <div className="stat-card"><h3>{stats.patients}</h3><p>Patients</p></div>
            <div className="stat-card"><h3>{stats.appointments}</h3><p>Appointments</p></div>
          </div>
          <div className="empty-state"><h3>Welcome to Admin Portal</h3><p>Select an option from the sidebar to manage the hospital system.</p></div>
        </div>
      </div>
    </>
  );
};
export default AdminDashboard;