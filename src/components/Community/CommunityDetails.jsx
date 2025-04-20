import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaUsers, FaHeart, FaComment, FaArrowLeft, FaEllipsisH, 
  FaBookmark, FaRegHeart, FaRegBookmark, FaRegComment, 
  FaPlus, FaUserFriends, FaThumbsUp, FaEdit, FaTrash,
  FaCrown, FaMedal, FaAward, FaReply
} from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import './CommunityDetails.css';



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

const getDisplayName = (user) => {
  if (!user) return 'Anonymous';
  if (user.name) return user.name;
  if (user.email) return user.email.split('@')[0];
  if (user.userEmail) return user.userEmail.split('@')[0];
  return 'Anonymous';
};

const getBadgeLevel = (points) => {
  points = points || 0;
  if (points <= 1000) return { level: "Bronze", color: "#cd7f32", icon: <FaMedal /> };
  else if (points <= 5000) return { level: "Silver", color: "#c0c0c0", icon: <FaMedal /> };
  else if (points <= 15000) return { level: "Gold", color: "#ffd700", icon: <FaAward /> };
  else return { level: "Platinum", color: "#e5e4e2", icon: <FaCrown /> };
};

const CommunityDetails = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  
  // State declarations
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});
  const [showOptionsForPost, setShowOptionsForPost] = useState(null);
  const [activeReplyInput, setActiveReplyInput] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [postLikes, setPostLikes] = useState({});
  const [comments, setComments] = useState({});
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);
  const [isCommenting, setIsCommenting] = useState({});
  const [isReplying, setIsReplying] = useState({});
  const [loadingComments, setLoadingComments] = useState(false);
  const [isFollowingCommunity, setIsFollowingCommunity] = useState(false);
  const [topMembers, setTopMembers] = useState([]);


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
      color: '#606060', // YouTube gray
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
          // Keep blue color if it's a toggle action (like following)
          color: metricType === 'following' ? '#065fd4' : '#606060'
        }
      }));
    }, 300);
  };



  
  // Initialize post likes
  useEffect(() => {
    if (posts.length > 0 && loggedInUserEmail) {
      const initialLikes = {};
      posts.forEach(post => {
        initialLikes[post._id] = post.likes?.includes(loggedInUserEmail) || false;
      });
      setPostLikes(initialLikes);
    }
  }, [posts, loggedInUserEmail]);
  
  // Check if current user is author of post
  const isCurrentUserAuthor = (post) => {
    if (!loggedInUserEmail) return false;
    return (
      post.userEmail?.toLowerCase() === loggedInUserEmail.toLowerCase() || 
      post.authorEmail?.toLowerCase() === loggedInUserEmail.toLowerCase()
    );
  };

  // Fetch community data
  const fetchCommunityData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const communityRes = await axios.get(
        `${API_BASE_URL}/api/communities/name/${encodeURIComponent(name)}`,
        { timeout: 5000 }
      );

      if (!communityRes.data) {
        throw new Error('Community not found');
      }

      setCommunity(communityRes.data);

      const postsRes = await axios.get(
        `${API_BASE_URL}/api/posts/by-community/${encodeURIComponent(name)}`,
        { timeout: 5000 }
      );

      setPosts(postsRes.data?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || []);
    } catch (err) {
      console.error("Error fetching community data:", err);
      setError(err.response?.data?.message || err.message || 'Failed to load community');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityData();
  }, [name]);

  // Fetch comments for a post
  const fetchComments = async (postId) => {
    try {
      setLoadingComments(true);
      const res = await axios.get(`${API_BASE_URL}/api/comments/post/${postId}`, { timeout: 5000 });
      setComments(prev => ({...prev, [postId]: res.data}));
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  // Toggle comments visibility for a single post
  const toggleComments = (postId) => {
    if (activeCommentsPostId === postId) {
      setActiveCommentsPostId(null); // Hide if clicking the same post
    } else {
      setActiveCommentsPostId(postId); // Show comments for this post
      if (!comments[postId]) {
        fetchComments(postId);
      }
    }
  };
  const toggleFollowCommunity = async () => {
    if (!loggedInUserEmail) {
      alert("Please log in to follow communities");
      navigate('/login');
      return;
    }

    try {
      const endpoint = isFollowingCommunity ? 'leave' : 'join';
      const res = await axios.post(
        `${API_BASE_URL}/api/communities/${name}/${endpoint}`,
        { userEmail: loggedInUserEmail },
        { timeout: 5000 }
      );

      // Update points when following/unfollowing
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUserData(res.data.user);
      }

      setIsFollowingCommunity(!isFollowingCommunity);
      setCommunity(prev => ({
        ...prev,
        members: isFollowingCommunity
          ? prev.members.filter(m => 
              m.email !== loggedInUserEmail && m.userEmail !== loggedInUserEmail
            )
          : [...prev.members, { email: loggedInUserEmail }]
      }));

      // Award points for community interaction
      if (!isFollowingCommunity) {
        await axios.post(
          `${API_BASE_URL}/api/users/award-points`,
          {
            email: loggedInUserEmail,
            points: 50,
            action: 'community_join'
          },
          { timeout: 5000 }
        );
      }
    } catch (err) {
      console.error("Error toggling community follow:", err);
      alert(err.response?.data?.message || "Failed to update community status");
    }
  };

  // Toggle follow user
  const toggleFollowUser = async (memberEmail) => {
    if (!loggedInUserEmail) {
      alert("Please log in to follow users");
      navigate('/login');
      return;
    }

    if (memberEmail === loggedInUserEmail) {
      alert("You cannot follow yourself");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/users/toggle-follow`,
        {
          followerEmail: loggedInUserEmail,
          followingEmail: memberEmail
        },
        { timeout: 5000 }
      );

      // Update local user data if current user's stats changed
      if (res.data.updatedFollower) {
        localStorage.setItem('user', JSON.stringify(res.data.updatedFollower));
        setUserData(res.data.updatedFollower);
      }

      // Award points for social interaction
      if (res.data.action === 'follow') {
        await axios.post(
          `${API_BASE_URL}/api/users/award-points`,
          {
            email: loggedInUserEmail,
            points: 10,
            action: 'follow_user'
          },
          { timeout: 5000 }
        );
      }
    } catch (err) {
      console.error("Error toggling user follow:", err);
      alert(err.response?.data?.message || "Failed to update follow status");
    }
  };

  // Check if current user is following another user
  const isFollowingUser = (memberEmail) => {
    return userData?.following?.includes(memberEmail);
  };
  // Toggle like on post
  const toggleLike = async (postId) => {
    try {
      const isLiked = postLikes[postId];
      const endpoint = isLiked ? 'unlike' : 'like';
      
      await axios.post(
        `${API_BASE_URL}/api/posts/${postId}/${endpoint}`,
        { userEmail: loggedInUserEmail },
        { timeout: 5000 }
      );
      
      setPostLikes(prev => ({
        ...prev,
        [postId]: !prev[postId]
      }));
      
      setPosts(posts.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              likesCount: isLiked 
                ? (post.likesCount || 1) - 1 
                : (post.likesCount || 0) + 1 
            } 
          : post
      ));
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  // Toggle all posts view
  const toggleAllPosts = () => {
    setShowAllPosts(!showAllPosts);
  };

  // Navigate to create post
  const handleCreatePost = () => {
    navigate(`/create-post?community=${encodeURIComponent(name)}`);
  };

  // Toggle post options dropdown
  const togglePostOptions = (postId) => {
    setShowOptionsForPost(showOptionsForPost === postId ? null : postId);
  };

  // Edit post handler
  const handleEditPost = (postId) => {
    const post = posts.find(p => p._id === postId);
    if (isCurrentUserAuthor(post)) {
      navigate(`/edit-post/${postId}`);
    }
  };

  // Delete post handler
  const handleDeletePost = async (postId) => {
    const post = posts.find(p => p._id === postId);
    if (!isCurrentUserAuthor(post)) {
      alert("You can only delete your own posts");
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/posts/${postId}`, { timeout: 5000 });
      await axios.delete(`${API_BASE_URL}/api/comments/post/${postId}`, { timeout: 5000 });
      setPosts(posts.filter(p => p._id !== postId));
      if (activeCommentsPostId === postId) {
        setActiveCommentsPostId(null);
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post");
    }
  };

  // Add comment to post
  const addComment = async (postId) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;
    
    if (content.length > MAX_COMMENT_LENGTH) {
      alert(`Comment cannot exceed ${MAX_COMMENT_LENGTH} characters`);
      return;
    }
    
    try {
      setIsCommenting(prev => ({...prev, [postId]: true}));
      
      const newComment = {
        postId,
        content,
        authorEmail: loggedInUserEmail,
        authorName: getDisplayName(userData)
      };
      
      const res = await axios.post(
        `${API_BASE_URL}/api/comments`, 
        newComment,
        { timeout: 5000 }
      );
      
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), res.data]
      }));
      
      setCommentInputs(prev => ({...prev, [postId]: ''}));
      
      setPosts(posts.map(post => 
        post._id === postId 
          ? {...post, commentsCount: (post.commentsCount || 0) + 1} 
          : post
      ));
    } catch (err) {
      console.error("Error adding comment:", err);
      alert(err.response?.data?.message || "Failed to add comment");
    } finally {
      setIsCommenting(prev => ({...prev, [postId]: false}));
    }
  };

  // Add reply to comment
  const addReply = async (postId, commentId) => {
    const content = replyInputs[commentId]?.trim();
    if (!content) return;
    
    if (content.length > MAX_COMMENT_LENGTH) {
      alert(`Reply cannot exceed ${MAX_COMMENT_LENGTH} characters`);
      return;
    }
    
    try {
      setIsReplying(prev => ({...prev, [commentId]: true}));
      
      const newReply = {
        content,
        authorEmail: loggedInUserEmail,
        authorName: getDisplayName(userData)
      };
      
      const res = await axios.post(
        `${API_BASE_URL}/api/comments/${commentId}/replies`, 
        newReply,
        { timeout: 5000 }
      );
      
      setComments(prev => ({
        ...prev,
        [postId]: prev[postId].map(comment => 
          comment.id === commentId ? res.data : comment
        )
      }));
      
      setReplyInputs(prev => ({...prev, [commentId]: ''}));
      setActiveReplyInput(null);
    } catch (err) {
      console.error("Error adding reply:", err);
      alert(err.response?.data?.message || "Failed to add reply");
    } finally {
      setIsReplying(prev => ({...prev, [commentId]: false}));
    }
  };

  // Delete comment
  const deleteComment = async (postId, commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    
    try {
      await axios.delete(
        `${API_BASE_URL}/api/comments/${commentId}`,
        { timeout: 5000 }
      );
      setComments(prev => ({
        ...prev,
        [postId]: prev[postId].filter(comment => comment.id !== commentId)
      }));
      
      setPosts(posts.map(post => 
        post._id === postId 
          ? {...post, commentsCount: (post.commentsCount || 1) - 1} 
          : post
      ));
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment");
    }
  };

  // Delete reply
  const deleteReply = async (postId, commentId, replyId) => {
    if (!window.confirm("Are you sure you want to delete this reply?")) return;
    
    try {
      const res = await axios.delete(
        `${API_BASE_URL}/api/comments/${commentId}/replies/${replyId}`,
        { timeout: 5000 }
      );
      
      setComments(prev => ({
        ...prev,
        [postId]: prev[postId].map(comment => 
          comment.id === commentId ? res.data : comment
        )
      }));
    } catch (err) {
      console.error("Error deleting reply:", err);
      alert("Failed to delete reply");
    }
  };

  // Check if current user is comment author
  const isCurrentUserCommentAuthor = (comment) => {
    return comment.authorEmail === loggedInUserEmail;
  };

  // Check if current user is reply author
  const isCurrentUserReplyAuthor = (reply) => {
    return reply.authorEmail === loggedInUserEmail;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  // Community not found state
  if (!community) {
    return (
      <div className="not-found-container">
        <h2>Community not found</h2>
        <button onClick={() => navigate(-1)}>Browse other communities</button>
      </div>
    );
  }
  const incrementPoints = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/by-email/increment-points`,
        null,
        { params: { email: loggedInUserEmail, amount: 1 } }
      );
      
      // Update both state and localStorage
      const updatedStats = { ...userStats, points: res.data.points };
      setUserStats(updatedStats);
      
      const updatedUser = { ...userData, points: res.data.points };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUserData(updatedUser);
    } catch (err) {
      console.error("Error incrementing points:", err);
    }
  };

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

  // Example usage in JSX for following another user
  const handleFollowUser = (memberEmail) => {
    if (!memberEmail || memberEmail === loggedInUserEmail) return;
    incrementFollowing(memberEmail);
  };
 

  return (
    <div className="community-layout">
      {/* Left Sidebar - User Profile */}
      <div className="sidebar-user">
        <div className="user-card">
          <div className="user-header">
            <img
              src={userData?.profilePic || `https://ui-avatars.com/api/?name=${getDisplayName(userData)}&background=random`}
              alt="User profile"
              className="user-avatar"
            />
            <h3>{getDisplayName(userData)}</h3>
            <p className="user-email">{loggedInUserEmail}</p>
          </div>
          
          <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginTop: '20px',
      padding: '16px',
      backgroundColor: '#f9f9f9',
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
        <span style={{
          marginLeft: 'auto',
          padding: '2px 8px',
          backgroundColor: '#ffcc00',
          borderRadius: '10px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {userStats.points > 1000 ? 'Gold' : userStats.points > 500 ? 'Silver' : 'Bronze'}
        </span>
      </div>
    </div>
          
          
          <button className="btn-create-post" onClick={handleCreatePost}>
            <FaPlus /> Create Post
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="community-main">
        {/* Community Header */}
        <header className="community-topbar">
          <button onClick={() => navigate(-1)} className="btn-back">
            <FaArrowLeft />
          </button>
          <div className="community-meta">
            <h1>{community.name}</h1>
            <p className="community-members">
              <FaUsers /> {community.members?.length || 0} members
            </p>
          </div>
        </header>

        {/* Community Bio */}
        <div className="community-description">
          <p>{community.description || 'No description available'}</p>
        </div>

        {/* Posts Section */}
        <div className="posts-section">
          <div className="section-header">
            <h2>Community Posts</h2>
            {posts.length > 3 && (
              <button onClick={toggleAllPosts} className="btn-view-toggle">
                {showAllPosts ? 'Show Less' : 'View All'}
              </button>
            )}
          </div>

          {posts.length === 0 ? (
            <div className="empty-posts">
              <img src="/images/no-posts.svg" alt="No posts" />
              <h3>No posts yet</h3>
              <p>Be the first to share something in this community</p>
              <button className="btn-create-post" onClick={handleCreatePost}>
                <FaPlus /> Create First Post
              </button>
            </div>
          ) : (
            <div className="posts-list">
              {(showAllPosts ? posts : posts.slice(0, 3)).map(post => (
                <div key={post._id} className="post-card">
                  {/* Post Header */}
                  <div className="post-head">
                    <div className="post-author-info">
                      <img
                        src={`https://ui-avatars.com/api/?name=${getDisplayName(post)}&background=random`}
                        alt="Author"
                        className="author-img"
                      />
                      <div>
                        <span className="author-name">
                          {getDisplayName(post)}
                          {isCurrentUserAuthor(post) && (
                            <span className="you-badge"> (You)</span>
                          )}
                        </span>
                        <div className="post-time">
                          {formatDate(post.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="post-options-container">
                      <button 
                        className="btn-post-options" 
                        onClick={() => togglePostOptions(post._id)}
                      >
                        <FaEllipsisH />
                      </button>
                      {showOptionsForPost === post._id && isCurrentUserAuthor(post) && (
                        <div className="post-options-dropdown">
                          <button onClick={() => handleEditPost(post._id)}>
                            <FaEdit /> Edit
                          </button>
                          <button onClick={() => handleDeletePost(post._id)}>
                            <FaTrash /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {post.imageUrl && (
                    <StableImage
                      src={post.imageUrl}
                      alt="Post content"
                      className="post-media"
                    />
                  )}

                  {/* Post Content */}
                  <div className="post-content">
                    <span className="content-text">{post.content || ''}</span>
                  </div>

                  {/* Post Actions */}
                  <div className="post-actions">
                    <div className="actions-left">
                      <button 
                        className={`btn-like ${postLikes[post._id] ? 'liked' : ''}`}
                        onClick={() => toggleLike(post._id)}
                      >
                        {postLikes[post._id] ? <FaHeart /> : <FaRegHeart />}
                        <span>{post.likesCount || 0}</span>
                      </button>
                      <button 
                        className="btn-comment"
                        onClick={() => toggleComments(post._id)}
                      >
                        <FaRegComment />
                        <span>{post.commentsCount || 0}</span>
                        {activeCommentsPostId === post._id ? ' (Hide)' : ''}
                      </button>
                      <button className="btn-share">
                        <FiSend />
                      </button>
                    </div>
                    <button className="btn-save">
                      <FaRegBookmark />
                    </button>
                  </div>

                  {/* Comments Section - Only show for active post */}
                  {activeCommentsPostId === post._id && (
                    <div className="comments-section">
                      {loadingComments ? (
                        <div className="loading-comments">Loading comments...</div>
                      ) : (
                        <>
                          {/* Add Comment Form */}
                          <div className="add-comment">
                            <img
                              src={userData?.profilePic || `https://ui-avatars.com/api/?name=${getDisplayName(userData)}&background=random`}
                              alt="User"
                              className="comment-user-avatar"
                            />
                            <div className="comment-input-container">
                              <input
                                type="text"
                                placeholder="Add a comment..."
                                value={commentInputs[post._id] || ''}
                                onChange={(e) => setCommentInputs(prev => ({
                                  ...prev,
                                  [post._id]: e.target.value
                                }))}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    addComment(post._id);
                                  }
                                }}
                                maxLength={MAX_COMMENT_LENGTH}
                              />
                              <div className="char-counter">
                                {(commentInputs[post._id]?.length || 0)}/{MAX_COMMENT_LENGTH}
                              </div>
                            </div>
                            <button 
                              className="btn-send-comment"
                              onClick={() => addComment(post._id)}
                              disabled={isCommenting[post._id]}
                            >
                              {isCommenting[post._id] ? 'Posting...' : <FiSend />}
                            </button>
                          </div>

                          {/* Comments List */}
                          {comments[post._id]?.map(comment => (
                            <div key={comment.id} className="comment-item">
                              <div className="comment-header">
                                <img
                                  src={`https://ui-avatars.com/api/?name=${comment.authorName}&background=random`}
                                  alt="Comment author"
                                  className="comment-author-avatar"
                                />
                                <div className="comment-author-info">
                                  <span className="comment-author-name">
                                    {comment.authorName}
                                    {isCurrentUserCommentAuthor(comment) && (
                                      <span className="you-badge"> (You)</span>
                                    )}
                                  </span>
                                  <span className="comment-time">
                                    {formatDate(comment.createdAt)}
                                  </span>
                                </div>
                                {isCurrentUserCommentAuthor(comment) && (
                                  <button 
                                    className="btn-delete-comment"
                                    onClick={() => deleteComment(post._id, comment.id)}
                                  >
                                    <FaTrash size={12} />
                                  </button>
                                )}
                              </div>
                              
                              <div className="comment-content">
                                {comment.content}
                              </div>

                              {/* Replies Section */}
                              <div className="replies-section">
                                {comment.replies?.map(reply => (
                                  <div key={reply.id} className="reply-item">
                                    <div className="reply-header">
                                      <img
                                        src={`https://ui-avatars.com/api/?name=${reply.authorName}&background=random`}
                                        alt="Reply author"
                                        className="reply-author-avatar"
                                      />
                                      <div className="reply-author-info">
                                        <span className="reply-author-name">
                                          {reply.authorName}
                                          {isCurrentUserReplyAuthor(reply) && (
                                            <span className="you-badge"> (You)</span>
                                          )}
                                        </span>
                                        <span className="reply-time">
                                          {formatDate(reply.createdAt)}
                                        </span>
                                      </div>
                                      {isCurrentUserReplyAuthor(reply) && (
                                        <button 
                                          className="btn-delete-reply"
                                          onClick={() => deleteReply(post._id, comment.id, reply.id)}
                                        >
                                          <FaTrash size={10} />
                                        </button>
                                      )}
                                    </div>
                                    <div className="reply-content">
                                      {reply.content}
                                    </div>
                                  </div>
                                ))}

                                {/* Add Reply Form (shown when reply button is clicked) */}
                                {activeReplyInput === comment.id && (
                                  <div className="add-reply">
                                    <div className="reply-input-container">
                                      <input
                                        type="text"
                                        placeholder="Add a reply..."
                                        value={replyInputs[comment.id] || ''}
                                        onChange={(e) => setReplyInputs(prev => ({
                                          ...prev,
                                          [comment.id]: e.target.value
                                        }))}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            addReply(post._id, comment.id);
                                          }
                                        }}
                                        maxLength={MAX_COMMENT_LENGTH}
                                        autoFocus
                                      />
                                      <div className="char-counter">
                                        {(replyInputs[comment.id]?.length || 0)}/{MAX_COMMENT_LENGTH}
                                      </div>
                                    </div>
                                    <button 
                                      className="btn-send-reply"
                                      onClick={() => addReply(post._id, comment.id)}
                                      disabled={isReplying[comment.id]}
                                    >
                                      {isReplying[comment.id] ? 'Posting...' : <FiSend />}
                                    </button>
                                  </div>
                                )}

                                {/* Reply Button */}
                                <button 
                                  className="btn-reply"
                                  onClick={() => {
                                    setActiveReplyInput(
                                      activeReplyInput === comment.id ? null : comment.id
                                    );
                                    setReplyInputs(prev => ({
                                      ...prev,
                                      [comment.id]: ''
                                    }));
                                  }}
                                >
                                  <FaReply size={12} /> Reply
                                </button>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Community Stats */}
      <div className="sidebar-stats">
        <div className="stats-card">
          <h3>Community Stats</h3>
          <div className="stats-item">
            <FaUsers className="stats-icon" />
            <span>Total Members: {community.members?.length || 0}</span>
          </div>
          <div className="stats-item">
            <FaThumbsUp className="stats-icon" />
            <span>Total Posts: {posts.length}</span>
          </div>
          <div className="stats-item">
            <FaComment className="stats-icon" />
            <span>Active Today: {community.activeToday || 0}</span>
          </div>
          
          <div className="top-contributors">
            <h4>Top Members</h4>
            {community.members?.slice(0, 5).map((member, index) => (
              <div key={member._id || index} className="contributor">
                <img
                  src={`https://ui-avatars.com/api/?name=${getDisplayName(member)}&background=random`}
                  alt="Member"
                  className="contributor-avatar"
                />
                <div className="contributor-info">
                  <span className="contributor-name">
                    {getDisplayName(member)}
                    {member.email === loggedInUserEmail && (
                      <span className="you-badge"> (You)</span>
                    )}
                  </span>
                  <span className="contributor-stats">
                    {member.postCount || 0} posts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetails;