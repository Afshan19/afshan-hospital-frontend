import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const PatientDashboard = ({ navigateTo, userName }) => {
  const [displayName, setDisplayName] = useState(userName || 'Patient');
  
const [isLoadingUser, setIsLoadingUser] = useState(true);
  useEffect(() => {
    const fetchUserName = async () => {
      if (auth.currentUser) {
        try {
          const q = query(collection(db, 'patients'), where('uid', '==', auth.currentUser.uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
            setDisplayName(data.name || 'Patient');
          }
        } catch (error) {
          console.error('Error fetching name:', error);
        }
      }
      setIsLoadingUser(false);
    };
    fetchUserName();
  }, []);

  return (
    <>
      <style>{`
        .content-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .back-home-btn { background: transparent; border: 2px solid #667eea; color: #667eea; padding: 8px 15px; border-radius: 8px; font-weight: 700; cursor: pointer; }
        .back-home-btn:hover { background: #667eea; color: white; }
        .welcome-banner { background: linear-gradient(135deg, #36D1DC 0%, #5B86E5 100%); border-radius: 15px; padding: 30px 40px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; color: white; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .welcome-text h1 { font-size: 32px; font-weight: 800; margin-bottom: 5px; }
        .welcome-text p { font-size: 16px; opacity: 0.9; }
        .hero-img { width: 200px; }
        .hero-img img { width: 100%; height: auto; max-height: 150px; object-fit: contain; filter: drop-shadow(5px 5px 10px rgba(0,0,0,0.2)); }
        .dashboard-clean-area { background: white; border-radius: 12px; padding: 40px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border: 2px dashed #cbd5e1; }
        @media (max-width: 900px) { .welcome-banner { flex-direction: column; text-align: center; gap: 20px; } }
      `}</style>
      <div className="content-header">
        <h1 style={{color: '#1e293b'}}>Patient Dashboard</h1>
        <button className="back-home-btn" onClick={() => navigateTo('home')}>← Back to Home</button>
      </div>
      <div className="welcome-banner">
        <div className="welcome-text">
          <h1>Welcome Back, {displayName}!</h1>
          <p>Your health is our priority.</p>
        </div>
        <div className="hero-img">
           <img src="https://img.freepik.com/free-vector/doctors-concept-illustration_114360-1515.jpg?w=740&t=st=1690000000~exp=1690000600~hmac=xyz" alt="Doctors" />
        </div>
      </div>
      <div className="dashboard-clean-area">
        <h3>Welcome to your Patient Portal</h3>
        <p>Select an option from the sidebar to manage your health records.</p>
      </div>
    </>
  );
};
export default PatientDashboard;