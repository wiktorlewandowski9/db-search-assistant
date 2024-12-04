import React from 'react';
import '../styles.css';
import logo from "../Images/logo.svg";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <header className="header">
      <a href='http://localhost:3000' className='header-left-side'>
        <img src={logo} alt="Logo" />
        <p>DB Search Assistant</p>
      </a>

      <div className='header-menu'>
        <a href='http://localhost:3000'>Start</a>
        <a href='https://github.com/wiktorlewandowski9/db-search-assistant'>Github</a>
        {username ? (
          <>
            <span>Welcome, {username}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <a href='https://github.com/wiktorlewandowski9/db-search-assistant'>User</a>
        )}
      </div>
    </header>
  );
};

export default Header;
