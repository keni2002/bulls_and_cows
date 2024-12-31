import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { UserContext } from '../context/UserContext';
import {useNavigate} from "react-router-dom";

function UserList({ handleShowToast }) {
  const [users, setUsers] = useState([]);
  const { user: currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('api/game/users/');
        // Excluir al usuario actual
        const filteredUsers = response.data.filter(u => u.id !== currentUser.id);
        setUsers(filteredUsers);
      } catch (error) {
        handleShowToast("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, [handleShowToast, currentUser]);

  const handleInvite = (userId) => {
    navigate(`/secret-number?requesteeId=${userId}`);
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="w-100" style={{ maxWidth: '800px' }}>
        <h2>Usuarios</h2>
        {users.length === 0 ? (
          <p>No se encontraron usuarios.</p>
        ) : (
          <ul className="list-group">
            {users.map(u => (
              <li className="list-group-item d-flex flex-column" key={u.id}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p><strong>Nombre de usuario:</strong> {u.username}</p>
                    <p><strong>Nombre:</strong> {u.first_name} {u.last_name}</p>
                    <p><strong>Email:</strong> {u.email}</p>
                    <p><strong>Juegos ganados:</strong> {u.games_won}</p>
                  </div>
                  <button className="btn btn-primary" onClick={() => handleInvite(u.id)}>
                    Invitar a jugar
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

export default UserList;
