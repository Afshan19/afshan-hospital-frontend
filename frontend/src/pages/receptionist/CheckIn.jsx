import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';

const ReceptionistCheckIn = ({ navigateTo }) => {
  const [form, setForm] = useState({ token: '', patient: '' });
  const [checkedIn, setCheckedIn] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'queue'));
        setCheckedIn(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) { console.error("Error fetching queue:", error); }
    };
    fetchQueue();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errs = {};
    if (!form.token) errs.token = "Token is required";
    if (!form.patient) errs.patient = "Patient name is required";
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setLoading(true);
      try {
        await addDoc(collection(db, 'queue'), { ...form, status: 'Waiting', createdAt: serverTimestamp() });
        setCheckedIn([...checkedIn, { id: Date.now(), ...form, status: 'Waiting' }]);
        setForm({ token: '', patient: '' });
      } catch (error) { alert("Error checking in: " + error.message); }
      finally { setLoading(false); }
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
        .card { background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; max-width: 500px; }
        .form-group { margin-bottom: 18px; }
        label { display: block; font-weight: 600; font-size: 14px; color: #334155; margin-bottom: 5px; }
        input { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 14px; transition: 0.2s; background: #f8fafc; }
        input:focus { border-color: #3b82f6; outline: none; background: white; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
        .error { color: #ef4444; font-size: 12px; margin-top: 5px; display: block; }
        .btn { background: #3b82f6; color: white; border: none; padding: 12px 20px; border-radius: 10px; cursor: pointer; width: 100%; font-weight: 700; font-size: 15px; transition: 0.2s; }
        .btn:hover { background: #2563eb; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(59,130,246,0.3); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .table { width: 100%; margin-top: 30px; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; }
        th, td { padding: 15px 20px; text-align: left; border-bottom: 1px solid #f1f5f9; }
        th { background: #f1f5f9; color: #0f172a; font-weight: 700; font-size: 14px; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #f8fafc; }
        .empty { text-align: center; padding: 50px; color: #94a3b8; font-size: 16px; }
        .status-badge { padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-block; background: #fef3c7; }
        @media (max-width: 600px) { .wrapper { padding: 15px; } .card { padding: 20px; } th, td { padding: 10px; font-size: 13px; } }
      `}</style>
      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('receptionist-overview')}>← Back to Dashboard</button>
        <h1>Patient Check-in</h1>
        <div className="card"><form onSubmit={handleSubmit}>
          <div className="form-group"><label>Token Number</label><input value={form.token} onChange={(e) => setForm({...form, token: e.target.value})} placeholder="A-101" />{errors.token && <span className="error">{errors.token}</span>}</div>
          <div className="form-group"><label>Patient Name</label><input value={form.patient} onChange={(e) => setForm({...form, patient: e.target.value})} placeholder="John Doe" />{errors.patient && <span className="error">{errors.patient}</span>}</div>
          <button type="submit" className="btn" disabled={loading}>{loading ? 'Checking in...' : 'Check-in Patient'}</button>
        </form></div>
        <div className="table">{checkedIn.length === 0 ? <div className="empty">No patients checked in yet.</div> : <table><thead><tr><th>Token</th><th>Patient</th><th>Status</th></tr></thead><tbody>{checkedIn.map((c) => <tr key={c.id}><td><strong>{c.token}</strong></td><td>{c.patient}</td><td><span className="status-badge">{c.status}</span></td></tr>)}</tbody></table>}</div>
      </div>
    </>
  );
};
export default ReceptionistCheckIn;