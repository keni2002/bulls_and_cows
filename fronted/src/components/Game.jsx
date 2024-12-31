import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { UserContext } from '../context/UserContext';
import {useParams, useNavigate, Link} from 'react-router-dom';

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
  const [secret,setSecret] = useState('')

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
        setSecret(localStorage.getItem("secret"))
      } catch (error) {
        setErrors({ fetch: error.response.data.detail });
      }
    };

    fetchGame();
  }, [gameId, navigate, refresh]);

  const handleGuess = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/game/guesses/', {
        game: gameId,
        guess,
      });
      setGuess('');
      setRefresh(prev => !prev); // Forzar actualización cambiando el valor de refresh
    } catch (error) {
      setErrors({ guess: error.response.data.detail });
      setRefresh(prev => !prev); // Forzar actualización cambiando el valor de refresh
    }
  };

  if (loading) return <p>Loading game...</p>;
  if (errors.fetch) return <p className="text-danger">{errors.fetch}</p>;

  const userGuesses = guesses.filter(g => g.player === user.id);
  const opponentGuesses = guesses.filter(g => g.player !== user.id);

  return (
    <div className="d-flex justify-content-center">
      <div className="w-100" style={{ maxWidth: '600px' }}>
        <h2>Game</h2>
        <div className={"d-inline-flex"}>
        <div>
          <p><strong>Oponent:</strong> {game.opponent_name}</p>
          <p><strong>Status:</strong> {game.active ? 'Active' : 'Finished'}</p>
          {game.winner && <p><strong>Winner: {game.winner_name}</strong></p>}
        </div>
        {game.winner &&
        (user.id !== game.winner ?
            (<div>
              <i className="bi bi-emoji-frown-fill text-danger" ></i>
              <h2 className={"text-danger"}>{`Hi ${user?.name}, you just lost :(`}</h2>
              <Link to="/games" className="btn btn-danger mb-3">See games</Link>
            </div>):
            (<div>
              <i className="bi bi-emoji-laughing text-success" ></i>
              <h2 className={"text-success"}>{`Hi ${user?.name}, you WIN`}</h2>
              <Link to="/games" className="btn btn-success mb-3">See games</Link>
            </div>))
        }
        </div>

        {!game.winner && <form onSubmit={handleGuess} className="w-auto w-100">
          <div className="mb-3 w-100">
            <label htmlFor="guess" className="form-label w-100">Enter your guess</label>
            <input
                type="text"
                className="form-control"
                id="guess"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                required
            />
            {errors.guess && <p className="text-danger">{errors.guess}</p>}
          </div>
          <button type="submit" className="btn btn-primary">Submit Guess</button>
        </form>}

         <div className="accordion" id="accordionExample">

          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne"
                      aria-expanded="true" aria-controls="collapseOne">
                My Guesses
              </button>
            </h2>
            <div id="collapseOne" className={`accordion-collapse collapse ${game.winner ? "" : "show" }`} aria-labelledby="headingOne"
                 data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <ul className="list-group">
                  {userGuesses.map(g => (
                      <li className="list-group-item" key={g.id}>
                        <p><strong>Guess:</strong> {g.guess}</p>
                        <p><strong>Bulls:</strong> T:{g.bulls}</p>
                        <p><strong>Cows:</strong> V:{g.cows}</p>
                      </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingTwo">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded={"true"} aria-controls="collapseTwo">
                Opponent's Guesses
              </button>
            </h2>
            <div id="collapseTwo" className={`accordion-collapse collapse ${game.winner ? "show" : "" }`} aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <p><strong>My Secret Number:</strong> {secret}</p> {/* Mostrar el número secreto */}
                <ul className="list-group">
                  {opponentGuesses.map(g => (
                    <li className="list-group-item" key={g.id}>
                      <p><strong>Guess:</strong> {g.guess}</p>
                      <p><strong>Bulls:</strong> T:{g.bulls}</p>
                      <p><strong>Cows:</strong> V:{g.cows}</p>
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
