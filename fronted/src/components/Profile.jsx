import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { UserContext } from '../context/UserContext';

function Profile({ handleShowToast }) {
  const [profile, setProfile] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('api/game/users/me/');
        setProfile(response.data);
      } catch (error) {
        handleShowToast('Error al cargar el perfil.');
      }
    };

    fetchProfile();
  }, [handleShowToast]);

  if (!profile) {
    return <div className="d-flex justify-content-center">Cargando perfil...</div>;
  }

  return (
    <div className="d-flex justify-content-center">
      <div className="w-100" style={{ maxWidth: '600px' }}>
        <h2>Perfil</h2>
        <p><strong>Nombre:</strong> {profile.first_name}</p>
        <p><strong>Apellido:</strong> {profile.last_name}</p>
        <p><strong>Correo Electrónico:</strong> {profile.email}</p>
        <p><strong>Juegos Ganados:</strong> {profile.games_won}</p>
      </div>
    </div>
  );
}

export default Profile;
