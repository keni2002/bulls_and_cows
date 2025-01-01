import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function AcceptRequestForm({ handleShowToast }) {
  const [secretNumber, setSecretNumber] = useState('');
  const [error, setError] = useState('');
  const [request, setRequest] = useState(null);
  const { user } = useContext(UserContext);
  const { requestId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await api.get(`api/game/game-requests/${requestId}/`);
        setRequest(response.data);
      } catch (error) {
        handleShowToast('Error al cargar la solicitud.');
      }
    };

    fetchRequest();
  }, [requestId, handleShowToast]);

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
    if (validateSecret(secretNumber)) {
      try {
        await api.patch(`api/game/game-requests/${requestId}/`, {
          accepted: true,
          player2_secret: secretNumber
        });
        localStorage.setItem("secret", secretNumber)
        handleShowToast('Solicitud aceptada.');
        navigate('/games');
      } catch (error) {
        handleShowToast('Error al aceptar la solicitud.');
      }
    } else {
      setError('Asegúrese de que el número secreto sea válido.');
    }
  };

  if (!request) {
    return <div className="d-flex justify-content-center">Cargando solicitud...</div>;
  }

  return (
    <div className="d-flex justify-content-center">
      <div className="w-100" style={{ maxWidth: '600px' }}>
        <h2>Aceptar Solicitud de Juego</h2>
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="btn btn-primary">Aceptar Solicitud</button>
        </form>
      </div>
    </div>
  );
}

export default AcceptRequestForm;
