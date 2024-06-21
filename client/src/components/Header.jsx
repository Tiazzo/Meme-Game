import PropTypes from "prop-types";
import { Col, Container, Row, Image, Button } from "react-bootstrap/";
import { LogoutButton } from './Auth';
import { useLocation, Link } from "react-router-dom";

function Header(props) {
    const location = useLocation();

    // Verifica esplicita per nascondere il bottone nelle route specificate
    const hideHomeButton = location.pathname === '/game' || location.pathname === '/game-history';

    return (
        <header style={{
            backgroundColor: "#282A36", color: "#f9f9f9", padding: "10px 0"
        }}>
            <Container fluid>
                <Row className="align-items-center">
                    <Col xs={12} md={4} className="d-flex justify-content-center justify-content-md-start mb-2 mb-md-0">
                        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit" }}>
                            <Image src="icons8-monkas-48.png" roundedCircle height="40" style={{ marginRight: "10px" }} />
                            <i className="bi bi-collection-play me-2"></i>
                            <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>What Do You Meme</span>
                        </Link>
                    </Col>
                    <Col  xs={12} md={{ span: 4, offset: 4 }} className="d-flex justify-content-end">
                        {props.loggedIn ? (
                            <LogoutButton logout={props.logout} />
                        ) : (
                            hideHomeButton && <Button variant="primary" as={Link} to="/">Torna alla home</Button>
                        )}
                    </Col>
                </Row>
            </Container>
        </header >
    );
}

Header.propTypes = {
    logout: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired,
}

export default Header;
