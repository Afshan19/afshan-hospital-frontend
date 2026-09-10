import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';

const ReceptionistBookAppointment = ({ navigateTo }) => {
  const [form, setForm] = useState({ patient: '', doctor: '', date: '', time: '' });
  const [appointments, setAppointments] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'appointments'));
        setAppointments(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) { console.error("Error fetching appointments:", error); }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errs = {};
    if (!form.patient) errs.patient = "Patient name is required";
    if (!form.doctor) errs.doctor = "Doctor is required";
    if (!form.date) errs.date = "Date is required";
    if (!form.time) errs.time = "Time is required";
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setLoading(true);
      try {
        await addDoc(collection(db, 'appointments'), { ...form, status: 'Scheduled', createdAt: serverTimestamp() });
        setAppointments([...appointments, { id: Date.now(), ...form, status: 'Scheduled' }]);
        setForm({ patient: '', doctor: '', date: '', time: '' });
      } catch (error) { alert("Error booking appointment: " + error.message); }
      finally { setLoading(false); }
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
        input, select { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 14px; transition: 0.2s; background: #f8fafc; }
        input:focus, select:focus { border-color: #3b82f6; outline: none; background: white; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
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
        <button className="back-btn" onClick={() => navigateTo('receptionist-overview')}>← Back to Dashboard</button>
        <h1>Book Appointment</h1>
        <div className="card"><form onSubmit={handleSubmit}>
          <div className="form-group"><label>Patient Name</label><input value={form.patient} onChange={(e) => setForm({...form, patient: e.target.value})} placeholder="John Doe" />{errors.patient && <span className="error">{errors.patient}</span>}</div>
          <div className="form-group"><label>Doctor</label><select value={form.doctor} onChange={(e) => setForm({...form, doctor: e.target.value})}><option value="">--Select--</option><option>Dr. Sam</option><option>Dr. Zara</option></select>{errors.doctor && <span className="error">{errors.doctor}</span>}</div>
          <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />{errors.date && <span className="error">{errors.date}</span>}</div>
          <div className="form-group"><label>Time</label><input type="time" value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} />{errors.time && <span className="error">{errors.time}</span>}</div>
          <button type="submit" className="btn" disabled={loading}>{loading ? 'Booking...' : 'Book Appointment'}</button>
        </form></div>
        <div className="table">{appointments.length === 0 ? <div className="empty">No appointments booked yet.</div> : <table><thead><tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th></tr></thead><tbody>{appointments.map((a) => <tr key={a.id}><td><strong>{a.patient}</strong></td><td>{a.doctor}</td><td>{a.date}</td><td>{a.time}</td></tr>)}</tbody></table>}</div>
      </div>
    </>
  );
};
export default ReceptionistBookAppointment;