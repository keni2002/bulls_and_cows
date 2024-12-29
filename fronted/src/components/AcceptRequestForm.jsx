import React, { useState, useContext } from 'react';
import api from '../api';
import { UserContext } from '../context/UserContext';
import { useParams, useNavigate } from 'react-router-dom';

function AcceptRequestForm({ handleShowToast }) {
  const { requestId } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [player2Secret, setPlayer2Secret] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.patch(`/api/game/game-requests/${requestId}/`, {
        accepted: true,
        player2_secret: player2Secret,
      });
      const { game } = response.data;
      handleShowToast("Game Started.");
      navigate(`/game/${game.id}`);
    } catch (error) {
      setErrors({ submit: error.response.data.detail });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex justify-content-center">
      <div className="w-100" style={{ maxWidth: '600px' }}>
        <h2>Accept Game Request</h2>
        <div className="mb-3">
          <label htmlFor="player2Secret" className="form-label">Your Secret Number</label>
          <input
            type="text"
            className="form-control"
            id="player2Secret"
            value={player2Secret}
            onChange={(e) => setPlayer2Secret(e.target.value)}
            required
          />
          {errors.submit && <p className="text-danger">{errors.submit}</p>}
        </div>
        <button type="submit" className="btn btn-primary">Accept</button>
      </div>
    </form>
  );
}

export default AcceptRequestForm;
