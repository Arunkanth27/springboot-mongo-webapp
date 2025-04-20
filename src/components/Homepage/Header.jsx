import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../components/Global.css';
import Messaging from '../Chat//Messaging';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Sample data for search suggestions
  const sampleSuggestions = [

  ];

  // Handle search input
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);

    // Filter suggestions based on input
    if (query.trim()) {
      const filtered = sampleSuggestions.filter((item) =>
        item.toLowerCase().includes(query)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]); // Clear suggestions if input is empty
    }
  };

  return (
    <header className="header">
      {/* Left Section - Logo */}
      <div className="header__left">
        <h2 className="header__logo">Infintech</h2>
      </div>

      {/* Center Section - Search Bar */}
      <div className="header__center">
        <div className="header__search">
          <input
            type="text"
            placeholder="Search..."
            className="header__search-input"
            value={searchTerm}
            onChange={handleSearch}
          />
          <i className="fas fa-search header__search-icon"></i>
          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <ul className="header__suggestions">
              {suggestions.map((item, index) => (
                <li key={index} className="header__suggestion-item">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right Section - Navigation */}
      <nav className="header__right">
        <Link to="/feed" className="header__link">Home</Link>
        <Link to="/communities" className="header__link">Communities</Link>
        <Link to="/opportunity" className="header__link">Projects</Link>
        <Link to="/notifications" className="header__link">Notifications</Link>
        <Link to="/profile" className="header__link">Profile</Link>
        <Messaging/>
      </nav>
    </header>
  );
};

export default Header;
