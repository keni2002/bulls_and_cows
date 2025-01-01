import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

function GameRequestForm({ handleShowToast }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [secretNumber, setSecretNumber] = useState('');
  const [error, setError] = useState('');
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('api/game/users/');
        // Excluir al usuario actual de la lista
        const filteredUsers = response.data.filter(u => u.id !== user.id);
        setUsers(filteredUsers);
      } catch (error) {
        handleShowToast('Error al cargar los usuarios.');
      }
    };

    fetchUsers();
  }, [handleShowToast, user]);

  const validateSecret = (secret) => {
    const secretRegex = /^(?!.*(.).*\1)\d{4}$/;
    return secretRegex.test(secret) && !secret.startsWith('0');
  };

  const handleSecretChange = (e) => {
    const secret = e.target.value;
    if (validateSecret(secret)) {
      setError('');
    } else {
      setError('El número secreto debe ser de 4 dígitos únicos y no debe comenzar con cero.');
    }
    setSecretNumber(secret);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateSecret(secretNumber) && selectedUser) {
      try {
        await api.post('api/game/game-requests/', {
          requestee: selectedUser,
          requester: user.id,
          player1_secret: secretNumber
        });
        localStorage.setItem("secret", secretNumber)
        handleShowToast('Solicitud de juego enviada.');
        navigate('/requests');
      } catch (error) {
        handleShowToast('Error al enviar la solicitud.');
      }
    } else {
      setError('Asegúrese de que el número secreto sea válido y haya seleccionado un usuario.');
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="w-100" style={{ maxWidth: '600px' }}>
        <h2>Crear Solicitud de Juego</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="userSelect" className="form-label">Seleccionar usuario</label>
            <select
              className="form-select"
              id="userSelect"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
            >
              <option value="">Seleccione un usuario</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.username}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="secretNumber" className="form-label">Número Secreto</label>
            <input
              type="text"
              className="form-control"
              id="secretNumber"
              value={secretNumber}
              onChange={handleSecretChange}
              required
            />
            {error && <div className="text-danger">{error}</div>}
          </div>
          <button type="submit" className="btn btn-primary">Enviar Solicitud</button>
        </form>
      </div>
    </div>
  );
}

export default GameRequestForm;
