import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';

const DoctorMyAvailability = ({ navigateTo }) => {
  const [form, setForm] = useState({ day: '', time: '' });
  const [availability, setAvailability] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'availability'));
        setAvailability(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };
    fetchAvailability();
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
        await addDoc(collection(db, 'availability'), {
          day: form.day,
          time: form.time,
          createdAt: serverTimestamp()
        });
        setAvailability([...availability, { id: Date.now(), day: form.day, time: form.time }]);
        setForm({ day: '', time: '' });
      } catch (error) {
        alert("Error saving availability: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <><style>{`* { font-family: 'Segoe UI', sans-serif; } .wrapper { padding: 20px; } h1 { margin-bottom: 20px; color: #333; } .card { background: white; padding: 30px; border-radius: 12px; max-width: 500px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); } .form-group { margin-bottom: 15px; } label { display: block; margin-bottom: 5px; font-weight: 600; } input, select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; } .error { color: red; font-size: 12px; margin-top: 5px; display: block; } .btn { background: #667eea; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; width: 100%; font-weight: 700; } .back-btn { background: #64748b; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; } .table { width: 100%; margin-top: 20px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); } th, td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; } .empty { text-align: center; padding: 40px; color: #888; }`}</style>
      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('doctor-overview')}>← Back to Dashboard</button>
        <h1>My Availability</h1>
        <div className="card"><form onSubmit={handleSubmit}>
          <div className="form-group"><label>Day</label><select value={form.day} onChange={(e) => setForm({...form, day: e.target.value})}><option value="">--Select Day--</option><option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option><option>Saturday</option><option>Sunday</option></select>{errors.day && <span className="error">{errors.day}</span>}</div>
          <div className="form-group"><label>Time Slot</label><input type="text" placeholder="e.g., 9:00 AM - 5:00 PM" value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} />{errors.time && <span className="error">{errors.time}</span>}</div>
          <button type="submit" className="btn" disabled={loading}>{loading ? 'Saving...' : 'Add Availability'}</button>
        </form></div>
        <div className="table">{availability.length === 0 ? <div className="empty">No availability set yet.</div> : <table><thead><tr><th>Day</th><th>Time</th></tr></thead><tbody>{availability.map((d) => <tr key={d.id}><td>{d.day}</td><td>{d.time}</td></tr>)}</tbody></table>}</div>
      </div>
    </>
  );
};
export default DoctorMyAvailability;