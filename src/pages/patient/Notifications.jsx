import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Notifications = ({ navigateTo }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const q = query(collection(db, 'notifications'), where('patientId', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <>
      <style>{`
        * { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; box-sizing: border-box; }
        .wrapper { padding: 30px; max-width: 1000px; margin: 0 auto; background: #f8fafc; min-height: 100vh; }
        .back-btn { background: #e2e8f0; color: #1e293b; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: 0.2s; margin-bottom: 25px; }
        .back-btn:hover { background: #cbd5e1; transform: translateX(-3px); }
        h1 { color: #0f172a; font-size: 28px; font-weight: 700; margin-bottom: 25px; }
        .list { background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; overflow: hidden; }
        .item { padding: 18px 20px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 12px; transition: 0.2s; }
        .item:last-child { border-bottom: none; }
        .item:hover { background: #f8fafc; }
        .item-badge { width: 10px; height: 10px; border-radius: 50%; background: #3b82f6; flex-shrink: 0; }
        .item-read { background: #e2e8f0; }
        .empty { text-align: center; padding: 50px; color: #94a3b8; font-size: 16px; }
        @media (max-width: 600px) { .wrapper { padding: 15px; } .item { padding: 12px 15px; font-size: 14px; } }
      `}</style>
      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('patient-overview')}>← Back to Dashboard</button>
        <h1>Notifications</h1>
        <div className="list">
          {loading ? <div className="empty">Loading...</div> : notifications.length === 0 ? <div className="empty">You have no new notifications.</div> : notifications.map((d, i) => <div className="item" key={i}><span className="item-badge"></span>{d.message}</div>)}
        </div>
      </div>
    </>
  );
};
export default Notifications;