import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
function CardUserChoice(props) {
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
        color: "#F8F8F2"
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
        <Card text={"light"} style={cardStyle}>
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
