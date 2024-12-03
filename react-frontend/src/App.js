import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatBot from './ChatBot';
import Header from './Header';
import Info from './Info';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import './styles.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/app" 
          element={
            <ProtectedRoute>
              <div className="App">
                <Header />
                <Info />
                <ChatBot />
              </div>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
