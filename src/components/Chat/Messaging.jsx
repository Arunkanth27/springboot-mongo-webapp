import React from 'react';
import { useNavigate } from 'react-router-dom';

const Messaging = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/chat'); // Navigate to the chat page on button click
  };

  return (
    <div className="messaging">
      <button className="messaging__button" onClick={handleButtonClick}>
        <i className="fas fa-comments"></i> discussions
      </button>
    </div>
  );
};

export default Messaging;
