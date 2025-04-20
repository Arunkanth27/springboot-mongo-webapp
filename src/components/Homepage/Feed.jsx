import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Feed = ({ posts = [] }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // State to store user object
  const [userCommunities, setUserCommunities] = useState([]);
   const [publicPosts, setPublicPosts] = useState([]); // State to store public posts

  const [isLoading, setIsLoading] = useState(false);

  // Fetch user from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));  // Parse the JSON string
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);
  useEffect(() => {
    const fetchPublicPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/posts/public');
        const data = await response.json();
        setPublicPosts(data);  // Set the fetched posts into state
      } catch (error) {
        console.error('Error fetching public posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicPosts();
  }, []);  // Empty dependency array ensures this only runs on mount

  // Fetch user's communities when component mounts or user changes
  useEffect(() => {
    const fetchUserCommunities = async () => {
      if (user?.email) {  // Check for user.email
        setIsLoading(true);
        try {
          const response = await fetch(`/api/communities/${user.email}`);
          const data = await response.json();
          setUserCommunities(data);
        } catch (error) {
          console.error('Error fetching communities:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserCommunities();
  }, [user]);  // Dependency on user

  // Handle login by setting user in localStorage
  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));  // Store as JSON string
    setUser(userData);  // Update user state
  };

  // Handle logout by clearing user from localStorage
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);  // Clear user state
  };

  // Handle community creation
  const handleCreateCommunity = async (communityData) => {
    if (!user?.email) {
      console.error('You need to be logged in to create a community');
      return;
    }

    try {
      const response = await fetch('/api/communities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...communityData,
          creatorEmail: user.email,  // Use user.email
        }),
      });
      const newCommunity = await response.json();
      setUserCommunities([...userCommunities, newCommunity]);
    } catch (error) {
      console.error('Error creating community:', error);
    }
  };

  return (
    <section style={styles.feed}>
      <div style={styles.feedHeader}>
        <h2 style={styles.feedTitle}>Welcome to the Tech Community</h2>
        <p style={styles.feedSubtitle}>Connect, share, and learn with fellow tech enthusiasts</p>
      </div>

      {/* Header Actions with Search, Create Post, and Create Community */}
      <div style={styles.headerActions}>
        <div style={styles.searchBar}>
          <input 
            type="text" 
            placeholder="Search posts..." 
            style={styles.searchInput}
          />
          <i className="fas fa-search" style={styles.searchIcon}></i>
        </div>
        <div style={styles.actionButtons}>
          <button 
            style={styles.createPostBtn} 
            onClick={() => navigate('/create-post')}
          >
            <i className="fas fa-plus"></i> Create Post
          </button>
          <button 
            style={styles.createCommunityBtn}  
            onClick={() => navigate('/create-community')}
          >
            <i className="fas fa-users"></i> Create Community
          </button>
        </div>
      </div>
   {/* Display Public Posts */}
   <div style={styles.postsSection}>
        <h3 style={styles.sectionTitle}>Public Posts</h3>
        {isLoading ? (
          <p>Loading public posts...</p>
        ) : publicPosts.length > 0 ? (
          <div style={styles.postsGrid}>
            {publicPosts.map(post => (
              <div 
                key={post.id} 
                style={styles.postCard}
                onClick={() => navigate(`/post/${post.id}`)}
              >
                <h4 style={styles.postTitle}>{post.content}</h4>
                <p style={styles.postVisibility}>Visibility: {post.visibility}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No public posts available</p>
        )}
      </div>
      {user && (
        <div style={styles.communitiesSection}>
          <h3 style={styles.sectionTitle}>Your Communities</h3>
          {isLoading ? (
            <p>Loading your communities...</p>
          ) : userCommunities.length > 0 ? (
            <div style={styles.communitiesGrid}>
              {userCommunities.map(community => (
                <div 
                  key={community._id} 
                  style={styles.communityCard}
                  onClick={() => navigate(`/community/${community._id}`)}
                >
                  <h4 style={styles.communityName}>{community.name}</h4>
                  <p style={styles.communityDescription}>{community.description}</p>
                  <small style={styles.communityCreator}>Created by: {community.createdBy}</small>
                </div>
              ))}
            </div>
          ) : (
            <p>You haven't joined any communities yet</p>
          )}
        </div>
      )}

      {/* Create Community Button (only for logged-in users) */}
      {user && (
        <button 
          style={styles.createCommunityBtn}
          onClick={() => navigate('/create-community')}
        >
          <i className="fas fa-users"></i> Create New Community
        </button>
      )}
    </section>
  );
};

// Inline CSS styles
const styles = {
  feed: {
    width: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  feedHeader: {
    textAlign: 'center',
    marginBottom: '30px',
    padding: '20px 0',
    background: 'linear-gradient(135deg, #6e8efb, #a777e3)',
    color: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  feedTitle: {
    margin: '0',
    fontSize: '2rem',
    fontWeight: '700'
  },
  feedSubtitle: {
    margin: '10px 0 0',
    fontSize: '1rem',
    opacity: '0.9'
  },
  headerActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  searchBar: {
    position: 'relative',
    flexGrow: '1',
    maxWidth: '800px'
  },
  searchInput: {
    width: '80%',
    padding: '12px 20px 12px 40px',
    borderRadius: '25px',
    border: '2px solid #e0e0e0',
    fontSize: '1rem',
    transition: 'all 0.3s ease'
  },
  searchIcon: {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#777'
  },
  actionButtons: {
    display: 'flex',
    gap: '10px'
  },
  createPostBtn: {
    padding: '12px 20px 12px 20px',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#6e8efb',
    color: 'white',
    width: '200px'
  },
  createCommunityBtn: {
    padding: '12px 20px',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
    color: '#6e8efb',
    border: '2px solid #6e8efb',
    marginTop:'10px'
  },
  communitiesSection: {
    marginTop: '30px',
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '20px'
  },
  communitiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  communityCard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center'
  },
  communityName: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333'
  },
  communityDescription: {
    fontSize: '1rem',
    color: '#666',
    marginTop: '10px'
  },
  communityCreator: {
    fontSize: '0.85rem',
    color: '#999',
    marginTop: '10px'
  },
  communityCardHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)'
  }
};

export default Feed;
