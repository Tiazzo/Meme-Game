import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

function CardUserChoice (props) {
    return (
        <Card style={{ width: '18rem', height: '100%' }} className="customCard">
            <Card.Img variant="top" src={props.imageUrl} style={{ width: '100%', height: '50%', objectFit: 'cover' }} />
            <Card.Body style={{ height: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Card.Title><b><span style={{ fontSize: 20, color:"#181818" }}>{props.title}</span></b></Card.Title>
                <Card.Text style={{color:"#181818"}}>
                    {props.description}
                </Card.Text>
                <Link to={props.link} >
                    <Button variant="light" >{props.button}</Button>
                </Link>
            </Card.Body>
        </Card>
    );
}

export default CardUserChoice;