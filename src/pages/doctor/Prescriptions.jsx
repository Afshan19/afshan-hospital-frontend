import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { collection, addDoc, getDocs, serverTimestamp, query, where } from 'firebase/firestore';

const DoctorPrescriptions = ({ navigateTo }) => {
  const [meds, setMeds] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctorName, setDoctorName] = useState('');
  const [form, setForm] = useState({ patientId: '', medicine: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get all patients (role = Patient)
        const pSnap = await getDocs(collection(db, 'patients'));
        setPatients(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // Get current doctor's name
        if (auth.currentUser) {
          const dq = query(collection(db, 'patients'), where('uid', '==', auth.currentUser.uid));
          const dSnap = await getDocs(dq);
          if (!dSnap.empty) {
            setDoctorName(dSnap.docs[0].data().name || auth.currentUser.email);
          } else {
            setDoctorName(auth.currentUser.email || 'Doctor');
          }
        }

        // Get all prescriptions
        const medSnap = await getDocs(collection(db, 'prescriptions'));
        setMeds(medSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errs = {};
    if (!form.patientId) errs.patientId = "Patient is required";
    if (!form.medicine) errs.medicine = "Medicine is required";
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      setLoading(true);
      try {
        const selected = patients.find(p => (p.uid || p.id) === form.patientId);
        const patientName = selected ? selected.name : 'Unknown';
        const today = new Date().toLocaleDateString();

        const prescriptionData = {
          patientId: form.patientId,
          patientName: patientName,
          doctor: doctorName,
          doctorId: auth.currentUser.uid,
          medicine: form.medicine,
          notes: form.notes,
          date: today,
          createdAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, 'prescriptions'), prescriptionData);
        setMeds([...meds, { id: docRef.id, ...prescriptionData, createdAt: new Date() }]);
        setForm({ patientId: '', medicine: '', notes: '' });
        alert("Prescription added successfully!");
      } catch (error) {
        alert("Error saving prescription: " + error.message);
      } finally {
        setLoading(false);
      }
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
        input, select, textarea { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 14px; transition: 0.2s; background: #f8fafc; font-family: inherit; }
        input:focus, select:focus, textarea:focus { border-color: #3b82f6; outline: none; background: white; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
        textarea { resize: vertical; min-height: 60px; }
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
        @media (max-width: 600px) { .wrapper { padding: 15px; } .card { padding: 20px; } th, td { padding: 10px; font-size: 13px; } }
      `}</style>
      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('doctor-overview')}>← Back to Dashboard</button>
        <h1>Prescriptions</h1>
        <div className="card"><form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Patient</label>
            <select value={form.patientId} onChange={(e) => setForm({...form, patientId: e.target.value})}>
              <option value="">--Select Patient--</option>
              {patients.filter(p => p.role === 'Patient' || !p.role).map(p => (
                <option key={p.id} value={p.uid || p.id}>{p.name} {p.phone ? `(${p.phone})` : ''}</option>
              ))}
            </select>
            {errors.patientId && <span className="error">{errors.patientId}</span>}
          </div>
          <div className="form-group"><label>Medicine</label><input value={form.medicine} onChange={(e) => setForm({...form, medicine: e.target.value})} placeholder="e.g., Panadol 500mg" />{errors.medicine && <span className="error">{errors.medicine}</span>}</div>
          <div className="form-group"><label>Notes (Optional)</label><textarea rows="2" value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} placeholder="e.g., Take 1 tablet twice a day" /></div>
          <button type="submit" className="btn" disabled={loading}>{loading ? 'Saving...' : 'Add Prescription'}</button>
        </form></div>
        <div className="table">
          {meds.length === 0 ? <div className="empty">No prescriptions added yet.</div> : (
            <table>
              <thead><tr><th>Patient</th><th>Doctor</th><th>Medicine</th><th>Date</th></tr></thead>
              <tbody>{meds.map((d) => <tr key={d.id}><td><strong>{d.patientName || 'Unknown'}</strong></td><td>{d.doctor || '—'}</td><td>{d.medicine}</td><td>{d.date || '—'}</td></tr>)}</tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};
export default DoctorPrescriptions;