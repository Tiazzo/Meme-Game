// GameGuest.jsx
import { useState, useEffect } from 'react';
import { Spinner, Image, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import '../style/GameComponent.css';
import API from '../API.mjs';
import CountdownTimer from './CountdownTimer';

const GameGuest = () => {
    const [meme, setMeme] = useState('');
    const [captions, setCaptions] = useState([]);
    const [selectedCaption, setSelectedCaption] = useState(null);
    const [roundOutcome, setRoundOutcome] = useState('');
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true); // Stato per gestire il caricamento dei dati

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
    }, []);

    const handleSelectCaption = (caption) => {
        setSelectedCaption(caption);
        const outcome = caption.correct ? 'Caption corretta!' : 'Caption sbagliata!';
        setRoundOutcome(outcome);
        caption.correct ? setScore(5) : setScore(0);
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
            <CountdownTimer initialSeconds={30} />
            <div className="imageContainer">
                <Image
                    src={`http://localhost:3001/public/images/${meme.memeUrl}`}
                    rounded
                    alt="Meme"
                    onError={(e) => console.error('Image not found:', meme.memeUrl, e)}
                    className="memeImage"
                />
                <div className="captionsContainer">
                    <ToggleButtonGroup>
                        <div className="captionRow">
                            {captions.map(caption => (
                                <ToggleButton
                                    key={caption.id}
                                    onClick={() => handleSelectCaption(caption)}
                                    className="captionButton"
                                >
                                    {caption.text}
                                </ToggleButton>
                            ))}
                        </div>
                    </ToggleButtonGroup>
                </div>
            </div>
        </div>
    );
};

export default GameGuest;
