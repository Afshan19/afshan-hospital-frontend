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
      <style>{`
        * { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; box-sizing: border-box; }
        .wrapper { padding: 30px; max-width: 1200px; margin: 0 auto; background: #f8fafc; min-height: 100vh; }
        .back-btn { background: #e2e8f0; color: #1e293b; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: 0.2s; margin-bottom: 25px; }
        .back-btn:hover { background: #cbd5e1; transform: translateX(-3px); }
        h1 { color: #0f172a; font-size: 28px; font-weight: 700; margin-bottom: 25px; }
        .table { width: 100%; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; }
        th, td { padding: 15px 20px; text-align: left; border-bottom: 1px solid #f1f5f9; }
        th { background: #f1f5f9; color: #0f172a; font-weight: 700; font-size: 14px; }
        tr:last-child td { border-bottom: none; }
        .empty { text-align: center; padding: 50px; color: #94a3b8; font-size: 16px; }
        .status-btn { border: none; padding: 6px 14px; border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: 600; transition: 0.2s; margin-right: 5px; }
        .btn-start { background: #3b82f6; color: white; }
        .btn-start:hover { background: #2563eb; }
        .btn-complete { background: #10b981; color: white; }
        .btn-complete:hover { background: #059669; }
        .status-done { color: #94a3b8; font-weight: 600; }
        @media (max-width: 600px) { .wrapper { padding: 15px; } th, td { padding: 10px; font-size: 13px; } }
      `}</style>
      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('nurse-overview')}>← Back to Dashboard</button>
        <h1>Queue Management</h1>
        <div className="table">
          {loading ? <div className="empty">Loading...</div> : data.length === 0 ? <div className="empty">Queue is empty and under control.</div> : <table><thead><tr><th>Token</th><th>Patient</th><th>Status</th><th>Action</th></tr></thead><tbody>{data.map((d) => (
            <tr key={d.id}>
              <td><strong>{d.token}</strong></td>
              <td>{d.patientName}</td>
              <td><span style={{background: d.status === 'Waiting' ? '#fef3c7' : d.status === 'In Consultation' ? '#dbeafe' : '#d1fae5', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600'}}>{d.status}</span></td>
              <td>
                {d.status === 'Waiting' && <button className="status-btn btn-start" onClick={() => updateStatus(d.id, 'In Consultation')}>Start</button>}
                {d.status === 'In Consultation' && <button className="status-btn btn-complete" onClick={() => updateStatus(d.id, 'Completed')}>Complete</button>}
                {d.status === 'Completed' && <span className="status-done">✅ Done</span>}
              </td>
            </tr>
          ))}</tbody></table>}
        </div>
      </div>
    </>
  );
};
export default QueueManagement;