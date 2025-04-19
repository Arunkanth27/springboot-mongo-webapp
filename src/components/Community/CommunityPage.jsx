import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaUsers, FaCommentAlt, FaPlus, FaPenAlt, FaChevronRight, FaSignOutAlt } from 'react-icons/fa';
import '../../components/Global.css';
import Swal from 'sweetalert2';

const CommunityPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.email) {
      setUserEmail(user.email);
      // Load user's joined communities
      const joined = JSON.parse(localStorage.getItem('joinedCommunities') || '[]');
      setJoinedCommunities(joined);
    }

    const fetchCommunities = async () => {
      try {
        const response = await axios.get('/api/communities');
        setCommunities(response.data);
      } catch (error) {
        console.error('Error fetching communities:', error);
        Swal.fire('Error', 'Failed to load communities', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCommunities();
  }, []);

  const handleJoinCommunity = async (communityName) => {
    if (!userEmail) {
      Swal.fire('Error', 'You must be logged in to join communities', 'error');
      return;
    }

    try {
      // Optimistic UI update
      setCommunities(prev => prev.map(community => 
        community.name === communityName 
          ? {
              ...community,
              members: [...community.members, userEmail],
              memberCount: community.memberCount + 1
            }
          : community
      ));

      const response = await axios.post(
        `/api/communities/${encodeURIComponent(communityName)}/join`,
        { userEmail }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Update joined communities in state and localStorage
      const updatedJoinedCommunities = [...joinedCommunities, communityName];
      setJoinedCommunities(updatedJoinedCommunities);
      localStorage.setItem('joinedCommunities', JSON.stringify(updatedJoinedCommunities));

      Swal.fire({
        title: 'Success',
        text: `Joined ${communityName} successfully!`,
        icon: 'success',
        timer: 2000
      });

    } catch (error) {
      // Revert optimistic update
      setCommunities(prev => prev.map(community => 
        community.name === communityName 
          ? {
              ...community,
              members: community.members.filter(email => email !== userEmail),
              memberCount: Math.max(0, community.memberCount - 1)
            }
          : community
      ));

      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Failed to join community',
        icon: 'error'
      });
    }
  };

  const handleLeaveCommunity = async (communityName) => {
    if (!userEmail) {
      Swal.fire('Error', 'You must be logged in to leave communities', 'error');
      return;
    }

    try {
      // Optimistic UI update
      setCommunities(prev => prev.map(community => 
        community.name === communityName 
          ? {
              ...community,
              members: community.members.filter(email => email !== userEmail),
              memberCount: Math.max(0, community.memberCount - 1)
            }
          : community
      ));

      const response = await axios.post(
        `/api/communities/${encodeURIComponent(communityName)}/leave`,
        { userEmail }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Update joined communities in state and localStorage
      const updatedJoinedCommunities = joinedCommunities.filter(name => name !== communityName);
      setJoinedCommunities(updatedJoinedCommunities);
      localStorage.setItem('joinedCommunities', JSON.stringify(updatedJoinedCommunities));

      Swal.fire({
        title: 'Success',
        text: `Left ${communityName} successfully!`,
        icon: 'success',
        timer: 2000
      });

    } catch (error) {
      // Revert optimistic update
      setCommunities(prev => prev.map(community => 
        community.name === communityName 
          ? {
              ...community,
              members: [...community.members, userEmail],
              memberCount: community.memberCount + 1
            }
          : community
      ));

      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Failed to leave community',
        icon: 'error'
      });
    }
  };

  const filteredCommunities = communities.filter(community => 
    community.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => b.memberCount - a.memberCount);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading communities...</p>
      </div>
    );
  }

  return (
    <div className="community-explore-container">
      {/* Header Section */}
      <div className="community-header">
        <h1>Discover Communities</h1>
        <p>Connect with like-minded people and share your interests</p>
        
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button 
          className="primary-btn create-btn"
          onClick={() => navigate('/create-community')}
        >
          <FaPlus /> Create Community
        </button>
        <button 
          className="secondary-btn"
          onClick={() => navigate('/create-post')}
        >
          <FaPenAlt /> Create Post
        </button>
      </div>

      <div className="three-column-grid">
        {filteredCommunities.length > 0 ? (
          filteredCommunities.map(community => {
            const isJoined = joinedCommunities.includes(community.name) || 
                           community.members.includes(userEmail);
            
            return (
              <div className="community-card" key={community._id}>
                <div className="card-header">
                  <div 
                    className="community-avatar"
                    style={{ backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}` }}
                  >
                    {community.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="community-info">
                    <h3>{community.name}</h3>
                    <p className="category">{community.category}</p>
                  </div>
                </div>
                
                <p className="description">{community.description}</p>
                
                <div className="community-stats">
                  <span><FaUsers /> {community.memberCount || community.members.length}</span>
                  <span><FaCommentAlt /> {community.postCount || 0}</span>
                </div>
                
                <div className="card-footer">
  {isJoined ? (
    <button
      className="leave-btn"
      onClick={() => handleLeaveCommunity(community.name)}
    >
      <FaSignOutAlt /> Leave
    </button>
  ) : (
    <button
      className="join-btn"
      onClick={() => handleJoinCommunity(community.name)}
      disabled={!userEmail}
    >
      Join
    </button>
  )}
{isJoined && (
  <button 
  className="view-btn"
  onClick={() => navigate(`/communities/${encodeURIComponent(community.name)}`)}
>
  View <FaChevronRight />
</button>

)}

</div>
              </div>
            );
          })
        ) : (
          <div className="no-communities">
            <img src="/images/no-communities.svg" alt="No communities" />
            <h3>No communities found</h3>
            <p>Be the first to create a community in this category</p>
            <button 
              className="primary-btn"
              onClick={() => navigate('/create-community')}
            >
              <FaPlus /> Create Community
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;