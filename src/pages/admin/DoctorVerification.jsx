import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';

const DoctorVerification = ({ navigateTo }) => {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const fetchDoctors = async () => {
    try {
      const q = query(collection(db, 'patients'), where('role', '==', 'Doctor'));
      const snap = await getDocs(q);
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setPending(all.filter(d => d.status === 'Pending'));
      setApproved(all.filter(d => d.status === 'Approved' || !d.status));
      setRejected(all.filter(d => d.status === 'Rejected'));
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const updateStatus = async (id, status) => {
    setActionId(id);
    try {
      await updateDoc(doc(db, 'patients', id), { status });
      // Refresh local state
      setPending(pending.filter(d => d.id !== id));
      setApproved([]); setRejected([]);
      await fetchDoctors();
      alert(`Doctor ${status === 'Approved' ? 'approved ✅' : 'rejected ❌'} successfully!`);
    } catch (error) {
      alert("Error updating: " + error.message);
    } finally {
      setActionId(null);
    }
  };

  const renderTable = (data, showActions = false) => {
    if (data.length === 0) return <div className="empty">No doctors in this category.</div>;
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>License</th>
            <th>Specialization</th>
            <th>Status</th>
            {showActions && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {data.map(d => (
            <tr key={d.id}>
              <td><strong>{d.name}</strong></td>
              <td>{d.email}</td>
              <td>{d.phone || '—'}</td>
              <td>{d.license || '—'}</td>
              <td>{d.specialization || '—'}</td>
              <td>
                <span className={`badge badge-${(d.status || 'Approved').toLowerCase()}`}>
                  {d.status || 'Approved'}
                </span>
              </td>
              {showActions && (
                <td>
                  <button
                    className="action-btn approve-btn"
                    disabled={actionId === d.id}
                    onClick={() => updateStatus(d.id, 'Approved')}
                  >
                    ✅ Approve
                  </button>
                  <button
                    className="action-btn reject-btn"
                    disabled={actionId === d.id}
                    onClick={() => updateStatus(d.id, 'Rejected')}
                  >
                    ❌ Reject
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <>
      <style>{`
        * { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; box-sizing: border-box; }
        .wrapper { padding: 30px; max-width: 1200px; margin: 0 auto; background: #f8fafc; min-height: 100vh; }
        .back-btn { background: #e2e8f0; color: #1e293b; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: 0.2s; margin-bottom: 25px; }
        .back-btn:hover { background: #cbd5e1; transform: translateX(-3px); }
        h1 { color: #0f172a; font-size: 28px; font-weight: 700; margin-bottom: 10px; }
        .subtitle { color: #64748b; font-size: 15px; margin-bottom: 25px; }
        .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
        .stat-box { background: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; }
        .stat-box h3 { font-size: 32px; margin: 0 0 5px; }
        .stat-box p { color: #64748b; font-size: 14px; margin: 0; }
        .stat-box.pending h3 { color: #f59e0b; }
        .stat-box.approved h3 { color: #10b981; }
        .stat-box.rejected h3 { color: #ef4444; }
        .section-title { font-size: 18px; font-weight: 700; color: #0f172a; margin: 25px 0 15px; display: flex; align-items: center; gap: 8px; }
        .table-wrapper { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; min-width: 800px; }
        th, td { padding: 15px 20px; text-align: left; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        th { background: #f1f5f9; color: #0f172a; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #f8fafc; }
        .empty { text-align: center; padding: 50px; color: #94a3b8; font-size: 15px; }
        .badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; display: inline-block; }
        .badge-pending { background: #fef3c7; color: #92400e; }
        .badge-approved { background: #d1fae5; color: #065f46; }
        .badge-rejected { background: #fee2e2; color: #991b1b; }
        .action-btn { border: none; padding: 8px 14px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 13px; margin-right: 8px; transition: 0.2s; }
        .approve-btn { background: #10b981; color: white; }
        .approve-btn:hover { background: #059669; }
        .reject-btn { background: #ef4444; color: white; }
        .reject-btn:hover { background: #dc2626; }
        .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        @media (max-width: 600px) { .wrapper { padding: 15px; } .stats-row { grid-template-columns: 1fr; } }
      `}</style>

      <div className="wrapper">
        <button className="back-btn" onClick={() => navigateTo('admin-overview')}>← Back to Dashboard</button>
        <h1>Doctor Verification</h1>
        <p className="subtitle">Review and approve/reject doctor registration requests.</p>

        <div className="stats-row">
          <div className="stat-box pending"><h3>{pending.length}</h3><p>Pending Requests</p></div>
          <div className="stat-box approved"><h3>{approved.length}</h3><p>Approved Doctors</p></div>
          <div className="stat-box rejected"><h3>{rejected.length}</h3><p>Rejected</p></div>
        </div>

        {loading ? (
          <div className="table-wrapper"><div className="empty">Loading...</div></div>
        ) : (
          <>
            <h2 className="section-title">⏳ Pending Requests ({pending.length})</h2>
            <div className="table-wrapper">{renderTable(pending, true)}</div>

            <h2 className="section-title">✅ Approved Doctors ({approved.length})</h2>
            <div className="table-wrapper">{renderTable(approved, false)}</div>

            {rejected.length > 0 && (
              <>
                <h2 className="section-title">❌ Rejected ({rejected.length})</h2>
                <div className="table-wrapper">{renderTable(rejected, false)}</div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default DoctorVerification;