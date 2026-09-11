import React, { useState, useEffect } from 'react';
import DashboardLayout from './components/DashboardLayout';

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

// Admin Module
import DoctorVerification from './pages/admin/DoctorVerification';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageDoctors from './pages/admin/ManageDoctors';
import ManagePatients from './pages/admin/ManagePatients';
import ManageSpecialties from './pages/admin/ManageSpecialties';
import AdminAppointments from './pages/admin/Appointments';
import ReportsAnalytics from './pages/admin/ReportsAnalytics';

// Doctor Module
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorMyAppointments from './pages/doctor/MyAppointments';
import DoctorTodaysQueue from './pages/doctor/TodaysQueue';
import DoctorPatients from './pages/doctor/Patients';
import DoctorMedicalRecords from './pages/doctor/PatientMedicalRecords';
import DoctorPrescriptions from './pages/doctor/Prescriptions';
import DoctorMyAvailability from './pages/doctor/MyAvailability';

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

  const renderDashboard = (role, activeRoute, Component, extraProps = {}) => {
    return (
      <DashboardLayout role={role} activeRoute={activeRoute} navigateTo={navigateTo} onLogout={handleLogout}>
        <Component navigateTo={navigateTo} {...extraProps} />
      </DashboardLayout>
    );
  };

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
  if (page === 'patient-overview') return renderDashboard('Patient', page, PatientDashboard, { userName: localStorage.getItem('userName') || 'Patient' });
  if (page === 'patient-profile') return renderDashboard('Patient', page, MyProfile);
  if (page === 'patient-book') return renderDashboard('Patient', page, BookAppointment);
  if (page === 'patient-appointments') return renderDashboard('Patient', page, MyAppointments);
  if (page === 'patient-records') return renderDashboard('Patient', page, MedicalRecords);
  if (page === 'patient-prescriptions') return renderDashboard('Patient', page, Prescriptions);
  if (page === 'patient-labs') return renderDashboard('Patient', page, LabReports);
  if (page === 'patient-invoices') return renderDashboard('Patient', page, MyInvoices);
  if (page === 'patient-notifications') return renderDashboard('Patient', page, Notifications);

  // Nurse
  if (page === 'nurse-overview') return renderDashboard('Nurse', page, NurseDashboard);
  if (page === 'nurse-queue') return renderDashboard('Nurse', page, TodaysQueue);
  if (page === 'nurse-checkin') return renderDashboard('Nurse', page, PatientCheckIn);
  if (page === 'nurse-info') return renderDashboard('Nurse', page, PatientInformation);

  // Admin
  if (page === 'admin-verify-doctors') return renderDashboard('Admin', page, DoctorVerification);
  if (page === 'admin-overview') return renderDashboard('Admin', page, AdminDashboard);
  if (page === 'admin-users') return renderDashboard('Admin', page, ManageUsers);
  if (page === 'admin-doctors') return renderDashboard('Admin', page, ManageDoctors);
  if (page === 'admin-patients') return renderDashboard('Admin', page, ManagePatients);
  if (page === 'admin-specialties') return renderDashboard('Admin', page, ManageSpecialties);
  if (page === 'admin-appointments') return renderDashboard('Admin', page, AdminAppointments);
  if (page === 'admin-reports') return renderDashboard('Admin', page, ReportsAnalytics);

  // Doctor
  if (page === 'doctor-overview') return renderDashboard('Doctor', page, DoctorDashboard);
  if (page === 'doctor-appointments') return renderDashboard('Doctor', page, DoctorMyAppointments);
  if (page === 'doctor-queue') return renderDashboard('Doctor', page, DoctorTodaysQueue);
  if (page === 'doctor-patients') return renderDashboard('Doctor', page, DoctorPatients);
  if (page === 'doctor-medical-records') return renderDashboard('Doctor', page, DoctorMedicalRecords);
  if (page === 'doctor-prescriptions') return renderDashboard('Doctor', page, DoctorPrescriptions);
  if (page === 'doctor-availability') return renderDashboard('Doctor', page, DoctorMyAvailability);

  // Receptionist
  if (page === 'receptionist-overview') return renderDashboard('Receptionist', page, ReceptionistDashboard);
  if (page === 'receptionist-register') return renderDashboard('Receptionist', page, ReceptionistRegisterPatient);
  if (page === 'receptionist-patients') return renderDashboard('Receptionist', page, ReceptionistPatients);
  if (page === 'receptionist-book') return renderDashboard('Receptionist', page, ReceptionistBookAppointment);
  if (page === 'receptionist-appointments') return renderDashboard('Receptionist', page, ReceptionistAppointments);
  if (page === 'receptionist-checkin') return renderDashboard('Receptionist', page, ReceptionistCheckIn);
  if (page === 'receptionist-billing') return renderDashboard('Receptionist', page, ReceptionistBilling);

return <div style={{padding: '50px', fontSize: '20px', color: 'red'}}>404 - Current page state is: <strong>{page}</strong></div>;}

export default App;