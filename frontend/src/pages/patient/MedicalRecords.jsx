import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const MedicalRecords = ({ navigateTo }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const q = query(collection(db, 'medicalRecords'), where('patientId', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecords(data);
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
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
        <h1>Medical Records</h1>
        <div className="table">
          {loading ? <div className="empty">Loading...</div> : records.length === 0 ? <div className="empty">No medical records found.</div> : <table><thead><tr><th>Date</th><th>Doctor</th><th>Diagnosis</th></tr></thead><tbody>{records.map((d) => <tr key={d.id}><td>{d.date}</td><td>{d.doctor}</td><td>{d.diagnosis}</td></tr>)}</tbody></table>}
        </div>
      </div>
    </>
  );
};
export default MedicalRecords;