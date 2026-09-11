import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { collection, addDoc, getDocs, serverTimestamp, query, where } from 'firebase/firestore';

const DoctorMyAvailability = ({ navigateTo }) => {
  const [form, setForm] = useState({ day: '', time: '' });
  const [availability, setAvailability] = useState([]);
  const [doctorName, setDoctorName] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get doctor's name
        if (auth.currentUser) {
          const dq = query(collection(db, 'patients'), where('uid', '==', auth.currentUser.uid));
          const dSnap = await getDocs(dq);
          if (!dSnap.empty) {
            setDoctorName(dSnap.docs[0].data().name || auth.currentUser.email);
          } else {
            setDoctorName(auth.currentUser.email || 'Doctor');
          }
        }
        // Get all availability
        const querySnapshot = await getDocs(collection(db, 'availability'));
        setAvailability(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errs = {};
    if (!form.day) errs.day = "Day is required";
    if (!form.time) errs.time = "Time is required";
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      setLoading(true);
      try {
        const data = {
          doctorId: auth.currentUser.uid,
          doctorName: doctorName,
          day: form.day,
          time: form.time,
          createdAt: serverTimestamp()
        };
        const docRef = await addDoc(collection(db, 'availability'), data);
        setAvailability([...availability, { id: docRef.id, ...data, createdAt: new Date() }]);
        setForm({ day: '', time: '' });
        alert("Availability added!");
      } catch (error) {
        alert("Error saving availability: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Only show this doctor's slots
  const mySlots = availability.filter(a => a.doctorId === auth.currentUser?.uid);

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
        <button className="back-btn" onClick={() => navigateTo('doctor-overview')}>← Back to Dashboard</button>
        <h1>My Availability</h1>
        <div className="card"><form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Day</label>
            <select value={form.day} onChange={(e) => setForm({...form, day: e.target.value})}>
              <option value="">--Select Day--</option>
              <option>Monday</option><option>Tuesday</option><option>Wednesday</option>
              <option>Thursday</option><option>Friday</option><option>Saturday</option><option>Sunday</option>
            </select>
            {errors.day && <span className="error">{errors.day}</span>}
          </div>
          <div className="form-group">
            <label>Time Slot</label>
            <input type="text" placeholder="e.g., 9:00 AM - 5:00 PM" value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} />
            {errors.time && <span className="error">{errors.time}</span>}
          </div>
          <button type="submit" className="btn" disabled={loading}>{loading ? 'Saving...' : 'Add Availability'}</button>
        </form></div>
        <div className="table">
          {mySlots.length === 0 ? <div className="empty">No availability set yet.</div> : (
            <table>
              <thead><tr><th>Doctor</th><th>Day</th><th>Time</th></tr></thead>
              <tbody>{mySlots.map((d) => <tr key={d.id}><td><strong>{d.doctorName || 'You'}</strong></td><td>{d.day}</td><td>{d.time}</td></tr>)}</tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};
export default DoctorMyAvailability;