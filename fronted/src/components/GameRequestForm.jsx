import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import {ACCESS_TOKEN} from "../constants.js";

function GameRequestForm({ handleShowToast }) {
  const [users, setUsers] = useState([]);
  const [requestee, setRequestee] = useState('');
  const [player1Secret, setPlayer1Secret] = useState('');
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('api/game/users/');
        const filteredUsers = response.data.filter(u => u.id !== user.id);
        setUsers(filteredUsers);
      } catch (error) {

      }
    };

    fetchUsers();
  }, [handleShowToast, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('api/game/game-requests/', {
        requestee,
        player1_secret: player1Secret,
        requester: user.id
      });
      localStorage.setItem("secret", player1Secret)
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
              {user.username}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="player1Secret" className="form-label">Your Secret Number</label>
        <input
          type="text"
          className="form-control"
          id="player1Secret"
          value={player1Secret}
          onChange={(e) => setPlayer1Secret(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">Send Request</button>
    </form>
  );
}

export default GameRequestForm;
