import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function NavbarComponent({ handleShowToast }) {
  const { user, handleLogout } = useContext(UserContext);
  const navigate = useNavigate();
  const handleLogoutClick = () => {
    handleLogout();
    handleShowToast("Logout successful!");
    navigate("/")
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      { user && <div className="container-fluid">

        <Link className="navbar-brand" to="/"><img src="/icon.svg" width="30px"/>   B&C</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          {user.photo ? (
              <img src={user.photo} className="rounded-circle" style={{width: '30px', height: '30px'}}
                   alt="Profile"/>
          ) : (
              <span className="rounded-circle bg-secondary d-inline-block text-center text-white"
                    style={{width: '30px', height: '30px', lineHeight: '30px'}}>
                      {user.name.charAt(0)}
                    </span>
          )}{" "}
          <span className="ms-2">{user.name}</span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav me-auto">
            {user && (
                <>
                  <NavLink className="nav-link" to="/requests">Mis peticiones</NavLink>
                  <NavLink className="nav-link" to="/received-requests">Solicitudes</NavLink>
                  <NavLink className="nav-link" to="/users">Usuarios</NavLink>
                  {/*<NavLink className="nav-link" to="/notes">Notes</NavLink>*/}
                  <NavLink className="nav-link" to="/games">Partidas</NavLink>
                </>
            )}
          </div>
          <div className="navbar-nav">
            {user ? (
                <div className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="navbarDropdown"
                     role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {user.photo ? (
                        <img src={user.photo} className="rounded-circle" style={{width: '30px', height: '30px'}}
                             alt="Profile"/>
                    ) : (
                        <span className="rounded-circle bg-secondary d-inline-block text-center text-white"
                              style={{width: '30px', height: '30px', lineHeight: '30px'}}>
                      {user.name.charAt(0)}
                    </span>
                    )}{" "}
                    <span className="ms-2">{user.name}</span>
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><NavLink className="dropdown-item" to="/profile">Mi Perfil</NavLink></li>
                    <li>
                      <hr className="dropdown-divider"/>
                    </li>
                    <li><NavLink className="dropdown-item" to="/edit-profile">Editar Perfil</NavLink></li>
                    <li>
                      <hr className="dropdown-divider"/>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogoutClick}>Logout</button>
                    </li>
                  </ul>
                </div>
            ) : (
                <NavLink className="nav-link btn btn-outline-primary" to="/login">Login</NavLink>
            )}
          </div>
        </div>
      </div>}
    </nav>
  );
}

export default NavbarComponent;
