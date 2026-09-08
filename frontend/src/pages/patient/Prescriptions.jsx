import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Prescriptions = ({ navigateTo }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const q = query(collection(db, 'prescriptions'), where('patientId', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPrescriptions(data);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
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
        th { background: #f8fafc; }
        .empty { text-align: center; padding: 40px; color: #888; }
      `}</style>
      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('patient-overview')}>Back to Dashboard</button>
        <h1>My Prescriptions</h1>
        <div className="table">
          {loading ? <div className="empty">Loading...</div> : prescriptions.length === 0 ? <div className="empty">No prescriptions available.</div> : <table><thead><tr><th>Date</th><th>Doctor</th><th>Medicine</th></tr></thead><tbody>{prescriptions.map((d) => <tr key={d.id}><td>{d.date}</td><td>{d.doctor}</td><td>{d.medicine}</td></tr>)}</tbody></table>}
        </div>
      </div>
    </>
  );
};
export default Prescriptions;