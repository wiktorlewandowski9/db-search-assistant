import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Sites/Home';
import Login from './Sites/Login';
import AdminPanel from './Sites/AdminPanel'; // Import the AdminPanel component
import ProtectedRoute from './Utils/ProtectedRoute';
import './styles.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Home />} />
                </Route>
                <Route path="/admin-panel" element={<AdminPanel />} /> {/* Add this line */}
            </Routes>
        </Router>
    );
}

export default App;
