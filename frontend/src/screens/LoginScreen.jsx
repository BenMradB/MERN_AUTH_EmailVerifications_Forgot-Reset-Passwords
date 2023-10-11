import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { FormContainer } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/users.api.slice";
import { setCredentials } from "../slices/auth.slice";
import { toast } from "react-toastify";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
      toast.success(`${res.userName} just logged in`);
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
    }
  };

  useEffect(() => {
    if (userInfo) navigate("/");
  }, [navigate, userInfo]);

  return (
    <FormContainer>
      <h1> Sign In</h1>

      <Form onSubmit={submitHandler}>
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

        <Button type="submit" variant="primary" className="mt-2">
          {isLoading ? "Loading ..." : "Sign In"}
        </Button>

        <Row className="py-3">
          <Col>
            New customer? <Link to="/register">Register now</Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  );
};

export default LoginScreen;
