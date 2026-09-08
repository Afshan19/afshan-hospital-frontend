import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const PatientCheckIn = ({ navigateTo }) => {
  const [form, setForm] = useState({ token: '', patient: '', room: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errs = {};
    if (!form.token) errs.token = "Token is required";
    if (!form.patient) errs.patient = "Patient name is required";
    if (!form.room) errs.room = "Room/Ward is required";
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      setLoading(true);
      try {
        await addDoc(collection(db, 'queue'), {
          token: form.token,
          patientName: form.patient,
          room: form.room,
          status: 'Waiting', // Default status
          createdAt: serverTimestamp()
        });
        alert("Patient checked in successfully!");
        setForm({ token: '', patient: '', room: '' });
      } catch (error) {
        alert("Error checking in: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <style>{`* { font-family: 'Segoe UI', sans-serif; } .wrapper { padding: 20px; background: #f4f6f9; min-height: 100vh; } h1 { margin-bottom: 20px; color: #333; } .card { background: white; padding: 30px; border-radius: 12px; max-width: 500px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); } .form-group { margin-bottom: 15px; } label { display: block; margin-bottom: 5px; font-weight: 600; } input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; } .error { color: red; font-size: 12px; margin-top: 5px; display: block; } .btn { background: #667eea; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; width: 100%; font-weight: 700; } .btn:disabled { opacity: 0.7; } .back-btn { background: #64748b; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; }`}</style>
      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('nurse-overview')}>← Back to Dashboard</button>
        <h1>Patient Check-in</h1>
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Token Number</label><input value={form.token} onChange={(e) => setForm({...form, token: e.target.value})} placeholder="A-101" />{errors.token && <span className="error">{errors.token}</span>}</div>
            <div className="form-group"><label>Patient Name</label><input value={form.patient} onChange={(e) => setForm({...form, patient: e.target.value})} placeholder="John Doe" />{errors.patient && <span className="error">{errors.patient}</span>}</div>
            <div className="form-group"><label>Assigned Room / Ward</label><input value={form.room} onChange={(e) => setForm({...form, room: e.target.value})} placeholder="ICU / Ward 2" />{errors.room && <span className="error">{errors.room}</span>}</div>
            <button type="submit" className="btn" disabled={loading}>{loading ? 'Checking in...' : 'Check-in Patient'}</button>
          </form>
        </div>
      </div>
    </>
  );
};
export default PatientCheckIn;