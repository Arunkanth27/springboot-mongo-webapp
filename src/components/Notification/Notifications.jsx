import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import avatar from '../../images/OIP.jpg';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    const fetchRecentPosts = async () => {
      if (!userData?.email) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/posts/recent', {
          params: {
            limit: 10,
            userEmail: userData.email
          }
        });
        
        const postNotifications = response.data.map(post => ({
          id: post._id,
          type: 'post',
          user: post.userEmail.split('@')[0],
          message: post.content.length > 50 
            ? `${post.content.substring(0, 50)}...` 
            : post.content,
          time: formatTimeAgo(post.createdAt),
          avatar: avatar,
          postType: post.type, // Collaboration, Question, Discussion
          community: post.communityId,
          visibility: post.visibility, // Public or Private
          imageUrl: post.imageUrl,
          isNew: false
        }));

        setNotifications(postNotifications);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, [userData]);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  // Style definitions for different post types
  const getPostTypeStyle = (postType) => {
    switch(postType) {
      case 'Collaboration':
        return {
          borderLeft: '4px solid #28a745',
          badgeBg: '#28a745',
          badgeText: 'Collaboration'
        };
      case 'Question':
        return {
          borderLeft: '4px solid #17a2b8',
          badgeBg: '#17a2b8',
          badgeText: 'Question'
        };
      case 'Discussion':
        return {
          borderLeft: '4px solid #ffc107',
          badgeBg: '#ffc107',
          badgeText: 'Discussion'
        };
      default:
        return {
          borderLeft: '4px solid #6c757d',
          badgeBg: '#6c757d',
          badgeText: 'Post'
        };
    }
  };

  // Inline styles
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100px',
      color: '#4a4a4a',
      fontSize: '1.2rem'
    },
    errorContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '300px',
      backgroundColor: '#f8f9fa',
      borderRadius: '10px',
      padding: '30px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    title: {
      color: '#343a40',
      fontSize: '1.8rem',
      marginBottom: '25px',
      paddingBottom: '10px',
      borderBottom: '2px solid #e9ecef'
    },
    listItem: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '15px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s ease',
      ':hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
      },
      display: 'flex',
      alignItems: 'flex-start'
    },
    badge: (bgColor) => ({
      display: 'inline-block',
      backgroundColor: bgColor,
      color: 'white',
      padding: '3px 8px',
      borderRadius: '12px',
      fontSize: '0.8rem',
      fontWeight: '500',
      marginLeft: '8px'
    }),
    visibilityBadge: {
      display: 'inline-block',
      backgroundColor: '#e9ecef',
      color: '#6c757d',
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '0.7rem',
      marginLeft: '8px'
    }
  };

  if (loading) return <div style={styles.loading}>Loading notifications...</div>;
  
  if (error || !userData) {
    return (
      <div style={styles.errorContainer}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h3 style={{ color: '#dc3545', marginBottom: '15px', fontSize: '1.5rem' }}>
            Please log in to view notifications
          </h3>
          <button 
            onClick={handleLoginRedirect}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 25px',
              borderRadius: '5px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Go to Login Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Recent Activity</h2>
      {notifications.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '30px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          color: '#6c757d',
          fontSize: '1.1rem',
          marginTop: '20px'
        }}>
          No recent activity found
        </div>
      ) : (
        <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
          {notifications.map((notification) => {
            const postStyle = getPostTypeStyle(notification.postType);
            
            return (
              <li 
                key={notification.id} 
                style={{
                  ...styles.listItem,
                  borderLeft: postStyle.borderLeft
                }}
              >
                <img 
                  src={notification.avatar} 
                  alt={`${notification.user} avatar`} 
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    marginRight: '15px',
                    objectFit: 'cover'
                  }} 
                />
                <div style={{ flex: '1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600', color: '#212529' }}>
                      {notification.user}
                    </span>
                    <span style={styles.badge(postStyle.badgeBg)}>
                      {postStyle.badgeText}
                    </span>
                    {notification.visibility === 'Public' && (
                      <span style={styles.visibilityBadge}>
                        Public
                      </span>
                    )}
                  </div>
                  
                  <p style={{ color: '#495057', margin: '8px 0', lineHeight: '1.5' }}>
                    {notification.message}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    {notification.visibility !== 'Public' && notification.community && (
                      <span style={{ 
                        backgroundColor: '#e9ecef',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                        color: '#6c757d'
                      }}>
                        {notification.community}
                      </span>
                    )}
                    <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                      {notification.time}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Notifications;