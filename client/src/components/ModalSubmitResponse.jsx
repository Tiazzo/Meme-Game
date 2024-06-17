import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ModalSubmitResponse(props) {
    return (
        
        <Modal
            show={props.show}
            onHide={props.handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Round terminato</Modal.Title>
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