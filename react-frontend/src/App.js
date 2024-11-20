import React from 'react';
import ChatBot from './ChatBot';
import './styles.css';
import Header from './Header';
import Info from './Info'

function App() {
  return (
    <div className="App">
      <Header />
      <Info />
      <ChatBot />
    </div>
  );
}

export default App;
