import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const QueueManagement = ({ navigateTo }) => {
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

  const updateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'queue', id), { status: newStatus });
      setData(data.map(item => item.id === id ? { ...item, status: newStatus } : item));
    } catch (error) {
      alert("Error updating status: " + error.message);
    }
  };

  return (
    <>
      <style>{`* { font-family: 'Segoe UI', sans-serif; } .wrapper { padding: 20px; background: #f4f6f9; min-height: 100vh; } h1 { margin-bottom: 20px; color: #333; } .back-btn { background: #64748b; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; } .table { width: 100%; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); } th, td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; } th { background: #f8fafc; } .empty { text-align: center; padding: 40px; color: #888; } .status-btn { border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight: 600; margin-right: 5px; } .btn-start { background: #3b82f6; color: white; } .btn-complete { background: #10b981; color: white; }`}</style>
      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('nurse-overview')}>← Back to Dashboard</button>
        <h1>Queue Management</h1>
        <div className="table">
          {loading ? <div className="empty">Loading...</div> : data.length === 0 ? <div className="empty">Queue is empty and under control.</div> : <table><thead><tr><th>Token</th><th>Patient</th><th>Status</th><th>Action</th></tr></thead><tbody>{data.map((d) => (
            <tr key={d.id}>
              <td>{d.token}</td>
              <td>{d.patientName}</td>
              <td>{d.status}</td>
              <td>
                {d.status === 'Waiting' && <button className="status-btn btn-start" onClick={() => updateStatus(d.id, 'In Consultation')}>Start</button>}
                {d.status === 'In Consultation' && <button className="status-btn btn-complete" onClick={() => updateStatus(d.id, 'Completed')}>Complete</button>}
                {d.status === 'Completed' && <span style={{color: '#888'}}>Done</span>}
              </td>
            </tr>
          ))}</tbody></table>}
        </div>
      </div>
    </>
  );
};
export default QueueManagement;