import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess, loginFailure, setLoading } from '../toolkit/authSlice';
import { authAPI } from '../services/api';

export default function RegisterNew() {
  const [step, setStep] = useState(1); 
  const [userType, setUserType] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const handleUserTypeSelect = type => {
    setUserType(type);
    setStep(2);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async e => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    dispatch(setLoading(true));

    try {
      const response = await authAPI.register(
        formData.email,
        formData.password,
        formData.name,
        userType,
        userType === 'employer' ? formData.companyName : null
      );

      dispatch(loginSuccess(response));
      navigate('/');
    } catch (err) {
      dispatch(loginFailure(err.message));
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px' }}>
      {step === 1 ? (
        // Step 1: User Type Selection
        <div>
          <h1>Welcome to Job Portal</h1>
          <p>What are you here for?</p>

          <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
            {/* Job Seeker */}
            <div
              onClick={() => handleUserTypeSelect('job_seeker')}
              style={{
                flex: 1,
                padding: '30px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#007bff')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#ddd')}
            >
              <h2>Looking for a Job?</h2>
              <p>Browse and apply to amazing job opportunities</p>
              <button
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Continue as Job Seeker
              </button>
            </div>

            {/* Employer */}
            <div
              onClick={() => handleUserTypeSelect('employer')}
              style={{
                flex: 1,
                padding: '30px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#28a745')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#ddd')}
            >
              <h2>Posting a Job?</h2>
              <p>Find and hire talented professionals</p>
              <button
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Continue as Employer
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Step 2: Registration Form
        <form onSubmit={handleRegister}>
          <h1>Register as {userType === 'job_seeker' ? 'Job Seeker' : 'Employer'}</h1>

          <div style={{ marginBottom: '15px' }}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          {userType === 'employer' && (
            <div style={{ marginBottom: '15px' }}>
              <label>Company Name:</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setUserType(null);
              }}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Already have an account? <a href="/login">Login here</a>
        </p>
      )}
    </div>
  );
}
