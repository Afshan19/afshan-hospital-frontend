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
    <><style>{`
      * { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; box-sizing: border-box; }
      .wrapper { padding: 30px; max-width: 1000px; margin: 0 auto; background: #f8fafc; min-height: 100vh; }
      .back-btn { background: #e2e8f0; color: #1e293b; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: 0.2s; margin-bottom: 25px; }
      .back-btn:hover { background: #cbd5e1; transform: translateX(-3px); }
      h1 { color: #0f172a; font-size: 28px; font-weight: 700; margin-bottom: 25px; }
      .stat-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
      .card { background: white; padding: 25px; border-radius: 16px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; transition: 0.2s; }
      .card:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,0.08); }
      .card h3 { font-size: 36px; margin: 0; color: #3b82f6; font-weight: 800; }
      .card p { color: #64748b; margin: 5px 0 0; font-weight: 500; }
      .empty-box { background: white; padding: 50px; border-radius: 16px; text-align: center; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
      .empty-box h3 { color: #0f172a; font-size: 22px; }
      .empty-box p { color: #94a3b8; margin-top: 8px; }
      @media (max-width: 600px) { .stat-cards { grid-template-columns: 1fr; } .wrapper { padding: 15px; } }
    `}</style>
      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('admin-overview')}>← Back to Dashboard</button>
        <h1>Reports / Analytics</h1>
        <div className="stat-cards">
          <div className="card"><h3>{data.patients}</h3><p>Total Patients</p></div>
          <div className="card"><h3>{data.doctors}</h3><p>Total Doctors</p></div>
          <div className="card"><h3>{data.appointments}</h3><p>Total Appointments</p></div>
        </div>
        <div className="empty-box">
          <h3>📊 Detailed analytics coming soon!</h3>
          <p>Charts and graphs will appear here based on the live data.</p>
        </div>
      </div>
    </>
  );
};
export default ReportsAnalytics;