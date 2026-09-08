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
    <><style>{`* { font-family: 'Segoe UI', sans-serif; } .wrapper { padding: 20px; } h1 { margin-bottom: 20px; color: #333; } .card { background: white; padding: 30px; border-radius: 12px; max-width: 500px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); } .form-group { margin-bottom: 15px; } label { display: block; margin-bottom: 5px; font-weight: 600; } input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; } .error { color: red; font-size: 12px; margin-top: 5px; display: block; } .btn { background: #667eea; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; width: 100%; font-weight: 700; } .back-btn { background: #64748b; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; } .table { width: 100%; margin-top: 20px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); } th, td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; } .empty { text-align: center; padding: 40px; color: #888; }`}</style>
      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('admin-overview')}>← Back to Dashboard</button>
        <h1>Manage Patients</h1>
        <div className="card"><form onSubmit={handleSubmit}>
          <div className="form-group"><label>Patient Name</label><input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />{errors.name && <span className="error">{errors.name}</span>}</div>
          <div className="form-group"><label>Age</label><input type="number" value={form.age} onChange={(e) => setForm({...form, age: e.target.value})} />{errors.age && <span className="error">{errors.age}</span>}</div>
          <div className="form-group"><label>Phone</label><input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />{errors.phone && <span className="error">{errors.phone}</span>}</div>
          <button type="submit" className="btn" disabled={loading}>{loading ? 'Adding...' : 'Add Patient'}</button>
        </form></div>
        <div className="table">{patients.length === 0 ? <div className="empty">No patients added yet.</div> : <table><thead><tr><th>Name</th><th>Age</th><th>Phone</th></tr></thead><tbody>{patients.map((p) => <tr key={p.id}><td>{p.name}</td><td>{p.age}</td><td>{p.phone}</td></tr>)}</tbody></table>}</div>
      </div>
    </>
  );
};
export default ManagePatients;