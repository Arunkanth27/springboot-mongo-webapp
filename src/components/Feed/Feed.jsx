import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Feed = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userCommunities, setUserCommunities] = useState([]);
  const [publicPosts, setPublicPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const API_BASE_URL = 'http://localhost:8080';
  const MAX_COMMENT_LENGTH = 500;
  // Stable Image Component to prevent re-renders
  const StableImage = ({ src, alt, className }) => {
    const [imgSrc, setImgSrc] = useState(src ? `${API_BASE_URL}/uploads/${src}` : '/placeholder-image.jpg');
    const [loading, setLoading] = useState(true);
  
    const handleError = () => {
      if (imgSrc !== '/placeholder-image.jpg') {
        setImgSrc('/placeholder-image.jpg');
      }
      setLoading(false);
    };
  
    const handleLoad = () => {
      setLoading(false);
    };
  
    return (
      <div className="image-container">
        {loading && <div className="image-loading">Loading...</div>}
        <img
          src={imgSrc}
          alt={alt}
          className={className}
          onError={handleError}
          onLoad={handleLoad}
          style={{ display: loading ? 'none' : 'block' }}
        />
      </div>
    );
  };
  
  // Fetch user from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Fetch public posts
  useEffect(() => {
    const fetchPublicPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/posts/public');
        if (!response.ok) {
          throw new Error('Failed to fetch public posts');
        }
        const data = await response.json();
        setPublicPosts(data);
      } catch (error) {
        console.error('Error fetching public posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicPosts();
  }, []);

  // Fetch user's communities when user changes
  useEffect(() => {
    const fetchUserCommunities = async () => {
      if (user?.email) {
        setIsLoading(true);
        try {
          const response = await fetch(`http://localhost:8080/api/communities/${user.email}`);
          if (!response.ok) {
            throw new Error('Failed to fetch communities');
          }
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
  }, [user]);

  // Filter posts based on search query
  const filteredPosts = publicPosts.filter(post =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
          <div style={styles.loading}>Loading public posts...</div>
        ) : filteredPosts.length > 0 ? (
          <div style={styles.postsGrid}>
            {filteredPosts.map(post => (
              <div 
                key={post._id} 
                style={styles.postCard}
                onClick={() => navigate(`/post/${post._id}`)}
              >
                <div style={styles.postHeader}>
                  <span style={styles.postType}>{post.type}</span>
                 
                </div>
                <h4 style={styles.postTitle}>
                  {post.content.length > 100 
                    ? `${post.content.substring(0, 100)}...` 
                    : post.content}
                </h4>
                {post.imageUrl && (
                    <StableImage
                      src={post.imageUrl}
                      alt="Post content"
                      className="post-media"
                    />
                  )}
                <div style={styles.postFooter}>
                  <span style={styles.postAuthor}>By: {post.userEmail}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.noPosts}>
            {searchQuery ? 'No matching posts found' : 'No public posts available'}
          </div>
        )}
      </div>

      {/* Display User Communities */}
      {user && (
        <div style={styles.communitiesSection}>
          <h3 style={styles.sectionTitle}>Your Communities</h3>
          {isLoading ? (
            <div style={styles.loading}>Loading your communities...</div>
          ) : userCommunities.length > 0 ? (
            <div style={styles.communitiesGrid}>
              {userCommunities.map(community => (
                <div 
                  key={community._id} 
                  style={styles.communityCard}
                  onClick={() => navigate(`/community/${community._id}`)}
                >
                  <h4 style={styles.communityName}>{community.name}</h4>
                  <p style={styles.communityDescription}>
                    {community.description.length > 100
                      ? `${community.description.substring(0, 100)}...`
                      : community.description}
                  </p>
                  <small style={styles.communityCreator}>
                    Created by: {community.createdBy}
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.noCommunities}>
              You haven't joined any communities yet
            </div>
          )}
        </div>
      )}
    </section>
  );
};

// Enhanced CSS styles
const styles = {
  feed: {
    width: '90%',
    maxWidth: '800px',
    margin: '0 auto 0 10px',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f5f7fa',
    minHeight: '100vh'
  },
  feedHeader: {
    textAlign: 'center',
    marginBottom: '30px',
    padding: '25px 0',
    background: 'linear-gradient(135deg, #6e8efb, #a777e3)',
    color: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
  },
  feedTitle: {
    margin: '0',
    fontSize: '2.2rem',
    fontWeight: '700',
    letterSpacing: '0.5px'
  },
  feedSubtitle: {
    margin: '10px 0 0',
    fontSize: '1.1rem',
    opacity: '0.9',
    fontWeight: '300'
  },
  headerActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '20px'
  },
  searchBar: {
    position: 'relative',
    flexGrow: '1',
    maxWidth: '270px'
  },
  searchInput: {
    width: '100%',
    padding: '12px 20px 12px 45px',
    borderRadius: '30px',
    border: '2px solid #e0e0e0',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)'
  },
  searchIcon: {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#777',
    fontSize: '1.1rem'
  },
  actionButtons: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap'
  },
  createPostBtn: {
    padding: '12px 25px',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#6e8efb',
    color: 'white'
  },
  createCommunityBtn: {
    padding: '12px 25px',
    border: '2px solid #6e8efb',
    borderRadius: '30px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
    color: '#6e8efb'
  },
  postsSection: {
    marginBottom: '40px',
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
  },
  communitiesSection: {
    marginTop: '30px',
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
  },
  sectionTitle: {
    fontSize: '1.6rem',
    fontWeight: '600',
    marginBottom: '25px',
    color: '#2d3748',
    borderBottom: '2px solid #edf2f7',
    paddingBottom: '10px'
  },
  postsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '25px'
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.08)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '1px solid #edf2f7'
  },
  postHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  postType: {
    backgroundColor: '#ebf4ff',
    color: '#4299e1',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600'
  },
  postDate: {
    fontSize: '0.85rem',
    color: '#718096'
  },
  postTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#2d3748',
    margin: '15px 0',
    lineHeight: '1.4'
  },
  postImagePreview: {
    margin: '15px 0',
    borderRadius: '8px',
    overflow: 'hidden',
    maxHeight: '200px'
  },
  image: {
    width: '100%',
    height: 'auto',
    objectFit: 'cover'
  },
  postFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid #edf2f7'
  },
  postAuthor: {
    fontSize: '0.9rem',
    color: '#718096'
  },
  communitiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px'
  },
  communityCard: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.08)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '1px solid #edf2f7'
  },
  communityName: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: '10px'
  },
  communityDescription: {
    fontSize: '1rem',
    color: '#4a5568',
    margin: '15px 0',
    lineHeight: '1.5'
  },
  communityCreator: {
    fontSize: '0.85rem',
    color: '#718096',
    fontStyle: 'italic'
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    color: '#718096'
  },
  noPosts: {
    textAlign: 'center',
    padding: '30px',
    color: '#718096',
    backgroundColor: '#f8fafc',
    borderRadius: '8px'
  },
  noCommunities: {
    textAlign: 'center',
    padding: '30px',
    color: '#718096',
    backgroundColor: '#f8fafc',
    borderRadius: '8px'
  }
};

export default Feed;