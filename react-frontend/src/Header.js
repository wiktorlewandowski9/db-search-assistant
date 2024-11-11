import React from 'react';
import './styles.css';
import logo from "./images/logo-cropped.svg"

const Header = () => {
  return (
    <header className="header">
      <img src={logo} alt="Logo"/>
      <div className='header-menu'>
        <a href='https://github.com/wiktorlewandowski9/db-search-assistant'>Start</a>
        <a href='https://github.com/wiktorlewandowski9/db-search-assistant'>Github</a>
        <a href='https://github.com/wiktorlewandowski9/db-search-assistant'>User</a>
      </div>
    </header>
  );
};

export default Header;
