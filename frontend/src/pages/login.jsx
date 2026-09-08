import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Firebase import

const LoginScreen = ({ onLogin, navigateTo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Patient');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email format is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        // Firebase Sign In
        await signInWithEmailAndPassword(auth, email, password);
        alert('Login successful!');
        onLogin(role); // App.js routing
      } catch (error) {
        alert('Login failed: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; }
        .login-wrapper { 
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

        .login-card { 
          background: #f9fafb; 
          width: 100%; 
          max-width: 350px; 
          padding: 30px; 
          border-radius: 15px; 
          box-shadow: 0 10px 25px rgba(0,0,0,0.15); 
          border: 1px solid #e2e8f0;
        }
        .branding { text-align: center; margin-bottom: 25px; }
        .branding h1 { color: #333; font-size: 28px; font-weight: 800; margin-bottom: 5px; }
        .branding p { color: #777; font-size: 13px; font-weight: 500; }
        
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; text-align: left; font-weight: 600; font-size: 13px; color: #555; margin-bottom: 6px; }
        .form-group input, .form-group select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; background-color: #fff; transition: all 0.3s ease; }
        .form-group input:focus, .form-group select:focus { border-color: #667eea; background-color: #fff; outline: none; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15); }
        .error { color: #ef4444; font-size: 11px; margin-top: 3px; display: block; }
        
        .form-footer { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; font-size: 13px; }
        .remember-me { display: flex; align-items: center; gap: 5px; color: #666; cursor: pointer; }
        .forgot-password { color: #667eea; text-decoration: none; font-weight: 600; }
        
        .login-btn { width: 100%; padding: 12px; background: linear-gradient(90deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3); }
        .login-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4); }
        .login-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        
        .auth-link { text-align: center; margin-top: 15px; font-size: 13px; color: #555; }
        .auth-link a { color: #667eea; text-decoration: none; font-weight: 700; cursor: pointer; }
        .auth-link a:hover { text-decoration: underline; }
      `}</style>

      <div className="login-wrapper">
        <button className="back-home-btn" onClick={() => navigateTo('home')}>← Back to Home</button>
        <div className="login-card">
          <div className="branding">
            <h1>Afshan HMS</h1>
            <p>Hospital Management System</p>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="doctor@hospital.com" />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label>Login As</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option>Patient</option>
                <option>Admin</option>
                <option>Doctor</option>
                <option>Nurse</option>
                <option>Receptionist</option>
              </select>
            </div>
            <div className="form-footer">
              <label className="remember-me"><input type="checkbox" /> Remember me</label>
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="auth-link">
            Don't have an account? <a onClick={() => navigateTo('register')}>Sign Up</a>
          </div>
        </div>
      </div>
    </>
  );
};
export default LoginScreen;