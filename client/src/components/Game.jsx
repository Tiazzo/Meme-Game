import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner, Image, Form, Button } from 'react-bootstrap';
import API from '../API.mjs';
import CountdownTimer from './CountdownTimer';
import { ModalSubmitResponse } from './ModalSubmitResponse';
import PropTypes from 'prop-types';

const Game = (props) => {
    const navigate = useNavigate();
    const [meme, setMeme] = useState('');
    const [captions, setCaptions] = useState([]);
    const [selectedCaption, setSelectedCaption] = useState(null);
    const [roundOutcome, setRoundOutcome] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [reloadGame, setReloadGame] = useState(false);
    const [timerRunning, setTimerRunning] = useState(true);
    const [rounds, setRounds] = useState(1);
    const [choices, setChoices] = useState([]);
    const [endGame, setEndGame] = useState(false);

    useEffect(() => {
        const restoreMemeDB = async () => {
            try {
                await API.restoreMeme();
            } catch (error) {
                console.error('Errore nel ripristino del meme:', error);
            }
        };

        restoreMemeDB();
    }, []);

    useEffect(() => {
        // Flag to track if the component is mounted
        let isMounted = true;

        const fetchMemeAndCaptions = async () => {
            try {
                const meme = await API.getMeme();
                const captions = await API.getCaptions(meme.id);

                if (isMounted) {
                    setMeme(meme);
                    setCaptions(captions);
                    setSelectedCaption(null);
                    setRoundOutcome('');
                    setLoading(false);
                }
            } catch (error) {
                console.error('Errore nel caricare il meme e le didascalie:', error);
            }
        };

        fetchMemeAndCaptions();

        // Cleanup to set the flag to false when the component is unmounted
        return () => {
            isMounted = false;
        };
    }, [reloadGame]);

    useEffect(() => {
        if (endGame) {
            const restoreMemeDB = async () => {
                try {
                    await API.restoreMeme();
                } catch (error) {
                    console.error('Errore nel ripristino del meme:', error);
                }
            };

            restoreMemeDB();
            setEndGame(false);
        }
    }, [endGame]);

    const handleCaptionChange = (e) => {
        const selectedCaptionId = parseInt(e.target.value, 10);
        const selectedCaption = captions.find(caption => caption.id === selectedCaptionId);
        setSelectedCaption(selectedCaption);
    };

    const handleConfirmCaption = async () => {
        if (selectedCaption) {
            const newChoice = { meme: meme, caption: selectedCaption, correct: selectedCaption.correct, points: selectedCaption.correct ? 5 : 0, round: rounds };
            const updatedChoices = [...choices, newChoice];

            if (props.loggedIn) {
                setRoundOutcome(selectedCaption.correct ? 'Caption corretta! +5 punti' : 'Caption sbagliata! 0 punti');
                setScore(prevScore => selectedCaption.correct ? prevScore + 5 : prevScore);
                setChoices(updatedChoices);

                // Save the game into the database after the third round
                if (rounds === 3) {
                    await saveGameIntoDB(updatedChoices);
                    setEndGame(true);
                }
            } else {
                setRoundOutcome(selectedCaption.correct ? 'Caption corretta! Hai totalizzato 5 punti' : 'Caption sbagliata! Hai totalizzato 0 punti');
                setScore(selectedCaption.correct ? 5 : 0);
                setEndGame(true);
            }
            setShowModal(true);
            setTimerRunning(false);
        }
    };

    // Function to save the game into the database
    const saveGameIntoDB = async (finalChoices) => {
        try {
            const saved = await API.saveGame(props.user, finalChoices);
        } catch (error) {
            console.error('Errore nel salvataggio della partita:', error);
        }
    };

    const handleGoHome = async () => {
        setEndGame(true);
        setTimerRunning(false);
        navigate("/");
    };

    const handleNextRound = () => {
        setRounds(rounds + 1);
        setShowModal(false);
        setLoading(true);
        setTimerRunning(true);
        setReloadGame(reloadGame => !reloadGame);
    };

    const handlePlayAgain = async () => {
        setShowModal(false);
        setLoading(true);
        setTimerRunning(true);
        setRounds(1);
        setScore(0);
        setChoices([]);
        setReloadGame(reloadGame => !reloadGame);
        setEndGame(true);
    };

    const handleTimerExpired = async () => {
        const newChoice = { meme: meme, caption: "", correct: false, points: 0, round: rounds };
        const updatedChoices = [...choices, newChoice];

        setRoundOutcome('Tempo scaduto! Hai totalizzato 0 punti');
        setChoices(updatedChoices);
        if (rounds === 3) {
            await saveGameIntoDB(updatedChoices);
            setEndGame(true);
        }
        setShowModal(true);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div style={{
            color: "#F8F8F2",
            maxWidth: "800px",
            margin: "0 auto",
            paddingTop: "20px"
        }}>
            <h1 style={{
                fontSize: "24px",
                marginBottom: "20px"
            }}>Seleziona la didascalia migliore prima che scada il tempo!</h1>
            <CountdownTimer initialSeconds={30} timerRunning={timerRunning} setTimerRunning={setTimerRunning} onTimerExpired={handleTimerExpired} />
            <div style={{
                marginTop: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <Image
                    src={`http://localhost:3001/public/images/${meme.memeUrl}`}
                    rounded
                    alt="Meme"
                    onError={(e) => console.error('Image not found:', meme.memeUrl, e)}
                    style={{
                        maxWidth: "100%",
                        marginBottom: "20px"
                    }}
                />
                <div style={{
                    width: "100%",
                    marginBottom: "20px"
                }}>
                    <Form.Select
                        aria-label="Seleziona una didascalia"
                        onChange={handleCaptionChange}
                        value={selectedCaption ? selectedCaption.id : ''}
                        style={{
                            width: "100%",
                        }}
                    >
                        <option value="" disabled>Seleziona una caption</option>
                        {captions.map(caption => (
                            <option
                                key={caption.id}
                                value={caption.id}
                                style={{
                                    width: "100%",
                                }}
                            >
                                {caption.text}
                            </option>
                        ))}
                    </Form.Select>
                </div>
                <div className="d-grid gap-2">
                    <Button style={{ backgroundColor: "#BD93F9", border: "none" }} onClick={handleConfirmCaption}>Conferma</Button>
                </div>
            </div>
            <ModalSubmitResponse
                show={showModal}
                handleClose={handlePlayAgain}
                roundOutcome={roundOutcome}
                onPlayAgain={handlePlayAgain}
                onPlayNextRound={handleNextRound}
                rounds={rounds}
                onGoHome={handleGoHome}
                score={score}
                loggedIn={props.loggedIn}
                selectedCaptions={choices}
                selectedCaption={selectedCaption}
                correctCaptions={captions.filter(item => item.correct)}
            />
        </div >
    );
};

Game.propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    user: PropTypes.object
};

export default Game;
