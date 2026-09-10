import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { collection, addDoc, getDocs, serverTimestamp, query, where } from 'firebase/firestore';

const DoctorMedicalRecords = ({ navigateTo }) => {
  const [activeTab, setActiveTab] = useState('records'); // 'records' | 'labs'

  // ----- Medical Records state -----
  const [records, setRecords] = useState([]);
  const [recordForm, setRecordForm] = useState({ patientId: '', diagnosis: '', notes: '' });
  const [recordErrors, setRecordErrors] = useState({});
  const [recordLoading, setRecordLoading] = useState(false);

  // ----- Lab Reports state -----
  const [labs, setLabs] = useState([]);
  const [labForm, setLabForm] = useState({ patientId: '', test: '', result: '', notes: '' });
  const [labErrors, setLabErrors] = useState({});
  const [labLoading, setLabLoading] = useState(false);

  // ----- Common state -----
  const [patients, setPatients] = useState([]);
  const [doctorName, setDoctorName] = useState('');
  const [fetching, setFetching] = useState(true);

  const fetchAll = async () => {
    try {
      const [rSnap, lSnap] = await Promise.all([
        getDocs(collection(db, 'medicalRecords')),
        getDocs(collection(db, 'labReports'))
      ]);
      setRecords(rSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLabs(lSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) { console.error("Error fetching data:", error); }
    finally { setFetching(false); }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Patients list
        const pSnap = await getDocs(collection(db, 'patients'));
        setPatients(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // Doctor's own name
        if (auth.currentUser) {
          const dq = query(collection(db, 'patients'), where('uid', '==', auth.currentUser.uid));
          const dSnap = await getDocs(dq);
          if (!dSnap.empty) setDoctorName(dSnap.docs[0].data().name || auth.currentUser.email);
          else setDoctorName(auth.currentUser.email || 'Doctor');
        }
        await fetchAll();
      } catch (error) { console.error(error); }
    };
    fetchData();
  }, []);

  // ---------- Medical Record Submit ----------
  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    let errs = {};
    if (!recordForm.patientId) errs.patientId = "Patient is required";
    if (!recordForm.diagnosis) errs.diagnosis = "Diagnosis is required";
    setRecordErrors(errs);

    if (Object.keys(errs).length === 0) {
      setRecordLoading(true);
      try {
        const selected = patients.find(p => (p.uid || p.id) === recordForm.patientId);
        const patientName = selected ? selected.name : 'Unknown';
        const today = new Date().toLocaleDateString();

        const recordData = {
          patientId: recordForm.patientId,
          patientName: patientName,
          doctorId: auth.currentUser.uid,
          doctor: doctorName,
          date: today,
          diagnosis: recordForm.diagnosis,
          notes: recordForm.notes,
          createdAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, 'medicalRecords'), recordData);
        setRecords([{ id: docRef.id, ...recordData, createdAt: new Date() }, ...records]);
        setRecordForm({ patientId: '', diagnosis: '', notes: '' });
        alert("Medical record added successfully!");
      } catch (error) {
        alert("Error adding record: " + error.message);
      } finally { setRecordLoading(false); }
    }
  };

  // ---------- Lab Report Submit ----------
  const handleLabSubmit = async (e) => {
    e.preventDefault();
    let errs = {};
    if (!labForm.patientId) errs.patientId = "Patient is required";
    if (!labForm.test) errs.test = "Test name is required";
    if (!labForm.result) errs.result = "Result is required";
    setLabErrors(errs);

    if (Object.keys(errs).length === 0) {
      setLabLoading(true);
      try {
        const selected = patients.find(p => (p.uid || p.id) === labForm.patientId);
        const patientName = selected ? selected.name : 'Unknown';
        const today = new Date().toLocaleDateString();

        const labData = {
          patientId: labForm.patientId,
          patientName: patientName,
          doctorId: auth.currentUser.uid,
          doctor: doctorName,
          date: today,
          test: labForm.test,
          result: labForm.result,
          notes: labForm.notes,
          createdAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, 'labReports'), labData);
        setLabs([{ id: docRef.id, ...labData, createdAt: new Date() }, ...labs]);
        setLabForm({ patientId: '', test: '', result: '', notes: '' });
        alert("Lab report added successfully! Patient can now view it.");
      } catch (error) {
        alert("Error adding lab report: " + error.message);
      } finally { setLabLoading(false); }
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

        /* Tabs */
        .tabs { display: flex; gap: 10px; margin-bottom: 25px; background: #e2e8f0; padding: 6px; border-radius: 12px; max-width: 500px; }
        .tab-btn {
          flex: 1;
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
          font-size: 14px;
          color: #475569;
          background: transparent;
          transition: 0.25s;
        }
        .tab-btn:hover { background: rgba(255,255,255,0.5); }
        .tab-btn.active { background: white; color: #3b82f6; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }

        .card { background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; max-width: 550px; margin-bottom: 30px; }
        .form-group { margin-bottom: 18px; }
        label { display: block; font-weight: 600; font-size: 14px; color: #334155; margin-bottom: 5px; }
        input, select, textarea { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 14px; transition: 0.2s; background: #f8fafc; font-family: inherit; }
        input:focus, select:focus, textarea:focus { border-color: #3b82f6; outline: none; background: white; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
        textarea { resize: vertical; min-height: 70px; }
        .error { color: #ef4444; font-size: 12px; margin-top: 5px; display: block; }
        .btn { background: #3b82f6; color: white; border: none; padding: 12px 20px; border-radius: 10px; cursor: pointer; width: 100%; font-weight: 700; font-size: 15px; transition: 0.2s; }
        .btn:hover { background: #2563eb; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(59,130,246,0.3); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .btn-lab { background: #10b981; }
        .btn-lab:hover { background: #059669; box-shadow: 0 6px 20px rgba(16,185,129,0.3); }

        .table { width: 100%; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; }
        th, td { padding: 15px 20px; text-align: left; border-bottom: 1px solid #f1f5f9; }
        th { background: #f1f5f9; color: #0f172a; font-weight: 700; font-size: 14px; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #f8fafc; }
        .empty { text-align: center; padding: 50px; color: #94a3b8; font-size: 16px; }
        @media (max-width: 600px) { .wrapper { padding: 15px; } .card { padding: 20px; } th, td { padding: 10px; font-size: 13px; } }
      `}</style>

      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('doctor-overview')}>← Back to Dashboard</button>
        <h1>Patient Medical Records & Lab Reports</h1>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'records' ? 'active' : ''}`}
            onClick={() => setActiveTab('records')}
          >
            🗂️ Medical Records
          </button>
          <button
            className={`tab-btn ${activeTab === 'labs' ? 'active' : ''}`}
            onClick={() => setActiveTab('labs')}
          >
            🧪 Lab Reports
          </button>
        </div>

        {/* ============ TAB 1: Medical Records ============ */}
        {activeTab === 'records' && (
          <>
            <div className="card">
              <form onSubmit={handleRecordSubmit}>
                <div className="form-group">
                  <label>Select Patient</label>
                  <select value={recordForm.patientId} onChange={(e) => setRecordForm({ ...recordForm, patientId: e.target.value })}>
                    <option value="">--Select Patient--</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.uid || p.id}>
                        {p.name} {p.phone ? `(${p.phone})` : ''}
                      </option>
                    ))}
                  </select>
                  {recordErrors.patientId && <span className="error">{recordErrors.patientId}</span>}
                </div>
                <div className="form-group">
                  <label>Diagnosis</label>
                  <input value={recordForm.diagnosis} onChange={(e) => setRecordForm({ ...recordForm, diagnosis: e.target.value })} placeholder="e.g., Viral Fever" />
                  {recordErrors.diagnosis && <span className="error">{recordErrors.diagnosis}</span>}
                </div>
                <div className="form-group">
                  <label>Notes (Optional)</label>
                  <textarea rows="3" value={recordForm.notes} onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })} placeholder="e.g., Take rest for 3 days..." />
                </div>
                <button type="submit" className="btn" disabled={recordLoading}>{recordLoading ? 'Saving...' : 'Add Medical Record'}</button>
              </form>
            </div>

            <div className="table">
              {fetching ? <div className="empty">Loading...</div> : records.length === 0 ? <div className="empty">No medical records found.</div> : (
                <table>
                  <thead><tr><th>Patient</th><th>Doctor</th><th>Diagnosis</th><th>Date</th></tr></thead>
                  <tbody>{records.map((d) => (
                    <tr key={d.id}>
                      <td><strong>{d.patientName || 'Unknown'}</strong></td>
                      <td>{d.doctor || '—'}</td>
                      <td>{d.diagnosis}</td>
                      <td>{d.date || '—'}</td>
                    </tr>
                  ))}</tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* ============ TAB 2: Lab Reports ============ */}
        {activeTab === 'labs' && (
          <>
            <div className="card">
              <form onSubmit={handleLabSubmit}>
                <div className="form-group">
                  <label>Select Patient</label>
                  <select value={labForm.patientId} onChange={(e) => setLabForm({ ...labForm, patientId: e.target.value })}>
                    <option value="">--Select Patient--</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.uid || p.id}>
                        {p.name} {p.phone ? `(${p.phone})` : ''}
                      </option>
                    ))}
                  </select>
                  {labErrors.patientId && <span className="error">{labErrors.patientId}</span>}
                </div>
                <div className="form-group">
                  <label>Test Name</label>
                  <input value={labForm.test} onChange={(e) => setLabForm({ ...labForm, test: e.target.value })} placeholder="e.g., Blood Test / X-Ray / MRI" />
                  {labErrors.test && <span className="error">{labErrors.test}</span>}
                </div>
                <div className="form-group">
                  <label>Result</label>
                  <input value={labForm.result} onChange={(e) => setLabForm({ ...labForm, result: e.target.value })} placeholder="e.g., Normal / High / Positive" />
                  {labErrors.result && <span className="error">{labErrors.result}</span>}
                </div>
                <div className="form-group">
                  <label>Notes (Optional)</label>
                  <textarea rows="3" value={labForm.notes} onChange={(e) => setLabForm({ ...labForm, notes: e.target.value })} placeholder="e.g., Follow-up after 1 week..." />
                </div>
                <button type="submit" className="btn btn-lab" disabled={labLoading}>{labLoading ? 'Saving...' : 'Add Lab Report'}</button>
              </form>
            </div>

            <div className="table">
              {fetching ? <div className="empty">Loading...</div> : labs.length === 0 ? <div className="empty">No lab reports found.</div> : (
                <table>
                  <thead><tr><th>Patient</th><th>Doctor</th><th>Test</th><th>Result</th><th>Date</th></tr></thead>
                  <tbody>{labs.map((d) => (
                    <tr key={d.id}>
                      <td><strong>{d.patientName || 'Unknown'}</strong></td>
                      <td>{d.doctor || '—'}</td>
                      <td>{d.test}</td>
                      <td>{d.result}</td>
                      <td>{d.date || '—'}</td>
                    </tr>
                  ))}</tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default DoctorMedicalRecords;