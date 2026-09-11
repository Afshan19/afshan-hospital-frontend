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
        * { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; box-sizing: border-box; }
        .wrapper { padding: 30px; max-width: 1200px; margin: 0 auto; background: #f8fafc; min-height: 100vh; }
        .back-btn { background: #e2e8f0; color: #1e293b; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: 0.2s; margin-bottom: 25px; }
        .back-btn:hover { background: #cbd5e1; transform: translateX(-3px); }
        h1 { color: #0f172a; font-size: 28px; font-weight: 700; margin-bottom: 25px; }
        .table { width: 100%; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; }
        th, td { padding: 15px 20px; text-align: left; border-bottom: 1px solid #f1f5f9; }
        th { background: #f1f5f9; color: #0f172a; font-weight: 700; font-size: 14px; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #f8fafc; }
        .empty { text-align: center; padding: 50px; color: #94a3b8; font-size: 16px; }
        .status-unpaid { color: #dc2626; font-weight: 600; }
        .status-paid { color: #10b981; font-weight: 600; }
        @media (max-width: 600px) { .wrapper { padding: 15px; } th, td { padding: 10px; font-size: 13px; } }
      `}</style>
      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('patient-overview')}>← Back to Dashboard</button>
        <h1>My Invoices / Bills</h1>
        <div className="table">
          {loading ? (
            <div className="empty">Loading...</div>
          ) : invoices.length === 0 ? (
            <div className="empty">No bills generated yet.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((d, i) => (
                  <tr key={d.id}>
                    <td><strong>#{i + 1}</strong></td>
                    <td>${d.amount}</td>
                    <td>{d.createdAt?.toDate ? d.createdAt.toDate().toLocaleDateString() : '—'}</td>
                    <td className={d.status === 'Unpaid' ? 'status-unpaid' : 'status-paid'}>{d.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};
export default MyInvoices;