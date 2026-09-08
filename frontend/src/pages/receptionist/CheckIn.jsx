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
    <><style>{`* { font-family: 'Segoe UI', sans-serif; } .wrapper { padding: 20px; } h1 { margin-bottom: 20px; color: #333; } .card { background: white; padding: 30px; border-radius: 12px; max-width: 500px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); } .form-group { margin-bottom: 15px; } label { display: block; margin-bottom: 5px; font-weight: 600; } input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; } .error { color: red; font-size: 12px; margin-top: 5px; display: block; } .btn { background: #667eea; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; width: 100%; font-weight: 700; } .back-btn { background: #64748b; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; } .table { width: 100%; margin-top: 20px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); } th, td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; } .empty { text-align: center; padding: 40px; color: #888; }`}</style>
      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('receptionist-overview')}>← Back to Dashboard</button>
        <h1>Patient Check-in</h1>
        <div className="card"><form onSubmit={handleSubmit}>
          <div className="form-group"><label>Token Number</label><input value={form.token} onChange={(e) => setForm({...form, token: e.target.value})} placeholder="A-101" />{errors.token && <span className="error">{errors.token}</span>}</div>
          <div className="form-group"><label>Patient Name</label><input value={form.patient} onChange={(e) => setForm({...form, patient: e.target.value})} placeholder="John Doe" />{errors.patient && <span className="error">{errors.patient}</span>}</div>
          <button type="submit" className="btn" disabled={loading}>{loading ? 'Checking in...' : 'Check-in Patient'}</button>
        </form></div>
        <div className="table">{checkedIn.length === 0 ? <div className="empty">No patients checked in yet.</div> : <table><thead><tr><th>Token</th><th>Patient</th><th>Status</th></tr></thead><tbody>{checkedIn.map((c) => <tr key={c.id}><td>{c.token}</td><td>{c.patient}</td><td>{c.status}</td></tr>)}</tbody></table>}</div>
      </div>
    </>
  );
};
export default ReceptionistCheckIn;