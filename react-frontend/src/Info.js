import React from 'react';
import './styles.css';
import chat_icon from './images/chat-icon.png';

const Header = () => {
  return (
    <div className='info-container'>
      <div>
        <img src={chat_icon} alt='icon of message' className='info-image'></img>
        <p>Please type what you want to search from database</p>
      </div>
      <div>
        <img src={chat_icon} alt='icon of message' className='info-image'></img>
        <p>Your message will be processed by our AI model</p>
      </div>
      <div>
        <img src={chat_icon} alt='icon of message' className='info-image'></img>
        <p>Browse generated result. Have fun!</p>
      </div>
    </div>
  );
};

export default Header;
