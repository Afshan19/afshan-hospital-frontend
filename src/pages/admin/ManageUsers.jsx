import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const ManageUsers = ({ navigateTo }) => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', role: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) { console.error("Error fetching users:", error); }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errs = {};
    if (!form.name) errs.name = "Name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.role) errs.role = "Role is required";
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setLoading(true);
      try {
        await addDoc(collection(db, 'users'), { ...form, createdAt: new Date() });
        setUsers([...users, { id: Date.now(), ...form }]);
        setForm({ name: '', email: '', role: '' });
      } catch (error) { alert("Error adding user: " + error.message); }
      finally { setLoading(false); }
    }
  };

  return (
    <><style>{`
      * { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; box-sizing: border-box; }
      .wrapper { padding: 30px; max-width: 1000px; margin: 0 auto; background: #f8fafc; min-height: 100vh; }
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
      .empty { text-align: center; padding: 50px; color: #94a3b8; font-size: 16px; }
      @media (max-width: 600px) { .wrapper { padding: 15px; } .card { padding: 20px; } }
    `}</style>
      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('admin-overview')}>← Back to Dashboard</button>
        <h1>Manage Users</h1>
        <div className="card"><form onSubmit={handleSubmit}>
          <div className="form-group"><label>Full Name</label><input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="John Doe" />{errors.name && <span className="error">{errors.name}</span>}</div>
          <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="john@example.com" />{errors.email && <span className="error">{errors.email}</span>}</div>
          <div className="form-group"><label>Role</label><select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}><option value="">--Select--</option><option>Admin</option><option>Doctor</option><option>Nurse</option><option>Receptionist</option></select>{errors.role && <span className="error">{errors.role}</span>}</div>
          <button type="submit" className="btn" disabled={loading}>{loading ? 'Adding...' : 'Add User'}</button>
        </form></div>
        <div className="table">{users.length === 0 ? <div className="empty">No users added yet.</div> : <table><thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>{users.map((u) => <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td></tr>)}</tbody></table>}</div>
      </div>
    </>
  );
};
export default ManageUsers;