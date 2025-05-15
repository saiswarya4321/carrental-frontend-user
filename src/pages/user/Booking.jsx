import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

function Booking() {
  const [bookings, setBookings] = useState([]); // Store multiple bookings
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch booking details when the component mounts
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${baseUrl}/booking/userbooking`,{
          withCredentials:true
        }); // Fetch all bookings for the user
        setBookings(response.data); // Set the response data which is an array of bookings
        console.log(response.data);  // Log to ensure we get the data in the correct structure
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []); // Empty dependency array ensures it runs once when the component mounts

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (bookings.length === 0) {
    return <div>No bookings found for this user</div>;
  }

  const handleCancelBooking = async (bookingId) => {
    try {
      setLoading(true);
      await axios.patch(`${baseUrl}/booking/deletebooking/${bookingId}`);
      toast('Booking successfully canceled!');
      setBookings(bookings.filter(booking => booking._id !== bookingId)); // Remove canceled booking from state
    } catch (error) {
      console.error('Error canceling booking:', error);
      setError('Failed to cancel booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
    <h2 className="text-center mb-5">Your Bookings</h2>
  
    <Row className="g-4">
      {bookings.map((booking) => {
        const { carId, _id: bookingId, totalAmount, paymentStatus, status } = booking;
  
        if (!carId) {
          return (
            <Col key={bookingId} md={6}>
              <Card className="p-3 border-danger text-danger">
                Error: Car information is missing in the booking.
              </Card>
            </Col>
          );
        }
  
        return (
          <Col key={bookingId} md={6} lg={4}>
            <Card className="shadow-lg border-0 rounded-4 h-100">
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <Card.Title className="mb-3">
                    <h4 className="text-primary">{carId.model}</h4>
                  </Card.Title>
                  <Row className="text-muted">
                    <Col xs={6}>
                      <p><strong>Brand:</strong> {carId.brand}</p>
                      <p><strong>Price/Day:</strong> ₹{carId.pricePerDay}</p>
                      <p><strong>Payment:</strong> 
                        <span className={paymentStatus === 'completed' ? 'text-success' : 'text-warning'}>
                          {' '}{paymentStatus}
                        </span>
                      </p>
                    </Col>
                    <Col xs={6}>
                      <p><strong>Car ID:</strong> {carId._id}</p>
                      <p><strong>Booking:</strong> 
                        <span className={status === 'confirmed' ? 'text-success' : 'text-danger'}>
                          {' '}{status}
                        </span>
                      </p>
                      <p><strong>Total:</strong> ₹{totalAmount}</p>
                    </Col>
                  </Row>
                </div>
  
                <div className="text-center mt-3">
                  <Button
                    variant="outline-danger"
                    className="px-4 py-2"
                    onClick={() => handleCancelBooking(bookingId)}
                    disabled={loading}
                  >
                    Cancel Booking
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  </Container>
  
  );
}

export default Booking;
