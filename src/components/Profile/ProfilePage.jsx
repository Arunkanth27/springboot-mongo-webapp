import React, { useState, useEffect } from 'react';
import '../../components/Global.css';
import '../../components/ProfilePage.css';
import avatar from '../../images/OIP.jpg';
import badgeIcon from '../../images/OIP.jpg';
import { FaPen } from 'react-icons/fa';
import { useAuth } from '../Login/AuthContext';
import axios from 'axios';

const ProfilePage = () => {
  const { user: authUser, loading: authLoading } = useAuth();
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    name: '',
    bio: '',
    followers: 0,
    following: 0,
    attractions: 0,
    points: 0,
    _class: ''
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [isEditing, setIsEditing] = useState({
    username: false,
    email: false,
    name: false,
    bio: false
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!authUser?.email) {
        setProfileLoading(false);
        return;
      }

      try {
        setProfileLoading(true);
        const response = await axios.get(`http://localhost:8080/api/auth/${authUser.email}`);
        
        setProfileData({
          username: response.data.username || '',
          email: response.data.email || '',
          name: response.data.name || '',
          bio: response.data.bio || '',
          followers: response.data.followers || 0,
          following: response.data.following || 0,
          attractions: response.data.attractions || 0,
          points: response.data.points || 0,
          _class: response.data._class || ''
        });
        
        // Update sessionStorage with fresh data
        sessionStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        console.error("Profile fetch error:", error);
        // If API fails, try to get from sessionStorage
        const sessionUser = sessionStorage.getItem('user');
        if (sessionUser) {
          const parsedUser = JSON.parse(sessionUser);
          setProfileData({
            username: parsedUser.username || '',
            email: parsedUser.email || '',
            name: parsedUser.name || '',
            bio: parsedUser.bio || '',
            followers: parsedUser.followers || 0,
            following: parsedUser.following || 0,
            attractions: parsedUser.attractions || 0,
            points: parsedUser.points || 0,
            _class: parsedUser._class || ''
          });
        }
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfileData();
  }, [authUser?.email]);

  const handleEditClick = (field) => {
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
  };

  const handleSave = async (field, value) => {
    if (!authUser?.email) return;
    
    try {
      const response = await axios.patch(
        `http://localhost:8080/api/auth/update/${authUser.email}`,
        { [field]: value }
      );
      
      setProfileData(prev => ({ ...prev, [field]: value }));
      setIsEditing({ ...isEditing, [field]: false });
      
      // Update sessionStorage with the new data
      const updatedUser = {
        ...JSON.parse(sessionStorage.getItem('user') || '{}'),
        [field]: value
      };
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Update error:", error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  if (authLoading) return <div>Checking authentication...</div>;
  if (profileLoading) return <div>Loading profile data...</div>;
  if (!authUser) return <div>Please login to view your profile</div>;

  const getBadgeLevel = (points) => {
    points = points || 0;
    if (points <= 1000) return "Bronze Badge";
    else if (points <= 5000) return "Silver Badge";
    else if (points <= 15000) return "Gold Badge";
    else return "Platinum Badge";
  };

  const badgeLevel = getBadgeLevel(profileData?.points);

  const editableFields = [
    { field: 'username', label: 'Username', type: 'text' },
    { field: 'email', label: 'Email', type: 'email', readOnly: true }, // Email should typically be read-only
    { field: 'name', label: 'Name', type: 'text' },
    { field: 'bio', label: 'Bio', type: 'textarea' }
  ];

  const stats = [
    { field: 'followers', label: 'Followers' },
    { field: 'following', label: 'Following' },
    { field: 'attractions', label: 'Attractions' },
    { field: 'points', label: 'Points' }
  ];

  return (
    <section className="profile-container">
      <div className="profile-cover">
        <div className="profile-cover-overlay"></div>
      </div>

      <div className="profile-content">
        <div className="profile-main">
          <div className="profile-header">
            <div className="profile-avatar-container">
              <img 
                src={avatar} 
                alt="Profile" 
                className="profile-avatar" 
              />
              <div className="profile-badge">
                <span className="badge-level">{badgeLevel}</span>
              </div>
            </div>
            
            <div className="profile-info">
              <h1 className="profile-name">{profileData.username || 'User'}</h1>
              <p className="profile-username">@{profileData.username}</p>
              <p className="profile-bio">{profileData.bio || 'No bio yet'}</p>
              
              <div className="profile-stats">
                {stats.map(({ field, label }) => (
                  <div key={field} className="stat-item">
                    <span className="stat-value">{profileData[field]}</span>
                    <span className="stat-label">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="profile-details">
            <h2 className="section-title">Profile Details</h2>
            <div className="details-grid">
              {editableFields.map(({ field, label, type, readOnly }) => (
                <div key={field} className="detail-item">
                  <label className="detail-label">{label}</label>
                  {isEditing[field] ? (
                    <div className="edit-group">
                      {type === 'textarea' ? (
                        <textarea
                          className="detail-input"
                          value={profileData[field] || ''}
                          onChange={(e) => handleInputChange(field, e.target.value)}
                          readOnly={readOnly}
                        />
                      ) : (
                        <input
                          type={type}
                          className="detail-input"
                          value={profileData[field] || ''}
                          onChange={(e) => handleInputChange(field, e.target.value)}
                          readOnly={readOnly}
                        />
                      )}
                      {!readOnly && (
                        <div className="edit-buttons">
                          <button 
                            className="save-button"
                            onClick={() => handleSave(field, profileData[field])}
                          >
                            Save
                          </button>
                          <button 
                            className="cancel-button"
                            onClick={() => handleEditClick(field)}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="display-group">
                      <p className="detail-value">
                        {profileData[field] || `No ${label.toLowerCase()} yet`}
                      </p>
                      {!readOnly && (
                        <button 
                          onClick={() => handleEditClick(field)} 
                          className="edit-button"
                          aria-label={`Edit ${label}`}
                        >
                          <FaPen size={14} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="profile-sidebar">
          <div className="profile-card">
            <h3 className="card-title">Account Summary</h3>
            <div className="card-content">
              <div className="summary-item">
                <span className="summary-label">Email :</span>
                <span className="summary-value">{profileData.email}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">User Class</span>
                <span className="summary-value">{profileData._class || 'Standard'}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Points</span>
                <span className="summary-value highlight">{profileData.points}</span>
              </div>
            </div>
          </div>

          <div className="profile-card">
            <h3 className="card-title">Badge Progress</h3>
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.min(100, (profileData.points / 15000) * 100)}%` }}
                ></div>
              </div>
              <div className="progress-labels">
                <span>Bronze</span>
                <span>Silver</span>
                <span>Gold</span>
                <span>Platinum</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;