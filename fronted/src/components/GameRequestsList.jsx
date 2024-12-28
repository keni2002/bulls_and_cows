import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';

function GameRequestsList({ handleShowToast }) {
  const [requests, setRequests] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('api/game/game-requests/');
        setRequests(response.data);
      } catch (error) {
        handleShowToast("Failed to Fetch Requests.");
      }
    };

    fetchRequests();
  }, [handleShowToast]);

  const handleAccept = async (id) => {
    try {
      await api.patch(`/api/requests/${id}/`, { accepted: true });
      setRequests(requests.map(request => request.id === id ? { ...request, accepted: true } : request));
      handleShowToast("Request Accepted.");
    } catch (error) {
      handleShowToast("Failed to Accept Request.");
    }
  };

  return (
    <div>
      <h2>Game Requests</h2>
      {requests.length === 0 ? (
        <p>No game requests available.</p>
      ) : (
        <ul className="list-group">
          {requests.map(request => (
            <li className="list-group-item" key={request.id}>
              <p><strong>Requester:</strong> {request.requester}</p>
              <p><strong>Requestee:</strong> {request.requestee}</p>
              <p><strong>Date:</strong> {new Date(request.created_at).toLocaleString()}</p>
              {request.accepted ? (
                <p className="text-success">Accepted</p>
              ) : (
                <button className="btn btn-primary" onClick={() => handleAccept(request.id)}>Accept</button>
              )}
            </li>
          ))}
        </ul>
      )}
      <Link to="/game-requests" className="btn btn-primary mt-3">Invite to Play</Link>
    </div>
  );
}

export default GameRequestsList;
