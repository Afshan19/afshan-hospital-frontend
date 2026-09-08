import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Firebase import

const RegisterScreen = ({ navigateTo }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'Patient'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let errs = {};
    if (!formData.name) errs.name = "Full Name is required";
    if (!formData.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Email format is invalid";
    if (!formData.phone) errs.phone = "Phone number is required";
    else if (!/^\d{11}$/.test(formData.phone)) errs.phone = "Phone must be 11 digits";
    if (!formData.password) errs.password = "Password is required";
    else if (formData.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword) errs.confirmPassword = "Confirm Password is required";
    else if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setLoading(true);
      try {
        // 1. Firebase Auth mein User Create Karein
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        // 2. Firestore Database mein User ka Data Save Karein
        await addDoc(collection(db, 'patients'), {
          uid: user.uid,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          createdAt: new Date()
        });

        // 3. Naam localStorage mein save karein (Dashboard par show karne ke liye)
        localStorage.setItem('userName', formData.name);

        alert('Registration successful! Please login now.');
        navigateTo('login');
      } catch (error) {
        alert('Registration failed: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; }
        .register-wrapper { 
          min-height: 100vh; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          background: url('https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1000&q=80') no-repeat center center fixed; 
          background-size: cover; 
          padding: 20px;
          position: relative;
        }
        .back-home-btn { position: fixed; top: 20px; left: 20px; background: rgba(255, 255, 255, 0.9); color: #333; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 14px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); transition: 0.3s; z-index: 100; }
        .back-home-btn:hover { background: #fff; color: #667eea; transform: translateX(-3px); }

        .register-card { 
          background: #f9fafb; 
          width: 100%; 
          max-width: 380px; 
          padding: 25px; 
          border-radius: 15px; 
          box-shadow: 0 10px 25px rgba(0,0,0,0.15); 
          border: 1px solid #e2e8f0;
        }
        .branding { text-align: center; margin-bottom: 20px; }
        .branding h1 { color: #333; font-size: 26px; font-weight: 800; margin-bottom: 5px; }
        .branding p { color: #777; font-size: 13px; font-weight: 500; }
        
        .form-group { margin-bottom: 12px; }
        .form-group label { display: block; text-align: left; font-weight: 600; font-size: 13px; color: #555; margin-bottom: 5px; }
        .form-group input, .form-group select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; background-color: #fff; transition: all 0.3s ease; }
        .form-group input:focus, .form-group select:focus { border-color: #667eea; background-color: #fff; outline: none; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15); }
        .error { color: #ef4444; font-size: 11px; margin-top: 3px; display: block; }
        
        .register-btn { width: 100%; padding: 12px; background: linear-gradient(90deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3); margin-top: 5px; }
        .register-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4); }
        .register-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        
        .auth-link { text-align: center; margin-top: 15px; font-size: 13px; color: #555; }
        .auth-link a { color: #667eea; text-decoration: none; font-weight: 700; cursor: pointer; }
        .auth-link a:hover { text-decoration: underline; }
      `}</style>

      <div className="register-wrapper">
        <button className="back-home-btn" onClick={() => navigateTo('home')}>← Back to Home</button>
        <div className="register-card">
          <div className="branding">
            <h1>Register</h1>
            <p>Create your Afshan HMS account</p>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="example@hospital.com" />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="03001234567" />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>
            <div className="form-group">
              <label>Role</label>
              <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                <option>Patient</option>
                <option>Admin</option>
                <option>Doctor</option>
                <option>Nurse</option>
                <option>Receptionist</option>
              </select>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="********" />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} placeholder="********" />
              {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
            </div>
            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <div className="auth-link">
            Already have an account? <a onClick={() => navigateTo('login')}>Sign In</a>
          </div>
        </div>
      </div>
    </>
  );
};
export default RegisterScreen;