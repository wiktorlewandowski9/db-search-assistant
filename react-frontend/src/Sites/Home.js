import React from 'react';
import '../styles.css';
import ChatBot from '../Components/ChatBot';
import Header from '../Components/Header';
import Info from '../Components/Info';

function App() {
  return (
    <div className='Home'>
        <Header/>
        <Info/>
        <ChatBot/>
    </div>
  );
}

export default App;
