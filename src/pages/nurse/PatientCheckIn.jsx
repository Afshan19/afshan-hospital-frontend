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
          status: 'Waiting',
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
      <style>{`
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
        @media (max-width: 600px) { .wrapper { padding: 15px; } .card { padding: 20px; } }
      `}</style>
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