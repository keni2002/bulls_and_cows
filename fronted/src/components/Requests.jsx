import React, { useState, useEffect } from 'react';
import api from "../api";

function Requests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // fetchRequests();
  }, []);

  const fetchRequests = () => {
    api
      .get("/api/requests/")
      .then((res) => res.data)
      .then((data) => setRequests(data))
      .catch((err) => alert(err));
  };

  return (
    <div className="container mt-5">
      <h2>Game Requests</h2>
      <ul className="list-group">
        {requests.map(request => (
          <li className="list-group-item" key={request.id}>
            <p><strong>Requester:</strong> {request.requester}</p>
            <p><strong>Date:</strong> {new Date(request.created_at).toLocaleString()}</p>
            <button className="btn btn-primary">Accept</button>
            <button className="btn btn-danger ms-2">Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Requests;
