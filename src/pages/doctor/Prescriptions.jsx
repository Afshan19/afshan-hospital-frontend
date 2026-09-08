import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';

const DoctorPrescriptions = ({ navigateTo }) => {
  const [meds, setMeds] = useState([]);
  const [form, setForm] = useState({ patient: '', medicine: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMeds = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'prescriptions'));
        setMeds(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      }
    };
    fetchMeds();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errs = {};
    if (!form.patient) errs.patient = "Patient name is required";
    if (!form.medicine) errs.medicine = "Medicine name is required";
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setLoading(true);
      try {
        await addDoc(collection(db, 'prescriptions'), {
          patientName: form.patient,
          medicine: form.medicine,
          createdAt: serverTimestamp()
        });
        setMeds([...meds, { id: Date.now(), patientName: form.patient, medicine: form.medicine }]);
        setForm({ patient: '', medicine: '' });
      } catch (error) {
        alert("Error saving prescription: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <><style>{`* { font-family: 'Segoe UI', sans-serif; } .wrapper { padding: 20px; } h1 { margin-bottom: 20px; color: #333; } .card { background: white; padding: 30px; border-radius: 12px; max-width: 500px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); } .form-group { margin-bottom: 15px; } label { display: block; margin-bottom: 5px; font-weight: 600; } input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; } .error { color: red; font-size: 12px; margin-top: 5px; display: block; } .btn { background: #667eea; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; width: 100%; font-weight: 700; } .back-btn { background: #64748b; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; } .table { width: 100%; margin-top: 20px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); } th, td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; } .empty { text-align: center; padding: 40px; color: #888; }`}</style>
      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('doctor-overview')}>← Back to Dashboard</button>
        <h1>Prescriptions</h1>
        <div className="card"><form onSubmit={handleSubmit}>
          <div className="form-group"><label>Patient Name</label><input value={form.patient} onChange={(e) => setForm({...form, patient: e.target.value})} />{errors.patient && <span className="error">{errors.patient}</span>}</div>
          <div className="form-group"><label>Medicine</label><input value={form.medicine} onChange={(e) => setForm({...form, medicine: e.target.value})} />{errors.medicine && <span className="error">{errors.medicine}</span>}</div>
          <button type="submit" className="btn" disabled={loading}>{loading ? 'Saving...' : 'Add Prescription'}</button>
        </form></div>
        <div className="table">{meds.length === 0 ? <div className="empty">No prescriptions added yet.</div> : <table><thead><tr><th>Patient</th><th>Medicine</th></tr></thead><tbody>{meds.map((d) => <tr key={d.id}><td>{d.patientName}</td><td>{d.medicine}</td></tr>)}</tbody></table>}</div>
      </div>
    </>
  );
};
export default DoctorPrescriptions;