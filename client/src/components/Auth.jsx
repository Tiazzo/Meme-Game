import { useState } from 'react';
import { Alert, Button, Form, Row, Image, Container } from 'react-bootstrap';
import Col from "react-bootstrap/Col";
import { useNavigate, Link } from 'react-router-dom';
import PropTypes from "prop-types";

function LoginForm(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [show, setShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const credentials = { username, password };
        props.login(credentials)
            .then((user) => {
                if (user) {
                    setErrorMessage(''); // Reset error message
                    setShow(false);      // Hide alert
                    navigate("/game");   // Navigate only if login is successful
                } else {
                    setErrorMessage("Invalid username and/or password");
                    setShow(true);
                }
            })
            .catch((err) => {
                setErrorMessage(err.message);
                setShow(true);
            });
    };

    return (
        <Container className="login-container">
            <Row className="justify-content-center align-items-center w-100">
                <Col md={4} className="d-none d-md-block">
                    <Image src="dudes-young-man-giving-a-presentation-about-something.png" fluid />
                </Col>
                <Col md={4} className="form-container">
                    <h1 className="pb-3"><span style={{ color: "#181818" }}>Accedi</span></h1>
                    <Form onSubmit={handleSubmit}>
                        <Alert
                            dismissible
                            show={show}
                            onClose={() => setShow(false)}
                            variant="danger">
                            {errorMessage}
                        </Alert>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={username}
                                placeholder="Example: pippo@polito.it"
                                onChange={(ev) => setUsername(ev.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                placeholder="secret password"
                                onChange={(ev) => setPassword(ev.target.value)}
                                required
                                minLength={6}
                            />
                        </Form.Group>
                        <Button className="mt-3" type="submit">Login</Button>
                    </Form>
                </Col>
            </Row>
            <Row>
                <div className="mt-3 text-center">
                    <Link to="/" className="home-link">
                        Torna alla <span className="home-text">home</span>
                    </Link>
                </div>
            </Row>
        </Container>
    );
}

LoginForm.propTypes = {
    login: PropTypes.func,
}

function LogoutButton(props) {
    return (
        <Button variant="outline-light" onClick={props.logout}>Logout</Button>
    )
}

LogoutButton.propTypes = {
    logout: PropTypes.func
}

function LoginButton() {
    const navigate = useNavigate();
    return (
        <Button variant="outline-light" onClick={() => navigate('/login')}>Login</Button>
    )
}

export { LoginForm, LogoutButton, LoginButton };
