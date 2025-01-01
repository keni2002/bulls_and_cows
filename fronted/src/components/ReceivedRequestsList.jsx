import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

function ReceivedRequestsList({ handleShowToast }) {
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsersAndRequests = async () => {
      try {
        const usersResponse = await api.get('api/game/users/');
        setUsers(usersResponse.data);

        const requestsResponse = await api.get('api/game/game-requests/');
        // Filtrar solicitudes por requestee, initiated false y accepted false
        const filteredRequests = requestsResponse.data.filter(request => request.requestee === user.id && !request.initiated && !request.accepted);

        const requestsWithUsernames = filteredRequests.map(request => {
          const requester = usersResponse.data.find(u => u.id === request.requester);
          return {
            ...request,
            requesterUsername: requester ? requester.username : 'Unknown'
          };
        });

        setRequests(requestsWithUsernames);
      } catch (error) {
        setErrors({ fetch: error.response.data.detail });
      }
    };

    fetchUsersAndRequests();
  }, [handleShowToast, user]);

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar esta solicitud? Esto también eliminará el juego asociado.")) {
      try {
        await api.delete(`api/game/game-requests/${id}/`);
        setRequests(requests.filter(request => request.id !== id));
        handleShowToast("Request Rejected.");
      } catch (error) {
        setErrors({ delete: error.response.data.detail });
      }
    }
  };

  const handleAcceptRedirect = (requestId) => {
    navigate(`/accept-request/${requestId}`);
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="w-100" style={{ maxWidth: '600px' }}>
        <h2>Solicitudes</h2>
        {errors.fetch && <p className="text-danger">{errors.fetch}</p>}
        {requests.length === 0 ? (
          <p>Parece que nadie te ha invitado a jugar</p>
        ) : (
          <ul className="list-group">
            {requests.map(request => (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={request.id}>
                <div>
                  <p><strong>Solicitante:</strong> {request.requesterUsername}</p>
                  <p><strong>Fecha:</strong> {new Date(request.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <button className="btn btn-success me-2" onClick={() => handleAcceptRedirect(request.id)}>
                    <i className="bi bi-play"></i> Aceptar
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(request.id)}>
                    <i className="bi bi-trash3"></i> Rechazar
                  </button>
                  {errors.delete && <p className="text-danger">{errors.delete}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ReceivedRequestsList;
