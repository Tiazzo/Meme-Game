import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function CardUserChoice(props) {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        if (!props.loggedIn || props.link !== '/login') {
            navigate(props.link);
        }
    };

    return (
        <Card style={{ width: '18rem', height: '100%' }} className="customCard">
            <Card.Img variant="top" src={props.imageUrl} style={{ width: '100%', height: '50%', objectFit: 'cover' }} />
            <Card.Body style={{ height: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Card.Title><b><span style={{ fontSize: 20, color: "#181818" }}>{props.title}</span></b></Card.Title>
                <Card.Text style={{ color: "#181818" }}>
                    {props.description}
                </Card.Text>
                <Button
                    variant="light"
                    onClick={handleButtonClick}
                    disabled={props.loggedIn && props.link === '/login'}
                >
                    {props.button}
                </Button>
            </Card.Body>
        </Card>
    );
}

export default CardUserChoice;
