import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserFriends, FaThumbsUp, FaPlus } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:8080';

const OverallRankers = () => {
  const { name } = useParams();
  const navigate = useNavigate();

  // Get user data from local storage
  const [userData, setUserData] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.error("Error parsing user data:", err);
      return null;
    }
  });

  const loggedInUserEmail = userData?.email || userData?.userEmail;
  const [userStats, setUserStats] = useState({
    points: userData?.points || 0,
    followers: userData?.followers || 0,
    following: userData?.following || 0
  });

  // State for icon colors and animations
  const [iconStates, setIconStates] = useState({
    followers: {
      clicked: false,
      color: '#606060', // Default gray color
      transform: 'scale(1)'
    },
    following: {
      clicked: false,
      color: '#606060',
      transform: 'scale(1)'
    },
    points: {
      clicked: false,
      color: '#606060',
      transform: 'scale(1)'
    }
  });

  // Handle metric click with animation
  const handleMetricClick = (metricType) => {
    // Set clicked state with YouTube blue color and initial scale
    setIconStates(prev => ({
      ...prev,
      [metricType]: {
        ...prev[metricType],
        clicked: true,
        color: '#065fd4', // YouTube blue
        transform: 'scale(1.2)'
      }
    }));

    // Execute the appropriate action
    if (metricType === 'followers') incrementFollowers();
    else if (metricType === 'following') incrementFollowing("target@example.com");
    else if (metricType === 'points') incrementPoints();

    // Reset animation after 300ms
    setTimeout(() => {
      setIconStates(prev => ({
        ...prev,
        [metricType]: {
          ...prev[metricType],
          transform: 'scale(1)',
          color: '#606060' // Reset color after the animation
        }
      }));
    }, 300);
  };

  // Increment followers
  const incrementFollowers = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/by-email/increment-followers`,
        null,
        { params: { email: loggedInUserEmail } }
      );
      
      const updatedStats = { ...userStats, followers: res.data.followers };
      setUserStats(updatedStats);
      
      const updatedUser = { ...userData, followers: res.data.followers };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUserData(updatedUser);
    } catch (err) {
      console.error("Error incrementing followers:", err);
    }
  };

  // Increment following
  const incrementFollowing = async (targetUserEmail) => {
    if (!targetUserEmail || !loggedInUserEmail) return;
    
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/by-email/increment-following`,
        null,
        { params: { 
          currentUserEmail: loggedInUserEmail,
          targetUserEmail: targetUserEmail 
        } }
      );
      
      const updatedStats = { ...userStats, following: res.data.following };
      setUserStats(updatedStats);
      
      const updatedUser = { ...userData, following: res.data.following };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUserData(updatedUser);
    } catch (err) {
      console.error("Error incrementing following:", err);
    }
  };

  // Points increment function (if needed)
  const incrementPoints = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/by-email/increment-points`,
        null,
        { params: { email: loggedInUserEmail } }
      );
      
      const updatedStats = { ...userStats, points: res.data.points };
      setUserStats(updatedStats);
      
      const updatedUser = { ...userData, points: res.data.points };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUserData(updatedUser);
    } catch (err) {
      console.error("Error incrementing points:", err);
    }
  };

  return (
    <div className="overall-rankers-container" style={{ 
      display: 'flex', 
      minHeight: '100vh',
      width: '100px',
      position: 'fixed',
      left: 0,
      top: 0
    }}>
      {/* Left Sidebar - User Profile */}
      <div className="user-card" style={{ 
        width: '200px', 
        backgroundColor: '#f1f1f1', 
        padding: '20px', 
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
        position: 'fixed',
        left: 0,
        top: 20,
        bottom: 0,
        
        // overflowY: 'auto'
      }}>
        <div className="user-card1">
          <div className="user-header" style={{ textAlign: 'center' }}>
            <img
              src={userData?.profilePic || `https://ui-avatars.com/api/?name=${userData?.name}&background=random`}
              alt="User profile"
              className="user-avatar"
              style={{ width: '100px', height: '100px', borderRadius: '50%', marginTop: '70px' }}
            />
            <h3>{userData?.name}</h3>
            <p className="user-email">{loggedInUserEmail}</p>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#fff',
            borderRadius: '12px'
          }}>
            {/* Followers Metric */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => handleMetricClick('followers')}
            >
              <FaUserFriends 
                style={{
                  color: iconStates.followers.color,
                  transform: iconStates.followers.transform,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>
                Followers: {userStats.followers}
              </span>
            </div>

            {/* Following Metric */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => handleMetricClick('following')}
            >
              <FaUserFriends 
                style={{
                  color: iconStates.following.color,
                  transform: iconStates.following.transform,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>
                Following: {userStats.following}
              </span>
            </div>

            {/* Points Metric */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => handleMetricClick('points')}
            >
              <FaThumbsUp 
                style={{
                  color: iconStates.points.color,
                  transform: iconStates.points.transform,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>
                Points: {userStats.points}
              </span>
            </div>
          </div>

          <button 
            className="btn-create-post" 
            onClick={() => navigate('/create-post')} 
            style={{
              marginTop: '20px',
              backgroundColor: '#065fd4',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              justifyContent: 'center'
            }}
          >
            <FaPlus /> Create Post
          </button>
        </div>
      </div>

      {/* Main Content Area - shifted to the right of sidebar */}
      <div className="main-content" style={{ 
        flex: 1, 
        padding: '20px',
        marginLeft: '300px', // Same as sidebar width
        width: 'calc(100% - 300px)',
        overflowY: 'auto',
        height: '100vh'
      }}>
       
      </div>
    </div>
  );
};

export default OverallRankers;