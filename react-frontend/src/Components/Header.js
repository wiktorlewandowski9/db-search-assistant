import React from 'react';
import '../styles.css';
import logo from "../Images/logo.svg";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok) {
        localStorage.removeItem('username');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
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
        <a href="#" onClick={handleLogout} className="logout-button">Logout</a>
      </div>
    </header>
  );
};

export default Header;
