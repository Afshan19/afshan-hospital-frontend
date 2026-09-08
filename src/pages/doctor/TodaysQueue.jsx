import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const DoctorTodaysQueue = ({ navigateTo }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'queue'));
        setData(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching queue:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <style>{`* { font-family: 'Segoe UI', sans-serif; } .wrapper { padding: 20px; background: #f4f6f9; min-height: 100vh; } h1 { margin-bottom: 20px; color: #333; } .back-btn { background: #64748b; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; } .table { width: 100%; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); } th, td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; } th { background: #f8fafc; } .empty { text-align: center; padding: 40px; color: #888; }`}</style>
      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('doctor-overview')}>← Back to Dashboard</button>
        <h1>Today's Queue</h1>
        <div className="table">
          {loading ? <div className="empty">Loading...</div> : data.length === 0 ? <div className="empty">No patients in queue.</div> : <table><thead><tr><th>Token</th><th>Patient</th><th>Room</th><th>Status</th></tr></thead><tbody>{data.map((d) => <tr key={d.id}><td>{d.token}</td><td>{d.patientName}</td><td>{d.room}</td><td>{d.status}</td></tr>)}</tbody></table>}
        </div>
      </div>
    </>
  );
};
export default DoctorTodaysQueue;