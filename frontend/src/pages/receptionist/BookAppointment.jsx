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
    <><style>{`* { font-family: 'Segoe UI', sans-serif; } .wrapper { padding: 20px; } h1 { margin-bottom: 20px; color: #333; } .card { background: white; padding: 30px; border-radius: 12px; max-width: 500px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); } .form-group { margin-bottom: 15px; } label { display: block; margin-bottom: 5px; font-weight: 600; } input, select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; } .error { color: red; font-size: 12px; margin-top: 5px; display: block; } .btn { background: #667eea; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; width: 100%; font-weight: 700; } .back-btn { background: #64748b; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; } .table { width: 100%; margin-top: 20px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); } th, td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; } .empty { text-align: center; padding: 40px; color: #888; }`}</style>
      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('receptionist-overview')}>← Back to Dashboard</button>
        <h1>Book Appointment</h1>
        <div className="card"><form onSubmit={handleSubmit}>
          <div className="form-group"><label>Patient Name</label><input value={form.patient} onChange={(e) => setForm({...form, patient: e.target.value})} />{errors.patient && <span className="error">{errors.patient}</span>}</div>
          <div className="form-group"><label>Doctor</label><select value={form.doctor} onChange={(e) => setForm({...form, doctor: e.target.value})}><option value="">--Select--</option><option>Dr. Sam</option><option>Dr. Zara</option></select>{errors.doctor && <span className="error">{errors.doctor}</span>}</div>
          <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />{errors.date && <span className="error">{errors.date}</span>}</div>
          <div className="form-group"><label>Time</label><input type="time" value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} />{errors.time && <span className="error">{errors.time}</span>}</div>
          <button type="submit" className="btn" disabled={loading}>{loading ? 'Booking...' : 'Book Appointment'}</button>
        </form></div>
        <div className="table">{appointments.length === 0 ? <div className="empty">No appointments booked yet.</div> : <table><thead><tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th></tr></thead><tbody>{appointments.map((a) => <tr key={a.id}><td>{a.patient}</td><td>{a.doctor}</td><td>{a.date}</td><td>{a.time}</td></tr>)}</tbody></table>}</div>
      </div>
    </>
  );
};
export default ReceptionistBookAppointment;