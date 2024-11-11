import React from 'react';
import './styles.css';
import logo from "./images/logo.svg"

const Header = () => {
  return (
    <header className="header">
      <div className='header-left-side'>
        <img src={logo} alt="Logo"/>
        <p>DB Search Assistant</p>
      </div>
      <div className='header-menu'>
        <a href='http://localhost:3000'>Start</a>
        <a href='https://github.com/wiktorlewandowski9/db-search-assistant'>Github</a>
        <a href='https://github.com/wiktorlewandowski9/db-search-assistant'>User</a>
      </div>
    </header>
  );
};

export default Header;
