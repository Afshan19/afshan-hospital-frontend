import React, { useState, useEffect } from 'react';

// Basic Screens
import HomeScreen from './pages/Home';
import LoginScreen from './pages/login';
import RegisterScreen from './pages/Register';

// Patient Module
import PatientDashboard from './pages/patient/PatientDashboard';
import MyProfile from './pages/patient/MyProfile';
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';
import MedicalRecords from './pages/patient/MedicalRecords';
import Prescriptions from './pages/patient/Prescriptions';
import LabReports from './pages/patient/LabReports';
import MyInvoices from './pages/patient/MyInvoices';
import Notifications from './pages/patient/Notifications';

// Nurse Module
import NurseDashboard from './pages/nurse/NurseDashboard';
import TodaysQueue from './pages/nurse/TodaysQueue';
import PatientCheckIn from './pages/nurse/PatientCheckIn';
import PatientInformation from './pages/nurse/PatientInformation';
import QueueManagement from './pages/nurse/QueueManagement';

// Admin Module
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageDoctors from './pages/admin/ManageDoctors';
import ManagePatients from './pages/admin/ManagePatients';
import ManageSpecialties from './pages/admin/ManageSpecialties';
import AdminAppointments from './pages/admin/Appointments';
import ReportsAnalytics from './pages/admin/ReportsAnalytics';
// Note: AdminBilling and AuditLogs are removed (if you need them, uncomment and create files)

// Doctor Module
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorMyAppointments from './pages/doctor/MyAppointments';
import DoctorTodaysQueue from './pages/doctor/TodaysQueue';
import DoctorPatients from './pages/doctor/Patients';
import DoctorMedicalRecords from './pages/doctor/PatientMedicalRecords';
import DoctorPrescriptions from './pages/doctor/Prescriptions';
import DoctorMyAvailability from './pages/doctor/MyAvailability';
// import DoctorMyAvailability from './pages/doctor/MyAvailability'; // COMMENTED

// Receptionist Module
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';
import ReceptionistRegisterPatient from './pages/receptionist/RegisterPatient';
import ReceptionistPatients from './pages/receptionist/Patients';
import ReceptionistBookAppointment from './pages/receptionist/BookAppointment';
import ReceptionistAppointments from './pages/receptionist/Appointments';
import ReceptionistCheckIn from './pages/receptionist/CheckIn';
import ReceptionistBilling from './pages/receptionist/Billing';

function App() {
  const [page, setPage] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [page]);

  const handleLogin = (role) => {
    localStorage.setItem('token', 'logged_in_token');
    setIsLoggedIn(true);
    if (role === 'Patient') setPage('patient-overview');
    else if (role === 'Nurse') setPage('nurse-overview');
    else if (role === 'Doctor') setPage('doctor-overview');
    else if (role === 'Admin') setPage('admin-overview');
    else if (role === 'Receptionist') setPage('receptionist-overview');
    else setPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setPage('home');
  };

  const navigateTo = (screen) => setPage(screen);

  if (isLoading) {
    return (
      <>
        <style>{`
          .loader-container { display: flex; justify-content: center; align-items: center; height: 100vh; background: #f4f6f9; }
          .spinner { border: 6px solid #e2e8f0; border-top: 6px solid #667eea; border-radius: 50%; width: 50px; height: 50px; animation: spin 0.8s linear infinite; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
        <div className="loader-container"><div className="spinner"></div></div>
      </>
    );
  }

  // Routing
  if (page === 'home') return <HomeScreen navigateTo={navigateTo} />;
  if (page === 'login') return <LoginScreen onLogin={handleLogin} navigateTo={navigateTo} />;
  if (page === 'register') return <RegisterScreen navigateTo={navigateTo} />;

  // Patient
  if (page === 'patient-overview') return <PatientDashboard onLogout={handleLogout} navigateTo={navigateTo} userName={localStorage.getItem('userName') || 'Patient'} />;
  if (page === 'patient-profile') return <MyProfile navigateTo={navigateTo} />;
  if (page === 'patient-book') return <BookAppointment navigateTo={navigateTo} />;
  if (page === 'patient-appointments') return <MyAppointments navigateTo={navigateTo} />;
  if (page === 'patient-records') return <MedicalRecords navigateTo={navigateTo} />;
  if (page === 'patient-prescriptions') return <Prescriptions navigateTo={navigateTo} />;
  if (page === 'patient-labs') return <LabReports navigateTo={navigateTo} />;
  if (page === 'patient-invoices') return <MyInvoices navigateTo={navigateTo} />;
  if (page === 'patient-notifications') return <Notifications navigateTo={navigateTo} />;

  // Nurse
  if (page === 'nurse-overview') return <NurseDashboard onLogout={handleLogout} navigateTo={navigateTo} />;
  if (page === 'nurse-queue') return <TodaysQueue navigateTo={navigateTo} />;
  if (page === 'nurse-checkin') return <PatientCheckIn navigateTo={navigateTo} />;
  if (page === 'nurse-info') return <PatientInformation navigateTo={navigateTo} />;

  // Admin
  if (page === 'admin-overview') return <AdminDashboard onLogout={handleLogout} navigateTo={navigateTo} />;
  if (page === 'admin-users') return <ManageUsers navigateTo={navigateTo} />;
  if (page === 'admin-doctors') return <ManageDoctors navigateTo={navigateTo} />;
  if (page === 'admin-patients') return <ManagePatients navigateTo={navigateTo} />;
  if (page === 'admin-specialties') return <ManageSpecialties navigateTo={navigateTo} />;
  if (page === 'admin-appointments') return <AdminAppointments navigateTo={navigateTo} />;
  if (page === 'admin-reports') return <ReportsAnalytics navigateTo={navigateTo} />;

  // Doctor
  if (page === 'doctor-overview') return <DoctorDashboard onLogout={handleLogout} navigateTo={navigateTo} />;
  if (page === 'doctor-appointments') return <DoctorMyAppointments navigateTo={navigateTo} />;
  if (page === 'doctor-patients') return <DoctorPatients navigateTo={navigateTo} />;
  if (page === 'doctor-prescriptions') return <DoctorPrescriptions navigateTo={navigateTo} />;
  if (page === 'doctor-availability') return <DoctorMyAvailability navigateTo={navigateTo} />;

  // Receptionist
  if (page === 'receptionist-overview') return <ReceptionistDashboard onLogout={handleLogout} navigateTo={navigateTo} />;
  if (page === 'receptionist-register') return <ReceptionistRegisterPatient navigateTo={navigateTo} />;
  if (page === 'receptionist-patients') return <ReceptionistPatients navigateTo={navigateTo} />;
  if (page === 'receptionist-book') return <ReceptionistBookAppointment navigateTo={navigateTo} />;
  if (page === 'receptionist-appointments') return <ReceptionistAppointments navigateTo={navigateTo} />;
  if (page === 'receptionist-checkin') return <ReceptionistCheckIn navigateTo={navigateTo} />;
  if (page === 'receptionist-billing') return <ReceptionistBilling navigateTo={navigateTo} />;

  return <div>404 Not Found</div>;
}

export default App;