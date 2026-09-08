import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const AuditLogs = ({ navigateTo }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'auditLogs'));
        setData(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) { console.error("Error fetching logs:", error); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <><style>{`* { font-family: 'Segoe UI', sans-serif; } .wrapper { padding: 20px; } h1 { margin-bottom: 20px; color: #333; } .table { width: 100%; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); } th, td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; } th { background: #f8fafc; } .empty { text-align: center; padding: 40px; color: #888; } .back-btn { background: #64748b; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; }`}</style>
      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('admin-overview')}>← Back to Dashboard</button>
        <h1>Audit Logs</h1>
        <div className="table">
          {loading ? <div className="empty">Loading...</div> : data.length === 0 ? <div className="empty">No audit logs available.</div> : <table><thead><tr><th>User</th><th>Action</th><th>Time</th></tr></thead><tbody>{data.map((d) => <tr key={d.id}><td>{d.user}</td><td>{d.action}</td><td>{d.time ? new Date(d.time.seconds * 1000).toLocaleString() : 'N/A'}</td></tr>)}</tbody></table>}
        </div>
      </div>
    </>
  );
};
export default AuditLogs;