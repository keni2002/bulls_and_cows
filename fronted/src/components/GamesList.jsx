import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

function GamesList({ handleShowToast }) {
  const [games, setGames] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await api.get('/api/game/games/');
        const userGames = response.data.filter(game => game.player1 === user.id || game.player2 === user.id);
        setGames(userGames.sort((a, b) => b.created_at.localeCompare(a.created_at)));
      } catch (error) {

      }
    };

    fetchGames();
  }, [handleShowToast, user]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/game/games/${id}/`);
      setGames(games.filter(game => game.id !== id));
      handleShowToast("Game Deleted.");
    } catch (error) {
      handleShowToast("Failed to Delete Game.");
    }
  };

  const handlePlay = async (gameId, requestId) => {
        try {
      await api.patch(`api/game/game-requests/${requestId}/`, { initiated: true });
      handleShowToast("Game Initialized.");
      //delete the request
      await api.delete(`api/game/game-requests/${requestId}/`);
      navigate(`/game/${gameId}`)
    } catch (error) {

    }
    navigate(`/game/${gameId}`);
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="w-100" style={{ maxWidth: '800px' }}>
        <h2>Your Games</h2>
        {games.length === 0 ? (
          <p>No games found.</p>
        ) : (
          <ul className="list-group">
            {games.map(game => (
              <li className={`list-group-item d-flex justify-content-between align-items-center ${game.active ? '' : 'list-group-item-secondary'}`} key={game.id}>
                <div>
                  <p><strong>Opponent:</strong> {game.opponent_name}</p>
                  <p><strong>Date:</strong> {new Date(game.created_at).toLocaleString()}</p>
                  <p><strong>Status:</strong> {game.active ? 'Active' : 'Finished'}</p>
                  {game.winner ? <p className="text-success"><strong>Winner:</strong> {game.winner_name}</p> : null}
                </div>
                <div>
                  {game.winner && (user.id !== game.winner ? (
                      <p><strong>Opponent's Secret:</strong> {game.opponent_secret}</p>

                  ) : null)}
                  <button className={`btn btn-${game.winner ? "primary":"success"} me-2`} onClick={() => handlePlay(game.id)}>
                    <i className={`bi bi-${game.winner ? "eye-fill":"play"}`}></i> {`${game.winner ? "See game":"Play"}`}
                  </button>

                  <button className="btn btn-danger" onClick={() => handleDelete(game.id, game.gamerequest)}>
                    <i className={"bi bi-trash"}></i> Delete
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

export default GamesList;
