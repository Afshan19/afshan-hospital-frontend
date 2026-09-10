import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { collection, addDoc, getDocs, serverTimestamp, query, where } from 'firebase/firestore';

const BookAppointment = ({ navigateTo }) => {
  const [form, setForm] = useState({ doctorId: '', date: '', time: '', reason: '' });
  const [doctors, setDoctors] = useState([]);
  const [patientName, setPatientName] = useState('');
  const [availability, setAvailability] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (auth.currentUser) {
          const pq = query(collection(db, 'patients'), where('uid', '==', auth.currentUser.uid));
          const pSnap = await getDocs(pq);
          if (!pSnap.empty) setPatientName(pSnap.docs[0].data().name || '');
        }
        const dSnap = await getDocs(collection(db, 'doctors'));
        setDoctors(dSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        const aSnap = await getDocs(collection(db, 'availability'));
        setAvailability(aSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) { console.error("Error fetching data:", error); }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errs = {};
    if (!form.doctorId) errs.doctorId = "Select doctor";
    if (!form.date) errs.date = "Select date";
    if (!form.time) errs.time = "Select time";
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      setLoading(true);
      try {
        const selectedDoc = doctors.find(d => d.id === form.doctorId);
        const doctorName = selectedDoc ? selectedDoc.name : '';

        // Save appointment
        await addDoc(collection(db, 'appointments'), {
          patientId: auth.currentUser.uid,
          patientName: patientName,
          doctorId: form.doctorId,
          doctor: doctorName,
          date: form.date,
          time: form.time,
          reason: form.reason,
          status: 'Scheduled',
          createdAt: serverTimestamp()
        });

        // 🔔 AUTO-GENERATE NOTIFICATION
        await addDoc(collection(db, 'notifications'), {
          patientId: auth.currentUser.uid,
          message: `Your appointment with ${doctorName} on ${form.date} at ${form.time} is confirmed.`,
          read: false,
          createdAt: serverTimestamp()
        });

        alert("Appointment booked successfully! Check your notifications.");
        setForm({ doctorId: '', date: '', time: '', reason: '' });
      } catch (error) {
        alert("Error booking: " + error.message);
      } finally { setLoading(false); }
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
        .avail-section { margin-top: 30px; background: white; padding: 25px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; }
        .avail-section h2 { font-size: 20px; color: #0f172a; margin-bottom: 15px; }
        .avail-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 15px; }
        .avail-card { background: #f1f5f9; padding: 15px; border-radius: 10px; border: 1px solid #e2e8f0; }
        .avail-card strong { display: block; color: #0f172a; font-size: 15px; margin-bottom: 5px; }
        .avail-card span { color: #64748b; font-size: 14px; }
        .empty { color: #94a3b8; text-align: center; padding: 20px; }
        @media (max-width: 600px) { .wrapper { padding: 15px; } .card { padding: 20px; } }
      `}</style>
      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('patient-overview')}>← Back to Dashboard</button>
        <h1>Book New Appointment</h1>
        <div className="card">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label>Select Doctor</label>
              <select value={form.doctorId} onChange={(e) => setForm({...form, doctorId: e.target.value})}>
                <option value="">--Select--</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.name} {d.spec ? `(${d.spec})` : ''}</option>)}
              </select>
              {errors.doctorId && <span className="error">{errors.doctorId}</span>}
            </div>
            <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />{errors.date && <span className="error">{errors.date}</span>}</div>
            <div className="form-group"><label>Time</label><input type="time" value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} />{errors.time && <span className="error">{errors.time}</span>}</div>
            <div className="form-group"><label>Reason</label><textarea rows="3" value={form.reason} onChange={(e) => setForm({...form, reason: e.target.value})} placeholder="Briefly describe your symptoms..." /></div>
            <button type="submit" className="btn" disabled={loading}>{loading ? 'Booking...' : 'Book Appointment'}</button>
          </form>
        </div>
        <div className="avail-section">
          <h2>🕒 Doctor Availability</h2>
          {availability.length === 0 ? (
            <div className="empty">No availability set by doctors yet.</div>
          ) : (
            <div className="avail-grid">
              {availability.map(a => (
                <div key={a.id} className="avail-card">
                  <strong>{a.doctorName || 'Doctor'}</strong>
                  <span>{a.day} • {a.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default BookAppointment;