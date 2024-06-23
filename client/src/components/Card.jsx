import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
function CardUserChoice(props) {
    const [hover, setHover] = useState(false);
    const navigate = useNavigate();

    const handleButtonClick = () => {
        if (!props.loggedIn || props.link !== '/login') {
            navigate(props.link);
        }
    };

    const cardStyle = {
        textAlign: "center",
        borderRadius: "20px",
        padding: "5px",
        maxWidth: "400px",
        margin: "0 auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#44475A",
        color: "#F8F8F2",
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        transform: hover ? 'scale(1.05)' : 'scale(1)',
        boxShadow: hover ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none'

    };

    const cardBodyStyle = {
        flex: "1 1 auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
    };

    const buttonStyle = {
        width: "95%",
        borderRadius: "15px",
        alignSelf: "center",
        backgroundColor: props.button === "Gioca" ? "#FF5555" : "#BD93F9",
        border: "none"
    };

    return (
        <Card text={"light"} style={cardStyle} onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}>
            <Card.Img variant="top" src={props.imageUrl} style={{ flex: "0 1 auto" }} />
            <Card.Body style={cardBodyStyle}>
                <Card.Title style={{ fontSize: "22px" }}><b>{props.title}</b></Card.Title>
                <Card.Text>
                    {props.description}
                </Card.Text>
                <Button
                    style={buttonStyle}
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
