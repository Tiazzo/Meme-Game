import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import '../style/Modal.css'
function ModalSubmitResponse(props) {
    const correctCaptions = props.selectedCaptions.filter(item => item.correct);

    return (

        <Modal
            show={props.show}
            onHide={props.handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {props.isLoggedIn
                        ? (props.rounds < 3 ? `Fine del round ${props.rounds}` : "Fine della partita")
                        : "Fine della partita"
                    }
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{props.roundOutcome}</p>
                {props.isLoggedIn && props.rounds === 3 && (
                    <div>
                        <p style={{ marginBottom: '5px' }}>
                            Hai totalizzato <strong style={{ color: 'green' }}>{props.score} punti</strong> in questa partita!
                        </p>
                        <p>Risposte corrette:</p>
                    </div>
                )}
                {props.isLoggedIn && props.rounds === 3 && correctCaptions.map((item, index) => (
                    <div key={index} className="selected-caption">
                        <Image
                            src={`http://localhost:3001/public/images/${item.meme.memeUrl}`}
                            alt="Meme"
                            className="smallImage"
                        />
                        <p>{item.caption.text}</p>
                    </div>
                ))}

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onGoHome}>
                    Torna alla Home
                </Button>
                <Button variant="primary" onClick={
                    props.isLoggedIn ?
                        (props.rounds < 3 ? props.onPlayNextRound : props.onPlayAgain)
                        : props.onPlayAgain
                }>
                    {props.isLoggedIn
                        ? (props.rounds < 3 ? "Prossimo round" : "Gioca di nuovo")
                        : "Gioca di nuovo"
                    }
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export { ModalSubmitResponse };