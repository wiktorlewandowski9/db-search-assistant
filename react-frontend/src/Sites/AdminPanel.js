import React, { useEffect, useState } from 'react';
import Header from '../Components/Header';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ username: '', password: '' });
    const [showAddUserForm, setShowAddUserForm] = useState(false);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/users', {
                credentials: 'include'
            });
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });
            const data = await response.json();
            if (response.ok) {
                setNewUser({ username: '', password: '' });
                fetchUsers(); // Refresh the user list
                setShowAddUserForm(false); // Hide the form after adding user
            } else {
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

    return (
        <div>
            <Header/>
            <div className="admin-panel-content">
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
                        </tbody>
                    </table>
                </div>
                <div className={`add-user-form ${showAddUserForm ? '' : 'hidden'}`}>
                    <h1>Add User</h1>
                    <input
                        type="text"
                        placeholder="Username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                    <button onClick={handleAddUser}>Add User</button>
                </div>
                <button className="add-user-button" onClick={() => setShowAddUserForm(!showAddUserForm)}>
                    {showAddUserForm ? 'Cancel' : 'Add New User'}
                </button>
            </div>
        </div>
    );
};

export default AdminPanel;
