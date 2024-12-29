import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { UserContext } from '../context/UserContext';
import { useParams, useNavigate } from 'react-router-dom';

function Game({ handleShowToast }) {
  const { gameId } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await api.get(`/api/game/games/${gameId}/`);
        setGame(response.data);
        setLoading(false);
      } catch (error) {
        setErrors({ fetch: error.response.data.detail });
        navigate('/');
      }
    };

    fetchGame();
  }, [gameId, navigate]);

  const handleGuess = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/game/guesses/', {
        game: gameId,
        guess,
      });
      setGuesses([...guesses, response.data]);
      setGuess('');
    } catch (error) {
      setErrors({ guess: error.response.data.detail });
    }
  };

  if (loading) return <p>Loading game...</p>;
  if (errors.fetch) return <p className="text-danger">{errors.fetch}</p>;

  return (
    <div className="d-flex justify-content-center">
      <div className="w-100" style={{ maxWidth: '600px' }}>
        <h2>Game</h2>
        <div>
          <p><strong>Player 1:</strong> {game.player1.username}</p>
          <p><strong>Player 2:</strong> {game.player2.username}</p>
          <p><strong>Status:</strong> {game.active ? 'Active' : 'Finished'}</p>
          {game.winner && <p><strong>Winner:</strong> {game.winner.username}</p>}
        </div>
        <form onSubmit={handleGuess}>
          <div className="mb-3">
            <label htmlFor="guess" className="form-label">Enter your guess</label>
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
        </form>
        <h3>Guesses</h3>
        <ul className="list-group">
          {guesses.map(g => (
            <li className="list-group-item" key={g.id}>
              <p><strong>Guess:</strong> {g.guess}</p>
              <p><strong>Bulls:</strong> {g.bulls}</p>
              <p><strong>Cows:</strong> {g.cows}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Game;
