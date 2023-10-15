import React, { useState } from "react";
import { FormContainer } from "../components";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../slices/users.api.slice";
import { toast } from "react-toastify";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!email) return;
    try {
      const res = await forgotPassword({ email }).unwrap();
      toast.success(`Chackout your gmail inbox .`);
      navigate("/login");
    } catch (err) {
      toast.error(err?.data?.message || err?.error || err.message);
    }
  };
  return (
    <FormContainer>
      <h1>Send Reset Password Request</h1>
      <Form onSubmit={onSubmitHandler} className="mt-2">
        <Form.Group className="mb-2">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            placeholder="Type your email to send u a reset password"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" className="w-100 mb-2">
          {isLoading ? "Sending ..." : "Send"}
        </Button>
      </Form>

      <Row>
        <Col>
          Already have an account? <Link to="/login">Sign In</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default ForgotPasswordScreen;
