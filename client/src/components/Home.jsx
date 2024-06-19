import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Card from './Card';
import PropTypes from 'prop-types';

const Home = (props) => {
  return (
    <Container fluid className="flex-grow-1 d-flex flex-column">
      <h1>Benvenuto in <span style={{ color: 'red' }}>What Do You Meme</span>!</h1>
      <h2>Seleziona la modalità di gioco:</h2>
      <Row className="justify-content-center">
        <Col md={4} className="mb-3">
          <Card
            title="Ospite"
            description="Gioca un partida da un singolo round senza dover accedere."
            imageUrl="dudes-meme-with-sitting-sad-man.png"
            link="/game"
            button="Gioca"
          />
        </Col>
        <Col md={4} className="mb-3">
          <Card
            title="Utente registrato"
            description="Gioca tre round e salva i tuoi progressi."
            imageUrl="dudes-gentleman-in-suit-raising-his-glass.png"
            link="/login"
            button="Accedi"
          />
        </Col>
      </Row>
      {props.loggedIn && (
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <div className="mt-3">
              <Link to="/game-history" className="btn btn-info">
                Accedi al tuo storico partite
              </Link>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}

//Props validation
Home.propTypes = {
  loggedIn: PropTypes.bool.isRequired
}

export default Home;