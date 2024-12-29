import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

function ReceivedRequestsList({ handleShowToast }) {
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [player2Secret, setPlayer2Secret] = useState('');
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsersAndRequests = async () => {
      try {
        const usersResponse = await api.get('api/game/users/');
        setUsers(usersResponse.data);

        const requestsResponse = await api.get('api/game/game-requests/');
        const filteredRequests = requestsResponse.data.filter(request => request.requestee === user.id);

        const requestsWithUsernames = filteredRequests.map(request => {
          const requester = usersResponse.data.find(u => u.id === request.requester);
          return {
            ...request,
            requesterUsername: requester ? requester.username : 'Unknown'
          };
        });

        setRequests(requestsWithUsernames);
      } catch (error) {
        handleShowToast("Failed to Fetch Data.");
      }
    };

    fetchUsersAndRequests();
  }, [handleShowToast, user]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`api/game/game-requests/${id}/`);
      setRequests(requests.filter(request => request.id !== id));
      handleShowToast("Request Rejected.");
    } catch (error) {
      handleShowToast("Failed to Reject Request.");
    }
  };

  const handleAccept = async (request) => {
    try {
      await api.patch(`api/game/game-requests/${request.id}/`, {
        accepted: true,
        player2_secret: player2Secret,
      });
      handleShowToast("Game Started.");
      navigate(`/game/${request.game.id}`);
    } catch (error) {
      handleShowToast("Failed to Start Game.");
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="w-100" style={{ maxWidth: '600px' }}>
        <h2>Received Requests</h2>
        {requests.length === 0 ? (
          <p>No game requests yet.</p>
        ) : (
          <ul className="list-group">
            {requests.map(request => (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={request.id}>
                <div>
                  <p><strong>Requester:</strong> {request.requesterUsername}</p>
                  <p><strong>Date:</strong> {new Date(request.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Your Secret Number"
                    value={player2Secret}
                    onChange={(e) => setPlayer2Secret(e.target.value)}
                    required
                  />
                  <button className="btn btn-success me-2" onClick={() => handleAccept(request)}>
                    <i className="bi bi-play"></i>
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(request.id)}>
                    <i className="bi bi-trash3"></i>
                  </button>
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
