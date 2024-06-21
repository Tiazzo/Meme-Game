import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NotFound() {

    const notFoundContainer = {
        color: "#F8F8F2",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
    }
    return (
        <div style={notFoundContainer}>
            <Row>
                <Col>
                    <img src="dudes-doodle-character-trying-to-see-something.png" alt="page not found" className="not-found-image" />
                    <h2 className="not-found-text">Error: page not found!</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Link to="/" className="btn mt-2" style={{
                        color: "#F8F8F2",
                        textDecoration: "none",
                        fontWeight: "bold",
                        transition: "color 0.3s"
                    }}>Torna alla homepage</Link>
                </Col>
            </Row>
        </div >
    );
}
