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
                    setErrorMessage('');
                    setShow(false);
                    navigate("/");
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

    const loginContainer = {
        color: "#f9f9f9",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        paddingTop: "5px"
    };

    const formContainer = {
        backgroundColor: "#44475A",
        padding: "30px",
        borderRadius: "15px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)"
    };

    return (
        <Container style={loginContainer}>
            <Row className="justify-content-center align-items-center w-100">
                <Col md={4} className="d-none d-md-block">
                    <Image src="dudes-young-man-giving-a-presentation-about-something.png" fluid />
                </Col>
                <Col md={4} style={formContainer}>
                    <h1 style={{ color: "#F8F8F2" }}>Accedi</h1>
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
                        <Button className=" mt-3" style={{ backgroundColor: "#BD93F9", border: "none", width: "50%", borderRadius: "15px", alignSelf: "center" }} type="submit">Login</Button>
                    </Form>
                    <div className="mt-3 text-center">
                        <Link to="/" style={{
                            color: "#F8F8F2",
                            textDecoration: "none",
                            fontWeight: "bold",
                            transition: "color 0.3s"
                        }}>
                            Torna alla home
                        </Link>
                    </div>
                </Col>
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

export { LoginForm, LogoutButton };
