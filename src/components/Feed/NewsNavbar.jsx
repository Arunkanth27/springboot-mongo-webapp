import React, { useEffect, useState } from 'react';

const NewsNavbar = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/auth/users')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

  const getBadgeLevel = (points) => {
    points = points || 0;
    if (points <= 1000) return { level: "Bronze", color: "#cd7f32" };
    else if (points <= 5000) return { level: "Silver", color: "#c0c0c0" };
    else if (points <= 15000) return { level: "Gold", color: "#ffd700" };
    else return { level: "Platinum", color: "#e5e4e2" };
  };

  const styles = {
    sidebar: {
      position: 'fixed',
      right: '0',
      top: '15px',
      height: '580px',
      width: '220px',
      backgroundColor: '#2d3748',
      color: '#f7fafc',
      padding: '20px',
      boxShadow: '-2px 0 15px rgba(0, 0, 0, 0.2)',
      overflowY: 'auto',
      zIndex: '1000',
      borderRadius:'20px'
    },
    header: {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '25px',
      paddingBottom: '15px',
      borderBottom: '2px solid #4a5568',
      color: '#f6e05e',
      textAlign: 'center',
    },
    userList: {
      listStyle: 'none',
      padding: '0',
      margin: '0',
    },
    userItem: {
      padding: '15px',
      marginBottom: '12px',
      backgroundColor: '#4a5568',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      transition: 'all 0.2s ease',
      ':hover': {
        backgroundColor: '#2d3748',
        transform: 'translateX(-5px)',
      },
    },
    userInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    email: {
      fontWeight: '500',
      fontSize: '0.95rem',
      color: '#f7fafc',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    points: {
      backgroundColor: '#f6e05e',
      color: '#2d3748',
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: 'bold',
      minWidth: '50px',
      textAlign: 'center',
    },
    badge: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '0.8rem',
    },
    badgeIcon: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
    },
    loading: {
      textAlign: 'center',
      padding: '20px',
      color: '#a0aec0',
      fontStyle: 'italic',
    },
    emptyState: {
      textAlign: 'center',
      padding: '20px',
      color: '#a0aec0',
      fontStyle: 'italic',
    }
  };

  return (
    <div style={styles.sidebar}>
      <h3 style={styles.header}>Community Leaderboard</h3>
      
      {loading ? (
        <p style={styles.loading}>Loading user data...</p>
      ) : users.length > 0 ? (
        <ul style={styles.userList}>
          {users.sort((a, b) => b.points - a.points).map((user, index) => {
            const badge = getBadgeLevel(user.points);
            return (
              <li key={user._id || index} style={styles.userItem}>
                <div style={styles.userInfo}>
                  <span style={styles.email}>{user.email}</span>
                  <span style={styles.points}>{user.points} pts</span>
                </div>
                <div style={styles.badge}>
                  <span style={{ 
                    ...styles.badgeIcon, 
                    backgroundColor: badge.color 
                  }} />
                  {badge.level} Badge
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p style={styles.emptyState}>No users found</p>
      )}
    </div>
  );
};

export default NewsNavbar;