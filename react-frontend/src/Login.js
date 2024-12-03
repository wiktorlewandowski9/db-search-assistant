import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // (Just for tests) TODO
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        if (username === 'admin' && password === 'password') {
            localStorage.setItem('authToken', 'dummyToken12345');
            navigate('/app');
        } else {
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="login-container">
            <h1>Sign in</h1>
            <form onSubmit={handleLogin} className="login-form">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="error-message">{error}</p>}
                <button type="submit">Sign in</button>
            </form>
        </div>
    );
};

export default Login;
