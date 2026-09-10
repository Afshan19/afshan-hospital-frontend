import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const NurseDashboard = ({ navigateTo }) => {
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

  return (
    <>
      <style>{`
        .content-header { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; background: white; padding: 15px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .back-home-btn { background: linear-gradient(90deg, #667eea, #764ba2); color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; }
        h1 { font-size: 28px; color: #1e293b; margin: 0; }
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .stat-card h3 { font-size: 36px; color: #667eea; margin: 0; }
        .stat-card p { color: #64748b; margin: 5px 0 0; }
        .empty-state { background: white; padding: 40px; text-align: center; border-radius: 12px; color: #64748b; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border: 2px dashed #cbd5e1; }
        @media (max-width: 768px) { .stats-grid { grid-template-columns: 1fr; } }
      `}</style>
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
    </>
  );
};
export default NurseDashboard;