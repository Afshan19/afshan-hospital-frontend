import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const MyInvoices = ({ navigateTo }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const q = query(collection(db, 'invoices'), where('patientId', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setInvoices(data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
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
        <h1>My Invoices / Bills</h1>
        <div className="table">
          {loading ? <div className="empty">Loading...</div> : invoices.length === 0 ? <div className="empty">No bills generated.</div> : <table><thead><tr><th>Invoice #</th><th>Amount</th><th>Status</th></tr></thead><tbody>{invoices.map((d) => <tr key={d.id}><td>{d.id}</td><td>${d.amount}</td><td>{d.status}</td></tr>)}</tbody></table>}
        </div>
      </div>
    </>
  );
};
export default MyInvoices;