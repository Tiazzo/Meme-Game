import React from 'react';
import { Button, Modal, Image } from 'react-bootstrap';

function ModalSubmitResponse(props) {
    const correctCaptions = props.selectedCaptions.filter(item => item.correct);

    return (
        <Modal
            show={props.show}
            onHide={props.handleClose}
            backdrop="static"
            keyboard={false}
            centered={true}
            animation={true}
        >
            <Modal.Header>
                <Modal.Title style={{fontWeight:"bold"}}>
                    {props.loggedIn
                        ? (props.rounds < 3 ? `Fine del round ${props.rounds}` : "Fine della partita")
                        : "Fine della partita"
                    }
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{props.roundOutcome}</p>
                {!props.selectedCaption?.correct && (
                    <div>
                        <p>Captions corrette:</p>
                        <ul>
                            {props.correctCaptions.map((item, index) => (
                                <li key={index}>{item.text}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {props.loggedIn && props.rounds === 3 && (
                    <div>
                        <p style={{ marginBottom: '5px' }}>
                            Hai totalizzato <strong style={{ color: props.score === 0 ? 'red' : 'green' }}>{props.score} punti</strong> in questa partita!
                        </p>
                        <p>Risposte corrette: {correctCaptions.length === 0 ? "Nessuna" : null}</p>
                    </div>
                )}
                {props.loggedIn && props.rounds === 3 && correctCaptions.map((item, index) => (
                    <div key={index} style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px"
                    }}>
                        <Image
                            src={`http://localhost:3001/public/images/${item.meme.memeUrl}`}
                            alt="Meme"
                            style={{
                                width: "50px",
                                height: "50px",
                                marginRight: "10px",
                                borderRadius: "50%"
                            }}
                        />
                        <p>{item.caption.text}</p>
                    </div>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button style={{backgroundColor:"#44475A", border:"none", color:"#F8F8F2"}} onClick={props.onGoHome}>
                    Torna alla Home
                </Button>
                <Button style={{backgroundColor:"#BD93F9", border:"none", color:"#F8F8F2"}} onClick={
                    props.loggedIn ?
                        (props.rounds < 3 ? props.onPlayNextRound : props.onPlayAgain)
                        : props.onPlayAgain
                }>
                    {props.loggedIn
                        ? (props.rounds < 3 ? "Prossimo round" : "Gioca di nuovo")
                        : "Gioca di nuovo"
                    }
                </Button>
            </Modal.Footer>
        </Modal >
    );
}

export { ModalSubmitResponse };
