import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

function EditProfile({ handleShowToast }) {
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('api/game/users/me/');
        setProfile({
          first_name: response.data.first_name || '',
          last_name: response.data.last_name || '',
          email: response.data.email || ''
        });
      } catch (error) {
        handleShowToast('Error al cargar el perfil.');
      }
    };

    fetchProfile();
  }, [handleShowToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch('api/game/users/me/', profile);
      handleShowToast('Perfil actualizado.');
      navigate('/profile');  // Redirigir después de actualizar el perfil
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="w-100" style={{ maxWidth: '600px' }}>
        <h2>Editar Perfil</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="first_name" className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              id="first_name"
              name="first_name"
              value={profile.first_name}
              onChange={handleChange}
              required
            />
            {errors.first_name && <div className="text-danger">{errors.first_name}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="last_name" className="form-label">Apellido</label>
            <input
              type="text"
              className="form-control"
              id="last_name"
              name="last_name"
              value={profile.last_name}
              onChange={handleChange}
              required
            />
            {errors.last_name && <div className="text-danger">{errors.last_name}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo Electrónico(
              <em className="text-warning">El email, será público</em>
              )</label>

            <input
                type="email"
              className="form-control"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleChange}

            />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>
          <button type="submit" className="btn btn-primary">Guardar Cambios</button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
