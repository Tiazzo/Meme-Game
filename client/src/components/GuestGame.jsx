// GameGuest.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner, Image, ToggleButtonGroup, ToggleButton, Form, Button } from 'react-bootstrap';
import '../style/GameComponent.css';
import API from '../API.mjs';
import CountdownTimer from './CountdownTimer';
import ModalSubmitResponse from './ModalSubmitResponse';

const GameGuest = () => {
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

    useEffect(() => {
        const fetchMemeAndCaptions = async () => {
            try {
                const meme = await API.getMeme(); // Utilizza la funzione API per ottenere i dati
                setMeme(meme);
                //TODO cambiare con id meme
                const captions = await API.getCaptions(1);
                setCaptions(captions);
                setSelectedCaption(null);
                setRoundOutcome('');
                setScore(0);
                setLoading(false);
            } catch (error) {
                console.error('Errore nel caricare il meme e le didascalie:', error);
            }
        };
        fetchMemeAndCaptions();
    }, [reloadGame]);

    // Function to handle the change of the selected caption
    const handleCaptionChange = (e) => {
        const selectedCaptionId = parseInt(e.target.value, 10);
        const selectedCaption = captions.find(caption => caption.id === selectedCaptionId);
        setSelectedCaption(selectedCaption);
    };

    // Function to handle the confirm caption button
    const handleConfirmCaption = () => {
        if (selectedCaption) {
            setRoundOutcome(selectedCaption.correct ? 'Caption corretta! Hai totalizzato 5 punti"' : 'Caption sbagliata! Hai totalizzato 0 punti');
            setScore(selectedCaption.correct ? 5 : 0);
            setShowModal(true);
            setTimerRunning(false);
        }
    };

    // Function to handle the go home button
    const handleGoHome = () => {
        setTimerRunning(false);
        navigate("/");
    };

    // Function to handle the play again button
    const handlePlayAgain = () => {
        setShowModal(false);
        setLoading(true);
        setTimerRunning(true);
        setReloadGame(prevState => !prevState);
    };

    // Function to handle the timer expired event
    const handleTimerExpired = () => {
        setRoundOutcome('Tempo scaduto! Hai totalizzato 0 punti');
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
        <div className="container">
            <h1 className="title">Seleziona la didascalia migliore prima che scada il tempo!</h1>
            <CountdownTimer initialSeconds={30} timerRunning={timerRunning} setTimerRunning={setTimerRunning} onTimerExpired={() => handleTimerExpired()} />
            <div className="imageContainer">
                <Image
                    src={`http://localhost:3001/public/images/${meme.memeUrl}`}
                    rounded
                    alt="Meme"
                    onError={(e) => console.error('Image not found:', meme.memeUrl, e)}
                    className="memeImage"
                />
                <div className="captionsContainer">
                    <Form.Select
                        aria-label="Seleziona una didascalia"
                        onChange={handleCaptionChange}
                        value={selectedCaption ? selectedCaption.id : ''}
                        className="captionDropdown"
                    >
                        <option value="" disabled>Seleziona una caption</option>
                        {captions.map(caption => (
                            <option
                                key={caption.id}
                                value={caption.id}
                                className="captionOption"
                            >
                                {caption.text}
                            </option>
                        ))}
                    </Form.Select>
                </div>
                <div className="d-grid gap-2">
                    <Button variant="primary" onClick={handleConfirmCaption}>Conferma</Button>
                </div>

            </div>
            <ModalSubmitResponse
                show={showModal}
                handleClose={() => handlePlayAgain()}
                roundOutcome={roundOutcome}
                onPlayAgain={handlePlayAgain}
                onGoHome={handleGoHome}
            />
        </div>
    );
};

export default GameGuest;
