import { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import API from '../API.mjs';

const GameHistory = (props) => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        const fetchGameHistory = async () => {
            try {
                if (props.user && props.user.id) {
                    const gameHistory = await API.getGameHistory(props.user.id);
                    setGames(gameHistory);
                }
            } catch (error) {
                console.error('Errore nel recuperare lo storico delle partite:', error);
            }
        };

        fetchGameHistory();
    }, [props.user]);

    if (!props.user) {
        return <p>Caricamento...</p>;
    }

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
        <Container className="mt-4" style={{ color: "#F8F8F2" }}>
            <h1 style={{ color: "#F8F8F2" }}>Ciao {props.user.name}!</h1>
            <p>La tua email: {props.user.username}</p>
            <h2>Storico partite</h2>
            {games.length === 0 ? (
                <p>Nessuna partita trovata.</p>
            ) : (
                Object.keys(groupedGames).map((gameId) => {
                    const gameRounds = groupedGames[gameId];
                    const totalScore = gameRounds.reduce((sum, round) => sum + round.score, 0);
                    const gameDate = gameRounds[0].date;
                    return (
                        <div key={gameId} className="mb-4" style={{ textAlign: "center", marginTop: "40px" }}>
                            <h2>Partita numero {gameId}, giocata il {gameDate}</h2>
                            <p style={{ fontWeight: "bold" }}>Punteggio partita:  <span style={{ color: "#FFB86C" }}>{totalScore}</span></p>
                            <Table striped bordered hover responsive style={{
                                backgroundColor: "#44475A",
                                color: "#F8F8F2",
                                borderRadius: "15px",
                                overflow: "hidden"
                            }}>
                                <thead>
                                    <tr>
                                        <th>Round</th>
                                        <th>Meme</th>
                                        <th>Caption selezionata</th>
                                        <th>Punteggio round</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gameRounds.map((round, index) => (
                                        <tr key={index}>
                                            <td>{round.round}</td>
                                            <td>
                                                <img style={{ maxWidth: "100px" }} src={`http://localhost:3001/public/images/${round.image}`} alt="Meme" />
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
        </Container >
    );
};

export { GameHistory };
