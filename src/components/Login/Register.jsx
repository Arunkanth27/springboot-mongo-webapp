import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../components/Global.css';
import logo from '../../images/download.jpg';
import backgroundImage from '../../images/background_pictures.jpg';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const showSuccessAlert = () => {
    Swal.fire({
      title: 'Success!',
      text: 'Registration successful!',
      icon: 'success',
      confirmButtonText: 'Continue to Login',
      timer: 3000,
      timerProgressBar: true,
      willClose: () => {
        navigate('/login');
      }
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'Try Again'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Password matching check
    if (formData.password !== formData.confirmPassword) {
      showErrorAlert('Passwords do not match!');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      if (response.status === 201) {
        showSuccessAlert();
      }
    } catch (err) {
      console.error('Registration error:', err.response?.data);
      
      // Handle different error cases
      if (err.response?.status === 409) {
        showErrorAlert(err.response.data?.message || 'User already exists!');
      } else if (err.response?.status === 400) {
        const errorMsg = typeof err.response.data === 'object' 
          ? Object.values(err.response.data).join('\n')
          : 'Invalid registration data';
        showErrorAlert(errorMsg);
      } else {
        showErrorAlert('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="company-logo">
          <img src={logo} alt="Company Logo" />
        </div>
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
            minLength="3"
          />
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button 
            type="submit" 
            className="register-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status"></span>
                <span className="ms-2">Registering...</span>
              </>
            ) : 'SIGN UP'}
          </button>
        </form>
        <div className="register-links">
          <span>Already have an account? <a href="/login">LOGIN</a></span>
        </div>
      </div>
      <div className="register-image">
        <img src={backgroundImage} alt="Background Design" />
      </div>
    </div>
  );
};

export default Register;