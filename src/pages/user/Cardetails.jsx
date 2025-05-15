import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { loadStripe } from '@stripe/stripe-js';
import Form from 'react-bootstrap/Form';
import { useSelector } from 'react-redux';

const stripePromise = loadStripe(import.meta.env.VITE_PUBLISHED_KEY_STRIPE);
console.log(import.meta.env.VITE_PUBLISHED_KEY_STRIPE);

function Cardetails() {
  const { id } = useParams();
  const [cars, setCar] = useState({});
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [days, setDays] = useState(1);

  const user = useSelector((state) => state.user);  // Get the user from Redux
  const user_id = user?._id;  // Get the user ID from Redux
  console.log("User from Redux:", user);

  useEffect(() => {
    axios.get(`${baseUrl}/cars/getcars/${id}`)
      .then((res) => {
        console.log(res.data);
        setCar(res.data);
      })
      .catch((err) => {
        console.error("Error fetching car details:", err);
      });
  }, [id]);

  const makePayment = async () => {
    if (!cars || !cars._id) {
      console.error("Invalid car data:", cars);
      return;  // Prevent further execution if car data is invalid
    }
    console.log("Car data before payment:", cars);

    const body = {
      products: cars,
      days: days,
      userId: user_id,
    };
    try {
      localStorage.setItem("carId", cars._id);
      localStorage.setItem("days", days);
      localStorage.setItem("carData", JSON.stringify(cars));  // Add JSON.stringify

      const res = await axios.post(`${baseUrl}/payment/makepayment`, body);
      console.log("Response", res);

      const session = res.data.sessionId;
      const stripe = await stripePromise;
      if (stripe) {
        const result = await stripe.redirectToCheckout({ sessionId: session });
        if (result.error) {
          console.log(result.error.message);
        } else {





          navigate('/payment/success', {
            state: {
              car: cars,
              userId: user_id,
              paymentDetails: {
                status: "completed",
                amount: cars.pricePerDay * days,
                sessionId: session,
                days: days,
              },
            },
          });
        }
      } else {
        console.log("Stripe failed to load");
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <Container className="py-5 d-flex justify-content-center">
    <Row className="w-100" style={{ maxWidth: '800px' }}>
      <Col md={12}>
        <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
          <Card.Img
            src={cars.image}
            alt="Car"
            style={{ height: '350px', objectFit: 'cover' }}
          />
          <Card.Body className="p-4">
            <h3 className="mb-3">{cars.brand} {cars.model}</h3>
            <Row className="mb-3 text-start">
              <Col sm={6}>
                <p><strong>Year:</strong> {cars.year}</p>
                <p><strong>Location:</strong> {cars.location}</p>
                <p><strong>Registration Number:</strong> {cars.registrationNumber}</p>
              </Col>
              <Col sm={6}>
                <p><strong>Vehicle Number:</strong> {cars.vehicleNumber}</p>
                <p><strong>Price Per Day:</strong> ₹{cars.pricePerDay}</p>
                <p>
                  <strong>Availability:</strong>{' '}
                  <span className={cars.availability ? 'text-success' : 'text-danger'}>
                    {cars.availability ? 'Available' : 'Not Available'}
                  </span>
                </p>
              </Col>
            </Row>
  
            <p className="text-start"><strong>Description:</strong> {cars.description}</p>
  
            <Form.Group className="my-4 w-50 mx-auto">
              <Form.Label><strong>Number of Days</strong></Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="text-center"
              />
            </Form.Group>
  
            <div className="d-flex justify-content-center">
              <Button
                variant="danger"
                className="px-5 py-2 rounded-pill fw-semibold"
                onClick={makePayment}
                disabled={!cars.availability}
              >
                Book Now
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
  
  );
}

export default Cardetails;
