import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/protected', {
                    method: 'GET',
                    credentials: 'include',
                });

                setIsAuthenticated(response.ok);
            } catch (error) {
                console.error('Authentication check failed:', error);
                setIsAuthenticated(false);
            }
        };

        verifyAuth();
    }, []);

    if (isAuthenticated === null) {
        return <p>Loading...</p>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
