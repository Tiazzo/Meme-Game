import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Card from './Card';
import PropTypes from 'prop-types';

const Home = (props) => {
    return (
        <Container fluid className="flex-grow-1 d-flex flex-column" style={{textAlign:"center", backgroundColor:"#282A36", color:"#F8F8F2"}}>
            <h1>Benvenuto in <span style={{color:"#FF5555", fontWeight:"bold",}}>What Do You Meme</span>!</h1>
            <h2 style={{marginTop:"10px"}}>Seleziona la modalità di gioco:</h2>
            <Row className="justify-content-center" style={{marginBottom:"15px", marginTop:"20px"}}>
                <Col md={4} className="mb-3">
                    {props.loggedIn ? (
                        <Card
                            title="Gioca"
                            description="Gioca una partita da tre round."
                            imageUrl="dudes-meme-with-sitting-sad-man.png"
                            link="/game"
                            button="Gioca"
                            loggedIn={props.loggedIn}
                        />
                    ) : (
                        <Card
                            title="Ospite"
                            description="Gioca un partita rapida da un singolo round senza dover accedere."
                            imageUrl="dudes-meme-with-sitting-sad-man.png"
                            link="/game"
                            button="Gioca"
                            loggedIn={props.loggedIn}
                        />
                    )}
                </Col>
                <Col md={4} className="mb-3">
                    <Card
                        title="Utente registrato"
                        description="Autenticati per salvare i tuoi progessi e giocare partite da tre round."
                        imageUrl="dudes-gentleman-in-suit-raising-his-glass.png"
                        link="/login"
                        button="Accedi"
                        loggedIn={props.loggedIn}
                    />
                </Col>
            </Row>
            {props.loggedIn && (
                <Row className="justify-content-center" >
                    <Col md={8} className="text-center">
                        <div className="mt-3">
                            <Link to="/profile" className="btn " style={{textDecoration:"none", fontWeight:"bold", borderRadius:"15px", backgroundColor:"#FFB86C", color:"white"}}>
                                Accedi al tuo storico partite
                            </Link>
                        </div>
                    </Col>
                </Row>
            )}
        </Container>
    );
}

// Props validation
Home.propTypes = {
    loggedIn: PropTypes.bool.isRequired
}

export default Home;
