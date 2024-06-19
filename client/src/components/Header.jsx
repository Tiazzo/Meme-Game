import PropTypes from "prop-types";
import { Col, Container, Row, Image } from "react-bootstrap/";
import { LogoutButton, LoginButton } from './Auth';
import { useLocation } from "react-router-dom";

function Header(props) {
    const location = useLocation();
    const hideLoginButton = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/game';

    return (
        <header className="py-2 border-bottom bg-primary text-light">
            <Container fluid>
                <Row className="align-items-center">
                    <Col xs={12} md={4} className="d-flex justify-content-center justify-content-md-start mb-2 mb-md-0">
                        <a href="/" className="d-flex align-items-center text-light text-decoration-none">
                            <Image src="public/icons8-monkas-48.png" roundedCircle height="40" className="me-2" />
                            <i className="bi bi-collection-play me-2"></i>
                            <span className="h5 mb-0">What Do You Meme</span>
                        </a>
                    </Col>
                    <Col xs={12} md={4} className="d-flex justify-content-center justify-content-md-end">
                        {props.loggedIn ? (
                            <LogoutButton logout={props.logout} />
                        ) : (
                            !hideLoginButton && <LoginButton />
                        )}
                    </Col>
                </Row>
            </Container>
        </header>
    );
}

Header.propTypes = {
    logout: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired,
}

export default Header;
