import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const MyAppointments = ({ navigateTo }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const q = query(collection(db, 'appointments'), where('patientId', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <>
      <style>{`
        * { font-family: 'Segoe UI', sans-serif; }
        .wrapper { padding: 20px; background: #f4f6f9; min-height: 100vh; }
        h1 { margin-bottom: 20px; color: #333; }
        .back-btn { background: #64748b; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; transition: 0.3s; }
        .table { width: 100%; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        th, td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #f8fafc; color: #333; font-weight: 600; }
        .empty { text-align: center; padding: 40px; color: #888; }
      `}</style>
      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('patient-overview')}>Back to Dashboard</button>
        <h1>My Appointments</h1>
        <div className="table">
          {loading ? <div className="empty">Loading...</div> : appointments.length === 0 ? <div className="empty">No appointments booked yet.</div> : <table><thead><tr><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th></tr></thead><tbody>{appointments.map((d) => <tr key={d.id}><td>{d.doctor}</td><td>{d.date}</td><td>{d.time}</td><td>{d.status}</td></tr>)}</tbody></table>}
        </div>
      </div>
    </>
  );
};
export default MyAppointments;