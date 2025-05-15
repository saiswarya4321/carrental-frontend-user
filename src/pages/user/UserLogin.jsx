import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { saveuser } from '../../redux/Userslice';
import { useTheme } from '../../context/ThemeContext';

function UserLogin() {
  const [data, setData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(false);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  axios.defaults.withCredentials = true;

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${baseUrl}/user/login`, data, { withCredentials: true });
      localStorage.setItem('token', res.data.token);
      dispatch(saveuser(res.data.userExist));
      navigate('/userdashboard/homepage');
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid credentials');
    }
    finally{
      setLoading(false);
    }
  };

  const inputClass = `form-control rounded-3 ${darkMode ? 'bg-secondary text-white border-0' : ''}`;

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={5}>
          <Card className={`shadow-lg border-0 rounded-4 ${darkMode ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
            <Card.Body className="p-5">
              <h2 className="mb-4 text-center fw-bold"> Login</h2>
              {loading && <p className="text-center text-primary fw-semibold mb-3">Logging in... please wait</p>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control className={inputClass} type="email" name="email" onChange={handleChange} value={data.email} />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control className={inputClass} type="password" name="password" onChange={handleChange} value={data.password} />
                </Form.Group>
                <Button type="submit" className="w-100 rounded-3 fw-semibold">Login</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default UserLogin;
