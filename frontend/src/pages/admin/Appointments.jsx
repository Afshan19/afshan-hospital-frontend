import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const AdminAppointments = ({ navigateTo }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'appointments'));
        setData(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) { console.error("Error fetching appointments:", error); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <><style>{`
      * { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; box-sizing: border-box; }
      .wrapper { padding: 30px; max-width: 1000px; margin: 0 auto; background: #f8fafc; min-height: 100vh; }
      .back-btn { background: #e2e8f0; color: #1e293b; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: 0.2s; margin-bottom: 25px; }
      .back-btn:hover { background: #cbd5e1; transform: translateX(-3px); }
      h1 { color: #0f172a; font-size: 28px; font-weight: 700; margin-bottom: 25px; }
      .table { width: 100%; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; }
      th, td { padding: 15px 20px; text-align: left; border-bottom: 1px solid #f1f5f9; }
      th { background: #f1f5f9; color: #0f172a; font-weight: 700; font-size: 14px; }
      tr:last-child td { border-bottom: none; }
      .empty { text-align: center; padding: 50px; color: #94a3b8; font-size: 16px; }
      @media (max-width: 600px) { .wrapper { padding: 15px; } }
    `}</style>
      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('admin-overview')}>← Back to Dashboard</button>
        <h1>Appointments</h1>
        <div className="table">
          {loading ? <div className="empty">Loading...</div> : data.length === 0 ? <div className="empty">No appointments scheduled.</div> : <table><thead><tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Status</th></tr></thead><tbody>{data.map((d) => <tr key={d.id}><td>{d.patientName || 'Unknown'}</td><td>{d.doctor}</td><td>{d.date}</td><td>{d.status}</td></tr>)}</tbody></table>}
        </div>
      </div>
    </>
  );
};
export default AdminAppointments;