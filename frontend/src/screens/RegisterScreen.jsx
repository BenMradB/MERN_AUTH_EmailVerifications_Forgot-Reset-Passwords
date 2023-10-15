import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { FormContainer } from "../components";
import { useSelector } from "react-redux";
import { useRegisterMutation } from "../slices/users.api.slice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setCredentials } from "../slices/auth.slice";

const RegisterScreen = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [register, { isLoading }] = useRegisterMutation();

  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email || !password || !userName || !confirmPassword) return;
    if (confirmPassword !== password) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await register({ userName, email, password }).unwrap();
      navigate("/login");
      toast.info(
        `Checkout your gmail account inbox. An verification link has been sen to your account.`
      );
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
    }
  };

  useEffect(() => {
    if (userInfo) return navigate("/");
  }, [navigate, userInfo]);

  return (
    <FormContainer>
      <h1> Sign Up</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="userName">
          <Form.Label>User Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your User Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-2 w-100">
          {isLoading ? "Loading ..." : "Sign Up"}
        </Button>

        <Row className="py-3">
          <Col>
            Already have an account? <Link to="/login">Login now</Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  );
};

export default RegisterScreen;
