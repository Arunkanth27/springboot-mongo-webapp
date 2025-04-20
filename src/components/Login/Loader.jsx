import React from 'react';
import '../../components/Global.css';

const Loader = ({ message }) => {
  return (
    <div className="loader-overlay">
      <div className="loader">
        <div className="spinner" />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Loader;
