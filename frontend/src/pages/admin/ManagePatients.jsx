import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const ManagePatients = ({ navigateTo }) => {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'patients'));
        setPatients(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) { console.error("Error fetching patients:", error); }
    };
    fetchPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errs = {};
    if (!form.name) errs.name = "Name is required";
    if (!form.age) errs.age = "Age is required";
    if (!form.phone) errs.phone = "Phone is required";
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setLoading(true);
      try {
        await addDoc(collection(db, 'patients'), { ...form, createdAt: new Date() });
        setPatients([...patients, { id: Date.now(), ...form }]);
        setForm({ name: '', age: '', phone: '' });
      } catch (error) { alert("Error adding patient: " + error.message); }
      finally { setLoading(false); }
    }
  };

  return (
    <><style>{`
      * { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; box-sizing: border-box; }
      .wrapper { padding: 30px; max-width: 1000px; margin: 0 auto; background: #f8fafc; min-height: 100vh; }
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
      .empty { text-align: center; padding: 50px; color: #94a3b8; font-size: 16px; }
      @media (max-width: 600px) { .wrapper { padding: 15px; } .card { padding: 20px; } }
    `}</style>
      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('admin-overview')}>← Back to Dashboard</button>
        <h1>Manage Patients</h1>
        <div className="card"><form onSubmit={handleSubmit}>
          <div className="form-group"><label>Patient Name</label><input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="John Doe" />{errors.name && <span className="error">{errors.name}</span>}</div>
          <div className="form-group"><label>Age</label><input type="number" value={form.age} onChange={(e) => setForm({...form, age: e.target.value})} placeholder="30" />{errors.age && <span className="error">{errors.age}</span>}</div>
          <div className="form-group"><label>Phone</label><input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} placeholder="03001234567" />{errors.phone && <span className="error">{errors.phone}</span>}</div>
          <button type="submit" className="btn" disabled={loading}>{loading ? 'Adding...' : 'Add Patient'}</button>
        </form></div>
        <div className="table">{patients.length === 0 ? <div className="empty">No patients added yet.</div> : <table><thead><tr><th>Name</th><th>Age</th><th>Phone</th></tr></thead><tbody>{patients.map((p) => <tr key={p.id}><td>{p.name}</td><td>{p.age}</td><td>{p.phone}</td></tr>)}</tbody></table>}</div>
      </div>
    </>
  );
};
export default ManagePatients;