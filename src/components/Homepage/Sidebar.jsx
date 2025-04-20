import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../Login/AuthContext'; // Import useAuth to check if user is logged in
import '../../components/Global.css';


const Sidebar = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false); // Start with sidebar hidden
  const navigate = useNavigate(); // Initialize navigate hook
  const { logout } = useAuth(); // Assuming useAuth provides a logout function

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  // Function to handle log out
  const handleLogout = () => {
    logout(); // Call the logout function (clears user state)
    navigate('/login'); // Navigate to the login page
  };


  return (
    <>
      {/* Button to open Sidebar */}
      {!isSidebarVisible && (
        <div className="sidebar__open-btn" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i> {/* Hamburger icon to open sidebar */}
        </div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarVisible ? 'sidebar--visible' : 'sidebar--hidden'}`}>
        {/* Close Button */}
        <div className="sidebar__close-btn" onClick={toggleSidebar}>
          <i className="fas fa-times"></i> {/* "X" icon */}
        </div>

        {/* Company Logo */}
        <div className="sidebar__logo">
          {/* Optional: Add your company logo here */}
        </div>

        {/* Navigation Links */}
        <ul className="sidebar__nav">
          <li className="sidebar__nav-item">
            <NavLink to="/feed" activeClassName="sidebar__link--active" className="sidebar__link">
              <i className="fas fa-home"></i>
              Home
            </NavLink>
          </li>
          <li className="sidebar__nav-item">
            <NavLink to="/create-post" activeClassName="sidebar__link--active" className="sidebar__link">
              <i className="fas fa-edit"></i>
              Post a Query
            </NavLink>
          </li>
          <li className="sidebar__nav-item">
            <NavLink to="/explore" activeClassName="sidebar__link--active" className="sidebar__link">
              <i className="fas fa-compass"></i>
              Explore
            </NavLink>
          </li>
          <li className="sidebar__nav-item">
            <NavLink to="/chat" activeClassName="sidebar__link--active" className="sidebar__link">
              <i className="fas fa-envelope"></i>
              Messages
            </NavLink>
          </li>
          <li className="sidebar__nav-item">
            <NavLink to="/communities" activeClassName="sidebar__link--active" className="sidebar__link">
              <i className="fas fa-users"></i>
              Community Feed
            </NavLink>
          </li>
          <li className="sidebar__nav-item">
            <NavLink to="/activity" activeClassName="sidebar__link--active" className="sidebar__link">
              <i className="fas fa-book"></i>
              Activity
            </NavLink>
          </li>
        </ul>

        {/* Tips Section */}
        <div className="sidebar__tips">
          <h4>Tips & Tricks</h4>
          <p>Head on over to our website to get the latest tips & tricks!</p>
          <button className="sidebar__learn-more">Learn More</button>
        </div>

        {/* User Info */}
        <div className="sidebar__user">
          <button className="sidebar__logout-btn" onClick={handleLogout}> {/* Log Out button */}
            <i className="fas fa-user-circle"></i> Log Out
          </button>
        </div>
      </div>
    </>
  );
};


export default Sidebar;
