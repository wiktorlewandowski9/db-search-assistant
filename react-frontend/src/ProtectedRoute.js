import React from 'react';
import { Navigate } from 'react-router-dom';

// Sprawdzenie, czy użytkownik jest zalogowany (przykład użycia localStorage)
const isAuthenticated = () => !!localStorage.getItem('authToken');

const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/" />;
    }
    return children;
};

export default ProtectedRoute;
