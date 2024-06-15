import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <>
            <Row><Col> <img src="dudes-doodle-character-trying-to-see-something.png" alt="page not found" className="my-3" style={{ display: 'block' }} />
                <Row><Col><h2>Error: page not found!</h2></Col></Row>
            </Col></Row>
            <Row><Col> <Link to="/" className="btn btn-primary mt-2 my-5">Go Home!</Link> </Col></Row>
        </>
    );
}