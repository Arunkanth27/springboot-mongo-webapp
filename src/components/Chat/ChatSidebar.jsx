import React from "react";
import "../../components/Global.css";
import { FaCog, FaLock, FaHome, FaCreditCard, FaSignOutAlt } from 'react-icons/fa';  // Updated icons

const ChatSidebar = ({ contacts, setActiveChatId, search, setSearch }) => {
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="chat-sidebar">
      {/* Left Panel with icons for settings, privacy, home, payment, exit */}
      <div className="sidebar-options">
        <button>
          <FaHome className="icon" />
        </button>
        <button>
          <FaCreditCard className="icon" />
        </button>
        <button>
          <FaSignOutAlt className="icon" />
        </button>
        <button>
          <FaCog className="icon" />
        </button>
        <button>
          <FaLock className="icon" />
        </button>
      </div>

      {/* Main Section */}
      <div className="main-section">
        {/* Discussion Header */}
        <h3>Discussion</h3>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Chat List */}
        <ul className="chat-list">
          {filteredContacts.map((contact) => (
            <li key={contact.id} onClick={() => setActiveChatId(contact.id)}>
              <img src={contact.avatar} alt={contact.name} className="avatar" />
              <div className="contact-info">
                <strong>{contact.name}</strong>
                <p>{contact.status}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatSidebar;
