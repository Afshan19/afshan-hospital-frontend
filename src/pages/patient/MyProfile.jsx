import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const MyProfile = ({ navigateTo }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (auth.currentUser) {
        try {
          const docRef = doc(db, 'patients', auth.currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setForm(docSnap.data());
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errs = {};
    if (!form.name) errs.name = "Name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setLoading(true);
      try {
        await setDoc(doc(db, 'patients', auth.currentUser.uid), {
          ...form,
          uid: auth.currentUser.uid
        }, { merge: true });
        alert("Profile updated successfully!");
      } catch (error) {
        alert("Error updating profile: " + error.message);
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
        input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; transition: 0.3s; }
        input:focus { border-color: #667eea; outline: none; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15); }
        .error { color: red; font-size: 12px; margin-top: 5px; display: block; }
        .btn { background: linear-gradient(90deg, #667eea, #764ba2); color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; width: 100%; font-weight: 700; transition: 0.3s; }
        .btn:hover { transform: translateY(-2px); }
      `}</style>
      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('patient-overview')}>Back to Dashboard</button>
        <h1>My Profile</h1>
        <div className="card">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group"><label>Full Name</label><input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />{errors.name && <span className="error">{errors.name}</span>}</div>
            <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />{errors.email && <span className="error">{errors.email}</span>}</div>
            <div className="form-group"><label>Phone</label><input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} /></div>
            <div className="form-group"><label>Address</label><input value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} /></div>
            <button type="submit" className="btn" disabled={loading}>{loading ? 'Saving...' : 'Update Profile'}</button>
          </form>
        </div>
      </div>
    </>
  );
};
export default MyProfile;