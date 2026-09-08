import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';

const DoctorClinicalNotes = ({ navigateTo }) => {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ patient: '', note: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'clinicalNotes'));
        setNotes(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errs = {};
    if (!form.patient) errs.patient = "Patient name is required";
    if (!form.note) errs.note = "Note is required";
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setLoading(true);
      try {
        await addDoc(collection(db, 'clinicalNotes'), {
          patientName: form.patient,
          note: form.note,
          createdAt: serverTimestamp()
        });
        setNotes([...notes, { id: Date.now(), patientName: form.patient, note: form.note }]);
        setForm({ patient: '', note: '' });
      } catch (error) {
        alert("Error saving note: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <><style>{`* { font-family: 'Segoe UI', sans-serif; } .wrapper { padding: 20px; } h1 { margin-bottom: 20px; color: #333; } .card { background: white; padding: 30px; border-radius: 12px; max-width: 500px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); } .form-group { margin-bottom: 15px; } label { display: block; margin-bottom: 5px; font-weight: 600; } input, textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; } .error { color: red; font-size: 12px; margin-top: 5px; display: block; } .btn { background: #667eea; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; width: 100%; font-weight: 700; } .back-btn { background: #64748b; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; } .table { width: 100%; margin-top: 20px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); } th, td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; } .empty { text-align: center; padding: 40px; color: #888; }`}</style>
      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('doctor-overview')}>← Back to Dashboard</button>
        <h1>Clinical Notes</h1>
        <div className="card"><form onSubmit={handleSubmit}>
          <div className="form-group"><label>Patient Name</label><input value={form.patient} onChange={(e) => setForm({...form, patient: e.target.value})} />{errors.patient && <span className="error">{errors.patient}</span>}</div>
          <div className="form-group"><label>Clinical Note</label><textarea rows="4" value={form.note} onChange={(e) => setForm({...form, note: e.target.value})} />{errors.note && <span className="error">{errors.note}</span>}</div>
          <button type="submit" className="btn" disabled={loading}>{loading ? 'Saving...' : 'Save Note'}</button>
        </form></div>
        <div className="table">{notes.length === 0 ? <div className="empty">No clinical notes added yet.</div> : <table><thead><tr><th>Patient</th><th>Note</th></tr></thead><tbody>{notes.map((d) => <tr key={d.id}><td>{d.patientName}</td><td>{d.note}</td></tr>)}</tbody></table>}</div>
      </div>
    </>
  );
};
export default DoctorClinicalNotes;