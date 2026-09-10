import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const DoctorDashboard = ({ navigateTo }) => {
  const [stats, setStats] = useState({ patients: 0, appointments: 0, prescriptions: 0, labs: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [patientsSnap, apptsSnap, medsSnap, labsSnap] = await Promise.all([
          getDocs(collection(db, 'patients')),
          getDocs(collection(db, 'appointments')),
          getDocs(collection(db, 'prescriptions')),
          getDocs(collection(db, 'labReports'))
        ]);
        setStats({
          patients: patientsSnap.size,
          appointments: apptsSnap.size,
          prescriptions: medsSnap.size,
          labs: labsSnap.size
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
        .stat-card { background: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .stat-card h3 { font-size: 32px; margin: 0; color: #667eea; }
        .stat-card p { color: #64748b; margin: 5px 0 0; }
        .empty-state { background: white; padding: 40px; text-align: center; border-radius: 12px; color: #64748b; border: 2px dashed #cbd5e1; }
        @media (max-width: 900px) { .stats-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>
      <div className="content-header">
        <button className="back-home-btn" onClick={() => navigateTo('home')}>← Back to Home</button>
        <h1>Doctor Dashboard</h1>
      </div>
      <div className="stats-grid">
        <div className="stat-card"><h3>{stats.patients}</h3><p>Total Patients</p></div>
        <div className="stat-card"><h3>{stats.appointments}</h3><p>Appointments</p></div>
        <div className="stat-card"><h3>{stats.prescriptions}</h3><p>Prescriptions</p></div>
        <div className="stat-card"><h3>{stats.labs}</h3><p>Lab Reports</p></div>
        
      </div>
      <div className="empty-state"><h3>Welcome to Doctor Portal</h3><p>Select an option from the sidebar to manage your patients and appointments.</p></div>
    </>
  );
};
export default DoctorDashboard;