import React, { useEffect, useState } from 'react';
import Header from '../Components/Header';
import ChatBot from '../Components/ChatBot';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ username: '', password: '' });
    const [showAddUserForm, setShowAddUserForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [adminPasswordError, setAdminPasswordError] = useState('');

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/users', {
                credentials: 'include'
            });
            const data = await response.json();
            setUsers(data.sort((a, b) => a.id - b.id)); // Sort users by ID
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = async () => {
        if (!newUser.username || !newUser.password) {
            setErrorMessage('Username and password cannot be empty');
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                setNewUser({ username: '', password: '' });
                fetchUsers();
                setShowAddUserForm(false);
                setErrorMessage('');
            } else {
                setErrorMessage(data.error);
                console.error('Error adding user:', data.error);
            }
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const response = await fetch(`http://localhost:8080/api/users/${id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                const data = await response.json();
                if (response.ok) {
                    fetchUsers();
                } else {
                    console.error('Error deleting user:', data.error);
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleChangeUsername = async (id) => {
        const newUsername = prompt("Enter new username:");
        if (newUsername) {
            try {
                const response = await fetch(`http://localhost:8080/api/users/${id}/change-username`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ newUsername }),
                    credentials: 'include'
                });
                const data = await response.json();
                if (response.ok) {
                    fetchUsers(); // Refresh the user list
                } else {
                    console.error('Error changing username:', data.error);
                }
            } catch (error) {
                console.error('Error changing username:', error);
            }
        }
    };

    const handleChangePassword = async (id) => {
        const newPassword = prompt("Enter new password:");
        if (newPassword) {
            try {
                const response = await fetch(`http://localhost:8080/api/users/${id}/change-password`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ newPassword }),
                    credentials: 'include'
                });
                const data = await response.json();
                if (response.ok) {
                    fetchUsers();
                } else {
                    console.error('Error changing password:', data.error);
                }
            } catch (error) {
                console.error('Error changing password:', error);
            }
        }
    };

    const handleChangeAdminPassword = async () => {
        const newPassword = prompt("Enter new admin password:");
        if (newPassword) {
            try {
                const response = await fetch(`http://localhost:8080/api/admin/change-password`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ newPassword }),
                    credentials: 'include'
                });
                const data = await response.json();
                if (response.ok) {
                    setAdminPassword('');
                    setAdminPasswordError('');
                } else {
                    setAdminPasswordError(data.error);
                    console.error('Error changing admin password:', data.error);
                }
            } catch (error) {
                console.error('Error changing admin password:', error);
            }
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Header />
            <div className="admin-panel-content">
                <div className='user-section-wrapper'>
                    <div className="user-list">
                        <h2>User List</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.filter(user => user.username !== 'admin').map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                                            <button onClick={() => handleChangeUsername(user.id)}>Change Username</button>
                                            <button onClick={() => handleChangePassword(user.id)}>Change Password</button>
                                        </td>
                                    </tr>
                                ))}
                                {showAddUserForm && (
                                    <tr>
                                        <td>New</td>
                                        <td>
                                            <input
                                                type="text"
                                                placeholder="Username"
                                                value={newUser.username}
                                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                            />
                                        </td>
                                        <td style={{ display: 'flex', gap: '10px' }}>
                                            <input
                                                type="password"
                                                placeholder="Password"
                                                value={newUser.password}
                                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                            />
                                            <button onClick={handleAddUser}>Add User</button>
                                            <button onClick={() => setShowAddUserForm(false)}>Cancel</button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {!showAddUserForm && (
                            <button className="add-user-button" onClick={() => setShowAddUserForm(true)}>
                                Add New User
                            </button>
                        )}
                    </div>
                </div>
                <div className="other-functions">
                    <h2>Other functions</h2>
                    {adminPasswordError && <p className="error-message">{adminPasswordError}</p>}
                    <button onClick={handleChangeAdminPassword}>Change Admin Password</button>
                </div>
            </div>
            <ChatBot />
        </div>
    );
};

export default AdminPanel;
