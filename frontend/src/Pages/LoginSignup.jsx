import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faEye, faEyeSlash, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import './LoginSignup.css';

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username:"",
    password:"",
    email:"",
  })
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (state === "Sign Up" && !formData.username) {
      errors.username = 'Name is required';
    } else if (state === "Sign Up" && formData.username.length < 2) {
      errors.username = 'Name must be at least 2 characters';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const changeHandler =(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value});
    // Clear field error when user starts typing
    if (fieldErrors[e.target.name]) {
      setFieldErrors({...fieldErrors, [e.target.name]: ''});
    }
  }

  const login = async ()=>{
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    console.log("Login Function Executed",formData);
    try {
      const response = await fetch('http://localhost:8081/api/auth/login',{
        method:"POST",
        headers:{
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(formData),
      });
      
      const responseData = await response.json();
      console.log("Login response:", responseData);
      
      if(responseData.success){
        localStorage.setItem('auth-token',responseData.token);
        window.location.replace("/");
      } else {
        setError(responseData.errors || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please check if the backend server is running on localhost:8081");
    } finally {
      setLoading(false);
    }
  }




  const signup = async ()=>{
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    console.log("Sign Up Function Executed",formData);
    try {
      const response = await fetch('http://localhost:8081/api/auth/signup',{
        method:"POST",
        headers:{
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(formData),
      });
      
      const responseData = await response.json();
      console.log("Signup response:", responseData);
      
      if(responseData.success){
        localStorage.setItem('auth-token',responseData.token);
        window.location.replace("/");
      } else {
        setError(responseData.errors || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Network error. Please check if the backend server is running on localhost:8081");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='login-signup-container'>
      <div className="login-background"></div>
      <div className="login-content">
        <div className="login-form-container">
          <div className="login-header">
            <div className="login-icon">
              <FontAwesomeIcon icon={faShoppingCart} />
            </div>
            <h1>{state}</h1>
            <p>{state === "Login" ? "Welcome back to AgroGorcery": "Join  AgroGorcery today"}</p>
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="login-form">
            {state==="Sign Up" && (
              <div className="form-group">
                <label htmlFor="username">
                  <FontAwesomeIcon icon={faUser} className="field-icon" />
                  Your Name
                </label>
                <input 
                  name='username' 
                  value={formData.username} 
                  onChange={changeHandler} 
                  className={`form-input ${fieldErrors.username ? 'error' : ''}`}
                  type="text" 
                  placeholder='Enter your name'
                  aria-describedby="username-error"
                />
                {fieldErrors.username && (
                  <span id="username-error" className="field-error">
                    {fieldErrors.username}
                  </span>
                )}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email">
                <FontAwesomeIcon icon={faEnvelope} className="field-icon" />
                Email Address
              </label>
              <input 
                name='email' 
                value={formData.email} 
                onChange={changeHandler} 
                className={`form-input ${fieldErrors.email ? 'error' : ''}`}
                type="email" 
                placeholder='Enter your email'
                aria-describedby="email-error"
              />
              {fieldErrors.email && (
                <span id="email-error" className="field-error">
                  {fieldErrors.email}
                </span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">
                <FontAwesomeIcon icon={faLock} className="field-icon" />
                Password
              </label>
              <div className="password-input-wrapper">
                <input 
                  name='password' 
                  value={formData.password} 
                  onChange={changeHandler} 
                  className={`form-input ${fieldErrors.password ? 'error' : ''}`}
                  type={showPassword ? 'text' : 'password'} 
                  placeholder='Enter your password'
                  aria-describedby="password-error"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                </button>
              </div>
              {fieldErrors.password && (
                <span id="password-error" className="field-error">
                  {fieldErrors.password}
                </span>
              )}
            </div>
          </div>
          
          <button 
            onClick={()=>{state==="Login"?login():signup()}} 
            className="login-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                {state === "Login" ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              <>
                {state === "Login" ? <FontAwesomeIcon icon={faLock} className="btn-icon" /> : <FontAwesomeIcon icon={faUser} className="btn-icon" />}
                Continue
              </>
            )}
          </button>
          
          <div className="login-footer">
            {state==="Sign Up" ? (
              <p>Already have an account? <span onClick={()=>{setState("Login")}} className="toggle-link">Login Here</span></p>
            ) : (
              <p>Create an Account? <span onClick={()=>{setState("Sign Up")}} className="toggle-link">Click Here</span></p>
            )}
          </div>
          
          <div className="terms-section">
            <label className="checkbox-label">
              <input type="checkbox" className="terms-checkbox" />
              <span>By continuing, I agree to the terms of use & privacy policy</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup
