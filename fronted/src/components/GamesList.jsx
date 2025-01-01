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
        setGames(userGames);
      } catch (error) {

      }
    };

    fetchGames();
  }, [handleShowToast, user]);

  const handleDelete = async (id, gamerequestId) => {
    console.log("handleDelete called with:", id, gamerequestId);
    if (!id || !gamerequestId) {
      handleShowToast('Faltan datos para eliminar el juego.');
      return;
    }
    try {
      await api.delete(`/api/game/games/${id}/`);
      setGames(games.filter(game => game.id !== id));
      handleShowToast("Juego Eliminado.");
    } catch (error) {
      handleShowToast("Error al eliminar");
    }
  };

  const handlePlay = async (gameId, gamerequestId) => {
    console.log("handlePlay called with:", gameId, gamerequestId);
    if (!gameId || !gamerequestId) {
      handleShowToast('Faltan datos para iniciar el juego.');
      return;
    }
    try {
      await api.patch(`/api/game/game-requests/${gamerequestId}/`, { initiated: true });
      handleShowToast("Juego Iniciado");
      navigate(`/game/${gameId}`);
    } catch (error) {
      handleShowToast("Error al iniciar el juego.");
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="w-100" style={{ maxWidth: '800px' }}>
        <h2>Partidas</h2>
        {games.length === 0 ? (
          <p>No se encontraron juegos.</p>
        ) : (
          <ul className="list-group">
            {games.map(game => (
              <li className={`list-group-item d-flex justify-content-between align-items-center ${game.active ? '' : 'list-group-item-secondary'}`} key={game.id}>
                <div>
                  <p><strong>Oponente:</strong> {game.opponent_name}</p>
                  <p><strong>Fecha:</strong> {new Date(game.created_at).toLocaleString()}</p>
                  <p><strong>Estado:</strong> {game.active ? 'Activo' : 'Finalizado'}</p>
                  {game.winner ? <p className="text-success"><strong>Ganador:</strong> {game.winner_name}</p> : null}
                  <p><strong>ID:</strong> {game.id}</p>

                </div>
                <div>
                  {game.winner && (user.id !== game.winner ? (
                    <p><strong>Digitos del oponente:</strong> {game.opponent_secret}</p>
                  ) : null)}
                  <button
                    className={`btn btn-${game.winner ? "primary" : "success"} me-2`}
                    onClick={() => handlePlay(game.id, game.gamerequest)}
                  >
                    <i className={`bi  bi-${game.winner ? "eye-fill" : "controller"}`}></i> {`${game.winner ? "Ver juego" : "Jugar!"}`}
                  </button>
                  <button
                    className="btn  btn-danger"
                    onClick={() => handleDelete(game.id, game.gamerequest)}
                  >
                    <i className={"bi bi-trash"}></i> Eliminar
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
