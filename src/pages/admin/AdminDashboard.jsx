import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const AdminDashboard = ({ navigateTo }) => {
  const [stats, setStats] = useState({ users: 0, doctors: 0, patients: 0, appointments: 0, pendingDoctors: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersSnap, docsSnap, patsSnap, apptsSnap, pendingSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'doctors')),
          getDocs(collection(db, 'patients')),
          getDocs(collection(db, 'appointments')),
          getDocs(query(collection(db, 'patients'), where('status', '==', 'Pending')))
        ]);
        setStats({
          users: usersSnap.size,
          doctors: docsSnap.size,
          patients: patsSnap.size,
          appointments: apptsSnap.size,
          pendingDoctors: pendingSnap.size
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      <style>{`
        .content-header { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; background: white; padding: 15px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .back-home-btn { background: linear-gradient(90deg, #667eea, #764ba2); color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; }
        h1 { font-size: 28px; color: #1e293b; margin: 0; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        .stat-card h3 { font-size: 32px; margin: 0; color: #667eea; }
        .stat-card p { color: #64748b; margin: 5px 0 0; }
        .stat-card.pending { border: 2px solid #f59e0b; background: #fffbeb; }
        .stat-card.pending h3 { color: #f59e0b; }
        .alert-banner { background: #fef3c7; color: #92400e; padding: 15px 20px; border-radius: 12px; border-left: 4px solid #f59e0b; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; font-weight: 600; }
        .alert-btn { background: #f59e0b; color: white; border: none; padding: 8px 18px; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 13px; }
        .alert-btn:hover { background: #d97706; }
        .empty-state { background: white; padding: 40px; text-align: center; border-radius: 12px; color: #64748b; border: 2px dashed #cbd5e1; }
        @media (max-width: 900px) { .stats-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>
      <div className="content-header">
        <button className="back-home-btn" onClick={() => navigateTo('home')}>← Back to Home</button>
        <h1>Admin Dashboard</h1>
      </div>

      {stats.pendingDoctors > 0 && (
        <div className="alert-banner">
          <span>⚠️ You have {stats.pendingDoctors} pending doctor verification request(s).</span>
          <button className="alert-btn" onClick={() => navigateTo('admin-verify-doctors')}>Review Now</button>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card"><h3>{stats.users}</h3><p>Total Users</p></div>
        <div className="stat-card"><h3>{stats.doctors}</h3><p>Doctors</p></div>
        <div className="stat-card"><h3>{stats.patients}</h3><p>Patients</p></div>
        <div className="stat-card"><h3>{stats.appointments}</h3><p>Appointments</p></div>
      </div>

      <div className="empty-state">
        <h3>Welcome to Admin Portal</h3>
        <p>Select an option from the sidebar to manage the hospital system.</p>
      </div>
    </>
  );
};
export default AdminDashboard;