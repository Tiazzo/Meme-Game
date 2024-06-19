import { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import API from '../API.mjs';

const GameHistory = () => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        const fetchGameHistory = async () => {
            try {
                const gameHistory = await API.getGameHistory("mattia.carlino@polito.it");
                console.log(gameHistory);
                setGames(gameHistory);
            } catch (error) {
                console.error('Errore nel recuperare lo storico delle partite:', error);
            }
        };

        fetchGameHistory();
    }, []);

    // Raggruppo i round per partita
    const groupedGames = games.reduce((acc, game) => {
        const gameId = game.game_id;
        if (!acc[gameId]) {
            acc[gameId] = [];
        }
        acc[gameId].push(game);
        return acc;
    }, {});

    return (
        <Container className="mt-4">
            <h1>Storico delle Partite</h1>
            {games.length === 0 ? (
                <p>Nessuna partita trovata.</p>
            ) : (
                Object.keys(groupedGames).map((gameId) => {
                    const gameRounds = groupedGames[gameId];
                    const totalScore = gameRounds.reduce((sum, round) => sum + round.score, 0);
                    const gameDate = gameRounds[0].date;
                    return (
                        <div key={gameId} className="mb-4">
                            <h2>Partita numero {gameId}, giocata il {gameDate}</h2>
                            <p>Punteggio partita: {totalScore}</p>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Round</th>
                                        <th>Meme</th>
                                        <th>Caption</th>
                                        <th>Punteggio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gameRounds.map((round, index) => (
                                        <tr key={index}>
                                            <td>{round.round}</td>
                                            <td>
                                                <img src={`http://localhost:3001/public/images/${round.image}`} alt="Meme" style={{ width: '100px' }} />
                                            </td>
                                            <td>{round.caption}</td>
                                            <td>{round.score}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    );
                })
            )}
        </Container>
    );
};

export { GameHistory };
