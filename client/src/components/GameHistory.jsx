import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import API from '../API.mjs';

const GameHistory = () => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        const fetchGameHistory = async () => {
            try {
                const gameHistory = await API.getGameHistory();
                setGames(gameHistory);
            } catch (error) {
                console.error('Errore nel recuperare lo storico delle partite:', error);
            }
        };

        fetchGameHistory();
    }, []);

    return (
        <Container className="mt-4">
            <h1>Storico delle Partite</h1>
            {games.length === 0 ? (
                <p>Nessuna partita trovata.</p>
            ) : (
                games.map((game, index) => (
                    <div key={index} className="my-4">
                        <h2>Partita {index + 1}</h2>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Round</th>
                                    <th>Immagine Meme</th>
                                    <th>Punteggio Round</th>
                                </tr>
                            </thead>
                            <tbody>
                                {game.rounds.map((round, roundIndex) => (
                                    <tr key={roundIndex}>
                                        <td>{roundIndex + 1}</td>
                                        <td>
                                            <img
                                                src={`http://localhost:3001/public/images/${round.meme.memeUrl}`}
                                                alt={`Meme Round ${roundIndex + 1}`}
                                                style={{ maxWidth: '150px', maxHeight: '150px' }}
                                            />
                                        </td>
                                        <td>{round.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <p>Punteggio Totale: {game.totalScore}</p>
                    </div>
                ))
            )}
        </Container>
    );
};

export default GameHistory;
