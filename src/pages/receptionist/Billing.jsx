import React, { useState } from 'react';

const ReceptionistBilling = ({ navigateTo }) => {
  const [form, setForm] = useState({ patient: '', amount: '' });
  const [invoices, setInvoices] = useState([]);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    let errs = {};
    if (!form.patient) errs.patient = "Patient name is required";
    if (!form.amount) errs.amount = "Amount is required";
    else if (isNaN(form.amount) || Number(form.amount) <= 0) errs.amount = "Amount must be positive";
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setInvoices([...invoices, { id: Date.now(), ...form, status: 'Unpaid' }]);
      setForm({ patient: '', amount: '' });
    }
  };

  return (
    <><style>{`* { font-family: 'Segoe UI', sans-serif; } .wrapper { padding: 20px; } h1 { margin-bottom: 20px; color: #333; } .card { background: white; padding: 30px; border-radius: 12px; max-width: 500px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); } .form-group { margin-bottom: 15px; } label { display: block; margin-bottom: 5px; font-weight: 600; } input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; } .error { color: red; font-size: 12px; margin-top: 5px; display: block; } .btn { background: #667eea; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; width: 100%; font-weight: 700; } .back-btn { background: #64748b; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; } .table { width: 100%; margin-top: 20px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); } th, td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; } .empty { text-align: center; padding: 40px; color: #888; }`}</style>
      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('receptionist-overview')}>← Back to Dashboard</button>
        <h1>Billing</h1>
        <div className="card"><form onSubmit={handleSubmit}>
          <div className="form-group"><label>Patient Name</label><input value={form.patient} onChange={(e) => setForm({...form, patient: e.target.value})} />{errors.patient && <span className="error">{errors.patient}</span>}</div>
          <div className="form-group"><label>Amount</label><input type="number" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} />{errors.amount && <span className="error">{errors.amount}</span>}</div>
          <button type="submit" className="btn">Generate Bill</button>
        </form></div>
        <div className="table">{invoices.length === 0 ? <div className="empty">No bills generated.</div> : <table><thead><tr><th>Patient</th><th>Amount</th><th>Status</th></tr></thead><tbody>{invoices.map((inv) => <tr key={inv.id}><td>{inv.patient}</td><td>${inv.amount}</td><td style={{color: '#b45309'}}>{inv.status}</td></tr>)}</tbody></table>}</div>
      </div>
    </>
  );
};
export default ReceptionistBilling;