import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaHashtag, FaLock, FaGlobe, FaPlus, FaTimes } from 'react-icons/fa';
import '../../components/Global.css';

const CreateCommunityPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    category: 'Technology',
    tags: ''
  });
  const [tagList, setTagList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'Technology', 'Science', 'Arts', 'Business',
    'Health', 'Sports', 'Gaming', 'Education'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddTag = () => {
    const trimmedTag = formData.tags.trim();
    if (trimmedTag && !tagList.includes(trimmedTag)) {
      setTagList([...tagList, trimmedTag]);
      setFormData(prev => ({ ...prev, tags: '' }));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTagList(tagList.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && formData.tags.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        Swal.fire('Error', 'You need to be logged in to create a community', 'error');
        navigate('/login');
        return;
      }
  
      const communityData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        isPrivate: formData.isPrivate,
        category: formData.category,
        tags: tagList,
        createdBy: user.email
      };
  
      const response = await axios.post('/api/communities', communityData);
      
      Swal.fire({
        title: 'Community Created!',
        text: 'Your community is now live!',
        icon: 'success',
        showConfirmButton: false,
        timer: 2000,
        background: '#1a1a1a',
        color: '#fff'
      }).then(() => {
        navigate(`/community/${response.data.community.name}`);
      });
    } catch (error) {
      Swal.fire({
        title: 'Creation Failed',
        text: error.response?.data?.message || 'Failed to create community',
        icon: 'error',
        background: '#1a1a1a',
        color: '#fff'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="community-creation-container">
      <div className="creation-header">
        <h1>Build Your Community</h1>
        <p>Bring people together around shared interests</p>
      </div>

      <div className="creation-card">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <label className="form-label">
              <span>Community Name</span>
              <span className="required">*</span>
            </label>
            <div className="input-with-icon">
              <FaHashtag className="input-icon" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
                minLength="3"
                maxLength="50"
                placeholder="e.g. React Developers"
              />
            </div>
            <div className="character-count">
              {formData.name.length}/50
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">
              <span>Description</span>
              <span className="required">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              required
              minLength="10"
              maxLength="500"
              placeholder="Tell people what your community is about..."
              rows="4"
            />
            <div className="character-count">
              {formData.description.length}/500
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="form-section">
            <label className="form-label">
              <span>Tags</span>
              <span className="required">*</span>
            </label>
            <div className="tags-input-container">
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="tags-input"
                placeholder="Add tags (press Enter)"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="add-tag-button"
                disabled={!formData.tags.trim()}
              >
                <FaPlus />
              </button>
            </div>
            
            <div className="selected-tags">
              {tagList.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button 
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="remove-tag"
                  >
                    <FaTimes />
                  </button>
                </span>
              ))}
            </div>
            <div className="hint">Add 3-5 tags to help people find your community</div>
          </div>

          <div className="form-section privacy-section">
            <label className="privacy-toggle">
              <input
                type="checkbox"
                name="isPrivate"
                checked={formData.isPrivate}
                onChange={handleChange}
                className="toggle-input"
              />
              <span className="toggle-slider"></span>
              <span className="privacy-label">
                {formData.isPrivate ? (
                  <>
                    <FaLock /> Private Community
                  </>
                ) : (
                  <>
                    <FaGlobe /> Public Community
                  </>
                )}
              </span>
            </label>
            <div className="privacy-description">
              {formData.isPrivate
                ? "New members require approval to join"
                : "Anyone can view and join this community"}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading || !formData.name || !formData.description || tagList.length < 1}
            >
              {isLoading ? (
                <span className="spinner"></span>
              ) : (
                'Create Community'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunityPage;