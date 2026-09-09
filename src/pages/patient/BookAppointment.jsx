import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const BookAppointment = ({ navigateTo }) => {
  const [form, setForm] = useState({ doctor: '', date: '', time: '', reason: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errs = {};
    if (!form.doctor) errs.doctor = "Select doctor";
    if (!form.date) errs.date = "Select date";
    if (!form.time) errs.time = "Select time";
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      setLoading(true);
      try {
        await addDoc(collection(db, 'appointments'), {
          patientId: auth.currentUser.uid,
          doctor: form.doctor,
          date: form.date,
          time: form.time,
          reason: form.reason,
          status: 'Scheduled',
          createdAt: serverTimestamp()
        });
        alert("Appointment booked successfully!");
        setForm({ doctor: '', date: '', time: '', reason: '' });
      } catch (error) {
        alert("Error booking: " + error.message);
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
        input, select, textarea { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 14px; transition: 0.2s; background: #f8fafc; font-family: inherit; }
        input:focus, select:focus, textarea:focus { border-color: #3b82f6; outline: none; background: white; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
        textarea { resize: vertical; min-height: 60px; }
        .error { color: #ef4444; font-size: 12px; margin-top: 5px; display: block; }
        .btn { background: #3b82f6; color: white; border: none; padding: 12px 20px; border-radius: 10px; cursor: pointer; width: 100%; font-weight: 700; font-size: 15px; transition: 0.2s; }
        .btn:hover { background: #2563eb; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(59,130,246,0.3); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        @media (max-width: 600px) { .wrapper { padding: 15px; } .card { padding: 20px; } }
      `}</style>
      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('patient-overview')}>← Back to Dashboard</button>
        <h1>Book New Appointment</h1>
        <div className="card">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group"><label>Select Doctor</label><select value={form.doctor} onChange={(e) => setForm({...form, doctor: e.target.value})}><option value="">--Select--</option><option>Dr. Sam (Cardio)</option><option>Dr. Zara (Derma)</option></select>{errors.doctor && <span className="error">{errors.doctor}</span>}</div>
            <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />{errors.date && <span className="error">{errors.date}</span>}</div>
            <div className="form-group"><label>Time</label><input type="time" value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} />{errors.time && <span className="error">{errors.time}</span>}</div>
            <div className="form-group"><label>Reason</label><textarea rows="3" value={form.reason} onChange={(e) => setForm({...form, reason: e.target.value})} placeholder="Briefly describe your symptoms..." /></div>
            <button type="submit" className="btn" disabled={loading}>{loading ? 'Booking...' : 'Book Appointment'}</button>
          </form>
        </div>
      </div>
    </>
  );
};
export default BookAppointment;