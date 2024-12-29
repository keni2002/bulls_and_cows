import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { UserContext } from '../context/UserContext';

function UserList({ handleShowToast }) {
  const [users, setUsers] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('api/game/users/');
        // Excluir al usuario actual
        const filteredUsers = response.data.filter(u => u.id !== user.id);
        setUsers(filteredUsers);
      } catch (error) {

      }
    };

    fetchUsers();
  }, [handleShowToast, user]);

  const handleInvite = async (requesteeId) => {
    try {
      const response = await api.post('/api/game/game-requests/', { requestee: requesteeId });
      handleShowToast("Invitation Sent!");
    } catch (error) {
      handleShowToast("Failed to Send Invitation.");
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="w-100" style={{ maxWidth: '800px' }}>
        <h2>Users</h2>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <ul className="list-group">
            {users.map(user => (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={user.id}>
                  <div>
                      <p><strong>Username:</strong> {user.username}</p>
                      <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Games Won:</strong> {user.games_won}</p>
                  </div>
                  <button className="btn btn-primary" onClick={() => handleInvite(user.id)}>
                  Invite to Play
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default UserList;
