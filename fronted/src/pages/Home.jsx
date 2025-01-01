import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import {UserContext} from "../context/UserContext.jsx";

function Home() {
    const { user } = useContext(UserContext);
  return (
      <div className="container text-center mt-5">
          <h1 className="display-4">B&C (toros y vacas)</h1>
          <img
              src="/logo.png"
              alt="Juego de Toros y Vacas"
              className="img-fluid rounded shadow-sm my-3 d-grid gap-2 col-lg-4 col-md-10 mx-auto"

          />
          <p className="lead">¡Pon a prueba tu ingenio en este clásico juego de deducción!</p>
          <div className="d-grid gap-2 col-lg-4 col-md-10 mx-auto">
              {!user &&<><Link to="/login" className="btn btn-primary mb-3">Iniciar Sesión</Link>
                  <Link to="/register" className="btn btn-success mb-3">Registrarse</Link></>}
              <a href="https://github.com/keni2002/bulls_and_cows"  target="_blank" className="btn btn-secondary">
                  <i className="bi bi-github"></i> Contribuir al proyecto
              </a>
          </div>
          <div className="mt-5 col-md-4 mx-auto col-sm-11">
              <h2>Sobre el Juego</h2>
              <p>Toros y vacas es un juego tradicional inglés a lápiz y papel para dos jugadores cuyo objetivo es
                  adivinar un número constituido por cuatro dígitos. Toros y Vacas posiblemente inspiró al conocido
                  juego Mastermind que hizo furor en los años 70 y 80. La diferencia radica en que Toros y Vacas utiliza
                  números sobre el papel en vez de clavitos plásticos de colores sobre un tablero especial de
                  plástico.</p>
              <p>En esta versión del juego...</p>
          </div>
          <div className="mt-5 col-md-4 mx-auto col-sm-11">
              <h2>Cómo Jugar</h2>
              <ul className="list-group text-left">
                  <li className="list-group-item">Paso 1: Regístrate o inicia sesión en tu cuenta.</li>
                  <li className="list-group-item">Paso 2: Inicia un nuevo juego o acepta una solicitud de juego.</li>
                  <li className="list-group-item">Paso 3: Haz tus conjeturas e intenta deducir el número secreto del
                      oponente en partidas.
                  </li>
              </ul>
          </div>
          <div className="mt-5 col-md-4 mx-auto col-sm-11">
              <h2>Sobre la App B&Cgame</h2>
              <p>Detalles sobre la aplicación B&Cgame...</p>
          </div>
          <footer className="mt-5 py-3 bg-light">
              <div className="container">
                  <div className="row">
                      <div className="col-md-6 text-left">
                          <p>&copy; 2024 Yerbis Universes, Inc. Todos los derechos reservados.</p>
                      </div>
                      <div className="col-md-6 text-right">
                          <a href="https://github.com/keni2002/bulls_and_cows" className="text-decoration-none me-3" target="_blank" rel="noopener noreferrer">
                              <i className="bi bi-github"></i> GitHub <i className="bi bi-arrow-right"></i>
                          </a>
                          <a href="https://github.com/keni2002/bulls_and_cows/blob/main/LICENSE" className="text-decoration-none" target="_blank" rel="noopener noreferrer">
                              Licencia <i className="bi bi-arrow-right"></i>
                          </a>
                      </div>
                  </div>
              </div>
          </footer>
      </div>
  );
}

export default Home;
