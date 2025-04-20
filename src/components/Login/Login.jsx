import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Swal from 'sweetalert2';
import '../../components/Global.css';
import logo from '../../images/download.jpg';
import backgroundImage from '../../images/background_pictures.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!email || !password) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter both email and password',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const success = await login(email, password);
      
      if (success) {
        // Get the stored user data
        const userData = JSON.parse(localStorage.getItem('user'));
        
        Swal.fire({
          title: 'Success!',
          text: `Welcome back, ${userData.name || userData.email}!`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          // Navigate to home page after successful login
          navigate('/');
        });
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="login-container">
      <div className="login-box">
        <div className="company-logo">
          <img src={logo} alt="Company Logo" />
        </div>
        <h2>Welcome Back!</h2>
        <p>Log Into Your Account</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Enter email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="login-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span> LOGGING IN...
              </>
            ) : 'LOGIN'}
          </button>
        </form>

        <div className="login-links">
          <a href="/forgot-password">FORGOT YOUR PASSWORD?</a>
          <span>Don't Have An Account? <a href="/register">SIGN UP</a></span>
        </div>

        <div className="university-signup">
          <a href="/register-university">Sign Up with University</a>
        </div>
      </div>
      
      <div className="login-image">
        <img src={backgroundImage} alt="Background" />
      </div>
    </div>
  );
};

export default Login;