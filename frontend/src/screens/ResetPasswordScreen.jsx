import React, { useState } from "react";
import { FormContainer } from "../components";
import { Button, Form } from "react-bootstrap";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useResetPasswordMutation } from "../slices/users.api.slice";
import { toast } from "react-toastify";

const ResetPasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { id, token } = useParams();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;
    if (password !== confirmPassword) {
      toast.error("Passwords do not match .");
      return;
    }

    try {
      const res = await resetPassword({ password, id, token }).unwrap();
      toast.success(
        `${res.userName} you're password is reset successfully. try to login again.`
      );
      navigate("/login");
    } catch (err) {
      toast.error(err?.data?.message || err?.error || err.message);
    }
  };

  return (
    <FormContainer>
      <h1>Reset Password</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-2">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            placeholder="Type your new password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Re-Type The Password</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            placeholder="Re-Type your new password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" className="mt-3 w-100">
          {isLoading ? "Restting ..." : "Reset Password"}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ResetPasswordScreen;
