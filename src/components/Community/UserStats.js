import React, { useState, useEffect } from 'react';
import { useAuth } from '../Login/AuthContext';
import axios from 'axios';
import { FaUserFriends, FaThumbsUp, FaSync } from 'react-icons/fa';
import './UserStats.css';

const UserStats = () => {
  const { user: authUser } = useAuth();
  const [userStats, setUserStats] = useState({
    points: 0,
    followers: 0,
    following: 0,
    loading: true
  });

  const fetchUserStats = async () => {
    if (!authUser?.email) return;
    
    try {
      setUserStats(prev => ({ ...prev, loading: true }));
      const response = await axios.get(`http://localhost:8080/api/auth/${authUser.email}`);
      
      setUserStats({
        points: response.data.points || 0,
        followers: response.data.followers || 0,
        following: response.data.following || 0,
        loading: false
      });
      
      // Store in localStorage for offline access
      localStorage.setItem('userStats', JSON.stringify({
        points: response.data.points,
        followers: response.data.followers,
        following: response.data.following
      }));
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Fallback to localStorage if API fails
      const localStats = localStorage.getItem('userStats');
      if (localStats) {
        setUserStats({
          ...JSON.parse(localStats),
          loading: false
        });
      } else {
        setUserStats(prev => ({ ...prev, loading: false }));
      }
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, [authUser?.email]);

  const getBadgeLevel = (points) => {
    points = points || 0;
    if (points <= 1000) return "Bronze";
    else if (points <= 5000) return "Silver";
    else if (points <= 15000) return "Gold";
    else return "Platinum";
  };

  if (userStats.loading) {
    return <div className="stats-loading">Loading stats...</div>;
  }

  return (
    <div className="user-stats-container">
      <h2>Your Community Stats</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <FaThumbsUp className="stat-icon" />
          <div className="stat-content">
            <span className="stat-value">{userStats.points}</span>
            <span className="stat-label">Points</span>
            <span className={`badge ${getBadgeLevel(userStats.points).toLowerCase()}`}>
              {getBadgeLevel(userStats.points)} Badge
            </span>
          </div>
        </div>
        
        <div className="stat-card">
          <FaUserFriends className="stat-icon" />
          <div className="stat-content">
            <span className="stat-value">{userStats.followers}</span>
            <span className="stat-label">Followers</span>
          </div>
        </div>
        
        <div className="stat-card">
          <FaUserFriends className="stat-icon" />
          <div className="stat-content">
            <span className="stat-value">{userStats.following}</span>
            <span className="stat-label">Following</span>
          </div>
        </div>
      </div>
      
      <button onClick={fetchUserStats} className="refresh-stats-btn">
        <FaSync /> Refresh Stats
      </button>
    </div>
  );
};

export default UserStats;