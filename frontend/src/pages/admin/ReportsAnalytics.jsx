import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const ReportsAnalytics = ({ navigateTo }) => {
  const [data, setData] = useState({ patients: 0, doctors: 0, appointments: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pSnap, dSnap, aSnap] = await Promise.all([
          getDocs(collection(db, 'patients')),
          getDocs(collection(db, 'doctors')),
          getDocs(collection(db, 'appointments'))
        ]);
        setData({ patients: pSnap.size, doctors: dSnap.size, appointments: aSnap.size });
      } catch (error) { console.error("Error fetching reports:", error); }
    };
    fetchStats();
  }, []);

  return (
    <><style>{`* { font-family: 'Segoe UI', sans-serif; } .wrapper { padding: 20px; } h1 { margin-bottom: 20px; color: #333; } .empty { text-align: center; padding: 40px; background: white; border-radius: 12px; color: #888; box-shadow: 0 4px 10px rgba(0,0,0,0.05); } .back-btn { background: #64748b; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; } .stat-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 20px; } .card { background: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); } .card h3 { font-size: 28px; margin: 0; color: #667eea; } .card p { color: #64748b; margin: 5px 0 0; }`}</style>
      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('admin-overview')}>← Back to Dashboard</button>
        <h1>Reports / Analytics</h1>
        <div className="stat-cards">
          <div className="card"><h3>{data.patients}</h3><p>Total Patients</p></div>
          <div className="card"><h3>{data.doctors}</h3><p>Total Doctors</p></div>
          <div className="card"><h3>{data.appointments}</h3><p>Total Appointments</p></div>
        </div>
        <div className="empty">
          <h3>Detailed analytics coming soon!</h3>
          <p>Charts and graphs will appear here based on the live data.</p>
        </div>
      </div>
    </>
  );
};
export default ReportsAnalytics;