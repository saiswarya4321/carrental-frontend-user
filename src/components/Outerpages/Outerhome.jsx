import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';  
import Carousel from 'react-bootstrap/Carousel';

function Outerhome() {
  const { darkMode } = useTheme();  

  return (
    <div className={darkMode ? 'bg-dark text-white' : 'bg-light text-dark'}> {/* Conditional classes based on dark mode */}
      <div className="py-5">
        <Container>

<Carousel data-bs-theme="dark">
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://images.pexels.com/photos/1009871/pexels-photo-1009871.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt="First slide"
        />
        <Carousel.Caption>
          
          <p>"Rent fast. Drive smart.
Freedom is just a key away."

</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://images.pexels.com/photos/533562/pexels-photo-533562.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt="Second slide"
        />
        <Carousel.Caption>
          
          <p>"Where your adventure begins,
with the perfect ride every time."

</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://images.pexels.com/photos/221325/pexels-photo-221325.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt="Third slide"
        />
        <Carousel.Caption>
          
          <p>
           "Drive the journey, not just the car.
Explore more with comfort and style."
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>

          {/* Hero Section */}
          <Row className="align-items-center mb-5 mt-5">
            <Col md={6}>
              <h1 className="display-5 fw-bold mb-3">Find Your Perfect Ride</h1>
              <p className="lead">
                Welcome to Speedy Rentals — your trusted partner in affordable and flexible car rentals.
              </p>
              <Button as={Link} to="/signup" variant={darkMode ? 'outline-light' : 'primary'} size="lg" className="mt-3">
                Get Started
              </Button>
            </Col>
            <Col md={6} sm={6} xs={6} className='mt-3'>
              <img
                src="https://rukminim2.flixcart.com/image/850/1000/xif0q/poster/z/u/q/small-spos14075-poster-audi-a4-audi-red-car-luxury-car-car-original-imagkb9awpzuytcj.jpeg?q=20&crop=false"
                alt="Car Rental"
                className="img-fluid rounded shadow" style={{ width: '300px' }}
              />
            </Col>
          </Row>

          {/* Features Section */}
          <h2 className="text-center fw-semibold mb-4">Why Choose Us?</h2>
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>Wide Selection</Card.Title>
                  <Card.Text>Choose from a wide variety of cars, from economy to luxury models.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>Affordable Prices</Card.Title>
                  <Card.Text>Enjoy competitive pricing with no hidden fees or surprises.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>24/7 Support</Card.Title>
                  <Card.Text>We're here for you any time, day or night, for booking and support.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Outerhome;
