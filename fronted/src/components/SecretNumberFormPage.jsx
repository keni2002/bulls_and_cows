import React, {useContext, useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import {UserContext} from "../context/UserContext.jsx"; // Asegúrate de importar tu cliente de API

function SecretNumberFormPage({ handleShowToast }) {
  const [secretNumber, setSecretNumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Extraemos el parámetro requesteeId de la URL
  const searchParams = new URLSearchParams(location.search);
  const requesteeId = searchParams.get('requesteeId');

  // Obtener el usuario actual del contexto
  const { user: currentUser } = useContext(UserContext);

  const validateSecret = (secret) => {
    const secretRegex = /^(?!.*(.).*\1)\d{4}$/;
    return secretRegex.test(secret) && !secret.startsWith('0');
  };

  const handleChange = (e) => {
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
        await api.post('api/game/game-requests/', {
          requestee: requesteeId,
          player1_secret: secretNumber,
          requester: currentUser.id
        });
        handleShowToast("Número secreto guardado!");
        navigate('/users');
      } catch (error) {
        handleShowToast("Error al guardar el número secreto.");
      }
    } else {
      setError('El número secreto debe ser de 4 dígitos únicos y no debe comenzar con cero.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-start mt-5">
      <div className="card shadow-sm p-4" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card-body">
          <div className="d-flex align-items-center mb-3">
            <button type="button" className="btn btn-link p-0" onClick={() => navigate("/users")}>
              <i className="bi bi-arrow-left"></i>
            </button>
            <h1 className="ms-2 mb-0">Ingresa tu Número Secreto</h1>
          </div>
          <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
            <input
              type="text"
              value={secretNumber}
              onChange={handleChange}
              placeholder="Número secreto"
              className="form-control mb-2"
            />
            {error && <small className="text-danger">{error}</small>}
            <button type="submit" className="btn btn-primary">Guardar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SecretNumberFormPage;
