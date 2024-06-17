import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ModalSubmitResponse(props) {
    const handleGoHome = () => {
        props.onHide(); // Chiudi il modale
        props.onGoHome(); // Vai alla home
    };

    const handlePlayAgain = () => {
        props.onHide(); // Chiudi il modale
        props.onPlayAgain(); // Ripeti il gioco
    };
    return (
        
        <Modal
            show={props.show}
            onHide={props.handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Round recap</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.roundOutcome}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onGoHome}>
                    Torna alla Home
                </Button>
                <Button variant="primary" onClick={props.onPlayAgain}>Gioca ancora</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalSubmitResponse;