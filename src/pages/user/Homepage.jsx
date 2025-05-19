import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Carousel from 'react-bootstrap/Carousel';

function Homepage() {
  const userData = useSelector((state) => state.user);
  const navigate = useNavigate();
  

  const [query, setQuery] = useState('');
  const [cars, setCar] = useState([]);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  axios.defaults.withCredentials = true;

  const fetchCars = async (searchQuery = '') => {
    try {
      const res = await axios.get(`${baseUrl}/cars/listcar?search=${searchQuery}`, {
        withCredentials: true,
      });

      const fetchedCars = res.data?.carList || [];

      if (fetchedCars.length === 0) {
        toast.error("No data found!");

        // Restore from localStorage
        const stored = localStorage.getItem("carList");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setCar(parsed);
          }
        }
        return;
      }

      // Set and store new car list
      setCar(fetchedCars);
      localStorage.setItem("carList", JSON.stringify(fetchedCars));
    } catch (error) {
      console.error("Axios error:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || error.message || "Something went wrong!", {
        toastId: "fetch-car-error",
      });
      navigate("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    // Load cached cars on initial load
    const storedCars = localStorage.getItem("carList");
    if (storedCars) {
      try {
        const parsedCars = JSON.parse(storedCars);
        if (Array.isArray(parsedCars)) {
          setCar(parsedCars);
        }
      } catch (e) {
        console.error("Error parsing local carList:", e);
      }
    }

    // Fetch fresh data
    fetchCars();
  }, []);

  // Auto search when query changes (especially when cleared)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCars(query);
    }, 500); // debounce for smoother experience

    return () => clearTimeout(delayDebounce);
  }, [query]);


  const handleUnavailable = async (car,e) => {
    try {
      if (!car.availability) {
        e.preventDefault();
        toast.error("This car is not available");
        navigate("/userdashboard/homepage");
       
      }
      // If needed, add more logic here for available cars
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingTop: '20px' }}>
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

      
      <Form className="mb-4 mt-4" onSubmit={(e) => {
        e.preventDefault();
        fetchCars(query);
      }}>
        <Row className="justify-content-center">
          <Col xs={10} sm={8} md={6} className="d-flex gap-2">
            <Form.Control
              type="text"
              placeholder="Search cars by brand, model, location..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="rounded-pill px-3"
            />
            <Button type="submit" variant="primary" className="rounded-pill px-4">
              Search
            </Button>
          </Col>
        </Row>
      </Form>

      <Row className="g-4">
        {cars.map((car) => (
          <Col key={car._id} xs={12} sm={6} md={4} lg={3}>
            <Card className="h-100 shadow-sm rounded-4">
              <Card.Img
                variant="top"
                src={car.image}
                style={{ height: '180px', objectFit: 'cover', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold text-center">{car.brand} {car.model}</Card.Title>
                <Card.Text className="text-muted small text-center mb-2">
                  ₹{car.pricePerDay}/day · {car.location}
                </Card.Text>
                <div className="text-center mb-3">
                  <span
                    className={`badge px-3 py-2 rounded-pill ${
                      car.availability ? 'bg-success' : 'bg-secondary'
                    }`}
                  >
                    {car.availability ? "Available" : "Not Available"}
                  </span>
                </div>
                <div className="d-flex flex-column align-items-center gap-2 mt-auto">
                  <Link to={`/userdashboard/cardetails/${car._id}`}>
                    <Button
                      variant="outline-primary"
                      className="rounded-pill fw-semibold px-4"
                      onClick={(e) => handleUnavailable(car, e)}
                    >
                      More 
                    </Button>
                  </Link>
                  <Link to={`/userdashboard/reviews/${car._id}`}>
                    <Button variant="outline-warning" className="rounded-pill fw-semibold px-4">
                      Reviews
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  </div>
  );
}

export default Homepage;
