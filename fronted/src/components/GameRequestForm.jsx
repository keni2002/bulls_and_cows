import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

function GameRequestForm({ handleShowToast }) {
  const [users, setUsers] = useState([]);
  const [requestee, setRequestee] = useState('');
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('api/game/users/');
        const filteredUsers = response.data.filter(u => u.id !== user.id);
        setUsers(filteredUsers);
      } catch (error) {
        handleShowToast("Failed to Fetch Users.");
      }
    };

    fetchUsers();
  }, [handleShowToast, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('api/game/game-requests/', {
        requester: user.id,
        requestee,
      });
      handleShowToast("Game Request Sent!");
      navigate('/requests');
    } catch (error) {
      handleShowToast("Failed to Send Game Request.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="requestee" className="form-label">Invite User</label>
        <select
          className="form-control"
          id="requestee"
          value={requestee}
          onChange={(e) => setRequestee(e.target.value)}
          required
        >
          <option value="">Select a user</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.username}, Games Won: {user.games_won}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-primary">Send Request</button>
    </form>
  );
}

export default GameRequestForm;
