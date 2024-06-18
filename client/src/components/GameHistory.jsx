import React, { useEffect, useState } from 'react';
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

    return (
        <Container className="mt-4">
            <h1>Storico delle Partite</h1>
            {games.length === 0 ? (
                <p>Nessuna partita trovata.</p>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Partita</th>
                            <th>Round</th>
                            <th>Immagine</th>
                            <th>Didascalia</th>
                            <th>Punteggio</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {games.map((game, index) => (
                            <tr key={index}>
                                <td>{game.game_id}</td>
                                <td>{game.round}</td>
                                <td>
                                    <img src={`http://localhost:3001/public/images/${game.image}`} alt="Meme" style={{ width: '100px' }} /></td>
                                <td>{game.caption}</td>
                                <td>{game.score}</td>
                                <td>{game.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default GameHistory;
