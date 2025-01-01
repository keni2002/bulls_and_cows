import React, { useState, useEffect, useContext } from 'react';
import Confetti from 'react-confetti';
import api from '../api';
import { UserContext } from '../context/UserContext';
import { useParams, useNavigate, Link } from 'react-router-dom';

function Game({ handleShowToast }) {
  const { gameId } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [secret, setSecret] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await api.get(`/api/game/games/${gameId}/`);
        setGame(response.data);
        fetchGuesses(gameId);
        setLoading(false);
      } catch (error) {
        setErrors({ fetch: error.response.data.detail });
        navigate('/');
      }
    };

    const fetchGuesses = async (gameId) => {
      try {
        const response = await api.get(`/api/game/games/${gameId}/guesses/`);
        setGuesses(response.data);
        setSecret(localStorage.getItem("secret"));
      } catch (error) {
        setErrors({ fetch: error.response.data.detail });
      }
    };

    fetchGame();
  }, [gameId, navigate, refresh]);

  useEffect(() => {
    if (game && game.winner === user.id) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  }, [game]);

  const handleGuess = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/game/guesses/', {
        game: gameId,
        guess,
      });
      setGuess('');
      setErrors({}); // Resetear errores al enviar un intento exitoso
      setRefresh(prev => !prev); // Forzar actualización cambiando el valor de refresh
    } catch (error) {
      setErrors({ guess: error.response.data.detail });
    }
  };

  const handleInputChange = (e) => {
    setGuess(e.target.value);
    if (errors.guess) {
      setErrors({ ...errors, guess: '' }); // Limpiar error de intento al cambiar el input
    }
  };

  if (loading) return <p>Loading game...</p>;
  if (errors.fetch) return <p className="text-danger">{errors.fetch}</p>;

  const userGuesses = guesses.filter(g => g.player === user.id);
  const opponentGuesses = guesses.filter(g => g.player !== user.id);

  return (
    <div className="d-flex justify-content-center">
      {showConfetti && <Confetti />}
      <div className="w-100" style={{ maxWidth: '600px' }}>
        {!game.winner ? (
          <>
            <h2>Partida Número {game.id}</h2>
            <div className="d-inline-flex">
              <div>
                <p><strong>Oponente:</strong> {game.opponent_name}</p>
                <p><strong>Estado:</strong> {game.active ? 'Activo' : 'Finalizado'}</p>
              </div>
            </div>
            {!game.winner && (
              <form onSubmit={handleGuess} className="w-auto w-100">
                <div className="mb-3 w-100">
                  <label htmlFor="guess" className="form-label w-100">Ingrese un intento</label>
                  <input
                    type="text"
                    className="form-control"
                    id="guess"
                    value={guess}
                    onChange={handleInputChange} // Utilizamos la nueva función para manejar cambios
                    required
                  />
                  {errors.guess && <p className="text-danger">{errors.guess}</p>}
                </div>
                <button type="submit" className="btn btn-primary">Subir intento</button>
              </form>
            )}
          </>
        ) : (
          <>
            {user.id !== game.winner ? (
              <div className="alert alert-danger mt-3 text-center">
                <i className="bi bi-emoji-frown-fill display-1 text-danger"></i>
                <h2 className="text-danger mt-2">{`Lo siento ${user?.name}, esta vez no fue tu día.`}</h2>
                <p>No te preocupes, siempre hay una próxima vez para demostrar tu ingenio.</p>
                <Link to="/games" className="btn btn-outline-danger mt-3">Ver otros juegos</Link>
              </div>
            ) : (
              <div className="alert alert-success mt-3 text-center">
                <i className="bi bi-emoji-laughing display-1 text-success"></i>
                <h2 className="text-success mt-2">{`¡Felicidades ${user?.name}! ¡Ganaste este juego!`}</h2>
                <p>Tu ingenio ha sido demostrado. ¡Sigue así!</p>
                <Link to="/games" className="btn btn-outline-success mt-3">Ver otros juegos</Link>
              </div>
            )}
            <div className="mt-3">
              <h4>Detalles del Juego</h4>
              <p><strong>Número del juego:</strong> {game.id}</p>
              <p><strong>Oponente:</strong> {game.opponent_name}</p>
              <p><strong>Tu número:</strong> {game.my_secret}</p>
              <p><strong>Número del oponente:</strong> {game.opponent_secret}</p>
            </div>
          </>
        )}

        <div className="accordion mt-3" id="accordionExample">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne"
                aria-expanded="true" aria-controls="collapseOne">
                Mis intentos ({userGuesses.length})
              </button>
            </h2>
            <div id="collapseOne" className={`accordion-collapse collapse ${game.winner ? "" : "show"}`} aria-labelledby="headingOne"
              data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <ul className="list-group">
                  {userGuesses.map(g => (
                    <li className="list-group-item" key={g.id}>
                      <p><strong>Intento:</strong> {g.guess}</p>
                      <p><strong>Toros:</strong> {g.bulls}</p>
                      <p><strong>Vacas:</strong> {g.cows}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingTwo">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded={"true"} aria-controls="collapseTwo">
                Intentos del oponente ({opponentGuesses.length})
              </button>
            </h2>
            <div id="collapseTwo" className={`accordion-collapse collapse ${game.winner ? "show" : ""}`} aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <p><strong>mi secreto:</strong> {secret}</p> {/* Mostrar el número secreto */}
                <ul className="list-group">
                  {opponentGuesses.map(g => (
                    <li className="list-group-item" key={g.id}>
                      <p><strong>Intento:</strong> {g.guess}</p>
                      <p><strong>Toros:</strong> {g.bulls}</p>
                      <p><strong>Vacas:</strong> {g.cows}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
