import React, { useContext, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function NavbarComponent({ handleShowToast }) {
  const { user, handleLogout } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Función para colapsar el menú
    const handleCollapse = () => {
      const navbarCollapse = document.getElementById('navbarNavAltMarkup');
      if (navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show');
      }
    };

    // Añadir el evento de colapso a todos los enlaces y el botón de logout
    const links = document.querySelectorAll('.nav-link, .dropdown-item');
    links.forEach(link => link.addEventListener('click', handleCollapse));

    return () => {
      links.forEach(link => link.removeEventListener('click', handleCollapse));
    };
  }, []);

  const handleLogoutClick = () => {
    handleLogout();
    handleShowToast("Logout successful!");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      {user && (
        <div className="container-fluid">
          <Link className="navbar-brand" to="/"><img src="/icon.svg" width="30px" alt="icon"/> B&C</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                  aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            {user.photo ? (
              <img src={user.photo} className="rounded-circle" style={{ width: '30px', height: '30px' }} alt="Profile"/>
            ) : (
              <span className="rounded-circle bg-secondary d-inline-block text-center text-white"
                    style={{ width: '30px', height: '30px', lineHeight: '30px' }}>
                {user.name.charAt(0)}
              </span>
            )}{" "}
            <span className="ms-2">{user.name}</span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav me-auto">
              <NavLink className="nav-link" to="/requests">Mis peticiones</NavLink>
              <NavLink className="nav-link" to="/received-requests">Solicitudes</NavLink>
              <NavLink className="nav-link" to="/users">Usuarios</NavLink>
              <NavLink className="nav-link" to="/games">Partidas</NavLink>
            </div>
            <div className="navbar-nav d-lg-none"> {/* Esto se muestra solo en pantallas pequeñas */}
              <NavLink className="nav-link" to="/profile">Mi Perfil</NavLink>
              <NavLink className="nav-link" to="/edit-profile">Editar Perfil</NavLink>
              <NavLink className="nav-link" to="/">Cerrar Sesión</NavLink>

            </div>
            <div className="navbar-nav d-none d-lg-block"> {/* Esto se muestra solo en pantallas grandes */}
              <div className="nav-item dropdown">
                <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="navbarDropdown"
                   role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {user.photo ? (
                    <img src={user.photo} className="rounded-circle" style={{ width: '30px', height: '30px' }} alt="Profile"/>
                  ) : (
                    <span className="rounded-circle bg-secondary d-inline-block text-center text-white"
                          style={{ width: '30px', height: '30px', lineHeight: '30px' }}>
                      {user.name.charAt(0)}
                    </span>
                  )}{" "}
                  <span className="ms-2">{user.name}</span>
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><NavLink className="dropdown-item" to="/profile">Mi Perfil</NavLink></li>
                  <li><hr className="dropdown-divider"/></li>
                  <li><NavLink className="dropdown-item" to="/edit-profile">Editar Perfil</NavLink></li>
                  <li><hr className="dropdown-divider"/></li>
                  <li>
                    <NavLink className="nav-link" to="/">Cerrar Sesión</NavLink>
                  </li>
                </ul>
              </div>
            </div>
            {!user && (
              <NavLink className="nav-link btn btn-outline-primary" to="/login">Login</NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavbarComponent;
