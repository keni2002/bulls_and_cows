import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { UserContext } from '../context/UserContext';
import {Link, useNavigate} from 'react-router-dom';
import '../styles/FloatingButton.css';

function GameRequestsList({ handleShowToast }) {
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsersAndRequests = async () => {
      try {
        const usersResponse = await api.get('api/game/users/');
        setUsers(usersResponse.data);

        const requestsResponse = await api.get('api/game/game-requests/');
        const filteredRequests = requestsResponse.data.filter(request => request.requester === user.id);

        const requestsWithUsernames = filteredRequests.map(request => {
          const requestee = usersResponse.data.find(u => u.id === request.requestee);
          return {
            ...request,
            requesteeUsername: requestee ? requestee.username : 'Unknown'
          };
        });

        setRequests(requestsWithUsernames);
      } catch (error) {
        console.log("failed to fetch data");
      }
    };

    fetchUsersAndRequests();
  }, [handleShowToast, user]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`api/game/game-requests/${id}/`);
      setRequests(requests.filter(request => request.id !== id));
      handleShowToast("Request Deleted.");
    } catch (error) {
      handleShowToast("Failed to Delete Request.");
    }
  };

  const handlePlay = async (gameId,requestId) => {
    try {
      await api.patch(`api/game/game-requests/${requestId}/`, { initiated: true });
      handleShowToast("Game Initialized.");
      //delete the request
      await api.delete(`api/game/game-requests/${requestId}/`);
      navigate(`/game/${gameId}`)
    } catch (error) {
      handleShowToast("Failed to Initialize Game.");
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="w-100" style={{ maxWidth: '600px' }}>
        <h2>Your Requests</h2>
        {requests.length === 0 ? (
          <p>No game requests yet.</p>
        ) : (
          <ul className="list-group">
            {requests.map(request => (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={request.id}>
                <div>
                  <p><strong>Invitee:</strong> {request.requesteeUsername}</p>
                  <p><strong>Date:</strong> {new Date(request.created_at).toLocaleString()}</p>
                  {request.accepted ? (
                    <>
                      <p className="text-success">Accepted</p>
                      <button className="btn btn-success" onClick={() => handlePlay(request.game.id,request.id)}>
                        <i className="bi bi-play"></i> Play
                      </button>
                    </>
                  ) : (
                    <p className="text-warning">Pending</p>
                  )}
                </div>
                <button className="btn btn-danger" onClick={() => handleDelete(request.id)}>
                  <i className="bi bi-trash3"></i>
                </button>
              </li>
            ))}
          </ul>
        )}
        <Link to="/game-requests" className="btn btn-primary floating-btn">
          <i className="bi bi-send-plus"></i>
        </Link>
      </div>
    </div>
  );
}

export default GameRequestsList;
