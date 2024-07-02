import React, { useState, useEffect } from 'react';
import Player from './Player';
import './styles.css';  // Certifique-se de importar o arquivo CSS

const initialPlayers = [
  { id: 1, role: 'Cidadão', name: 'Ana', votes: 0 },
  { id: 2, role: 'Cidadão', name: 'Carol', votes: 0 },
  { id: 3, role: 'Cidadão', name: 'Cibele', votes: 0 },
  { id: 4, role: 'Cidadão', name: 'Dienifer', votes: 0 },
  { id: 5, role: 'Cidadão', name: 'Karine', votes: 0 },
  { id: 6, role: 'Cidadão', name: 'Andressa', votes: 0 },
  { id: 7, role: 'Cidadão', name: 'Maine', votes: 0 },
  { id: 8, role: 'Cidadão', name: 'Natalia', votes: 0 },
  { id: 9, role: 'Cidadão', name: 'Aldimar', votes: 0 },
  { id: 10, role: 'Cidadão', name: 'Alexia', votes: 0 },
];

const GameBoard = () => {
  const [gameState, setGameState] = useState('setup');
  const [players, setPlayers] = useState(initialPlayers);
  const [narrative, setNarrative] = useState('');
  const [assassin, setAssassin] = useState(null);
  const [angel, setAngel] = useState(null);
  const [detective, setDetective] = useState(null);
  const [victim, setVictim] = useState(null);
  const [savedPlayer, setSavedPlayer] = useState(null);
  const [investigatedPlayer, setInvestigatedPlayer] = useState(null);
  const [investigationResult, setInvestigationResult] = useState('');
  const [votes, setVotes] = useState({});
  const [executedPlayer, setExecutedPlayer] = useState(null);

  useEffect(() => {
    if (gameState === 'night') {
      setNarrative('Cidade dorme...');
      document.body.className = 'night';
    } else if (gameState === 'day') {
      setNarrative('Cidade acorda...');
      document.body.className = 'day';
      if (victim && victim !== savedPlayer) {
        setNarrative(`${victim.name} foi assassinado!`);
        setPlayers(players.map(p => p.id === victim.id ? { ...p, role: 'Morto' } : p));
      } else {
        setNarrative('Ninguém foi assassinado!');
      }
    } else {
      document.body.className = '';
    }
  }, [gameState, victim, savedPlayer]);

  const handleNextPhase = () => {
    if (gameState === 'night') {
      setGameState('day');
    } else {
      setGameState('night');
      setVictim(null);
      setSavedPlayer(null);
      setInvestigatedPlayer(null);
      setInvestigationResult('');
      setVotes({});
      setExecutedPlayer(null);
    }
  };

  const handlePlayerSelect = (event, roleSetter) => {
    const selectedPlayer = players.find(p => p.id === parseInt(event.target.value));
    roleSetter(selectedPlayer);
    setPlayers(players.map(p => p.id === selectedPlayer.id ? { ...p, role: roleSetter === setAssassin ? 'Assassino' : roleSetter === setAngel ? 'Anjo' : 'Delegado' } : p));
  };

  const handleActionSelect = (event, actionSetter) => {
    const selectedPlayer = players.find(p => p.id === parseInt(event.target.value));
    actionSetter(selectedPlayer);
    if (actionSetter === setInvestigatedPlayer) {
      setInvestigationResult(selectedPlayer.role === 'Assassino' ? 'Mau' : 'Bom');
    }
  };

  const handleVote = (player) => {
    setVotes({ ...votes, [player.id]: (votes[player.id] || 0) + 1 });
  };

  const handleExecute = () => {
    const maxVotes = Math.max(...Object.values(votes));
    const mostVotedPlayerId = Object.keys(votes).find(key => votes[key] === maxVotes);
    const playerToExecute = players.find(p => p.id === parseInt(mostVotedPlayerId));
    setExecutedPlayer(playerToExecute);
    setPlayers(players.map(p => p.id === playerToExecute.id ? { ...p, role: 'Morto' } : p));
  };

  return (
    <div className="container">
      <h2>{narrative}</h2>
      {gameState === 'setup' && (
        <div>
          <h3>Selecione o Assassino</h3>
          <select onChange={(e) => handlePlayerSelect(e, setAssassin)}>
            <option value="">Selecione</option>
            {players.map(player => (
              <option key={player.id} value={player.id}>{player.name}</option>
            ))}
          </select>
          <h3>Selecione o Anjo</h3>
          <select onChange={(e) => handlePlayerSelect(e, setAngel)}>
            <option value="">Selecione</option>
            {players.map(player => (
              <option key={player.id} value={player.id}>{player.name}</option>
            ))}
          </select>
          <h3>Selecione o Delegado</h3>
          <select onChange={(e) => handlePlayerSelect(e, setDetective)}>
            <option value="">Selecione</option>
            {players.map(player => (
              <option key={player.id} value={player.id}>{player.name}</option>
            ))}
          </select>
          <div>
          <button onClick={() => setGameState('night')}>Iniciar Jogo</button>
          </div>
        </div>
      )}
      {gameState === 'night' && (
        <div>
          <h3>Assassino, selecione sua vítima</h3>
          <select onChange={(e) => handleActionSelect(e, setVictim)}>
            <option value="">Selecione</option>
            {players.filter(player => player.role !== 'Assassino' && player.role !== 'Morto').map(player => (
              <option key={player.id} value={player.id}>{player.name}</option>
            ))}
          </select>
          <h3>Anjo, selecione quem salvar</h3>
          <select onChange={(e) => handleActionSelect(e, setSavedPlayer)}>
            <option value="">Selecione</option>
            {players.filter(player => player.role !== 'Morto').map(player => (
              <option key={player.id} value={player.id}>{player.name}</option>
            ))}
          </select>
          <h3>Delegado, selecione quem investigar</h3>
          <select onChange={(e) => handleActionSelect(e, setInvestigatedPlayer)}>
            <option value="">Selecione</option>
            {players.filter(player => player.role !== 'Morto').map(player => (
              <option key={player.id} value={player.id}>{player.name}</option>
            ))}
          </select>
          {investigatedPlayer && <p>{investigatedPlayer.name} é {investigationResult}</p>}
          <div>
          <button onClick={handleNextPhase}>Amanhecer</button>
          </div>
        </div>
      )}
      {gameState === 'day' && (
        <div>
          <h3>Discussão do dia</h3>
          <p>{narrative}</p>
          <h3>Votação para a forca</h3>
          {players.filter(player => player.role !== 'Morto').map(player => (
            <button key={player.id} onClick={() => handleVote(player)}>{player.name} - Votos: {votes[player.id] || 0}</button>
          ))}
          <div>
          <button onClick={handleExecute}>Executar</button>
          {executedPlayer && <p>{executedPlayer.name} foi executado!</p>}
          </div>
          <button onClick={handleNextPhase}>Anoitecer</button>
        </div>
      )}
      <div className="players">
        {players.map(player => (
          <Player key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
