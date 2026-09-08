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
        * { font-family: 'Segoe UI', sans-serif; }
        .wrapper { padding: 20px; background: #f4f6f9; min-height: 100vh; }
        h1 { margin-bottom: 20px; color: #333; }
        .back-btn { background: #64748b; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; transition: 0.3s; }
        .card { background: white; padding: 30px; border-radius: 12px; max-width: 500px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: 600; color: #555; }
        input, select, textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; transition: 0.3s; }
        input:focus, select:focus, textarea:focus { border-color: #667eea; outline: none; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15); }
        .error { color: red; font-size: 12px; display: block; margin-top: 5px; }
        .btn { background: linear-gradient(90deg, #667eea, #764ba2); color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; width: 100%; font-weight: 700; transition: 0.3s; }
        .btn:hover { transform: translateY(-2px); }
      `}</style>
      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('patient-overview')}>Back to Dashboard</button>
        <h1>Book New Appointment</h1>
        <div className="card">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group"><label>Select Doctor</label><select value={form.doctor} onChange={(e) => setForm({...form, doctor: e.target.value})}><option value="">--Select--</option><option>Dr. Sam (Cardio)</option><option>Dr. Zara (Derma)</option></select>{errors.doctor && <span className="error">{errors.doctor}</span>}</div>
            <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />{errors.date && <span className="error">{errors.date}</span>}</div>
            <div className="form-group"><label>Time</label><input type="time" value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} />{errors.time && <span className="error">{errors.time}</span>}</div>
            <div className="form-group"><label>Reason</label><textarea rows="3" value={form.reason} onChange={(e) => setForm({...form, reason: e.target.value})} /></div>
            <button type="submit" className="btn" disabled={loading}>{loading ? 'Booking...' : 'Book Appointment'}</button>
          </form>
        </div>
      </div>
    </>
  );
};
export default BookAppointment;