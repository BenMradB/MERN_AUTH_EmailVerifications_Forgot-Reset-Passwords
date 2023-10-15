import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { FormContainer } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUpdateUserMutation } from "../slices/users.api.slice";
import { setCredentials } from "../slices/auth.slice";

const ProfileScreen = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email || !userName) return;
    if (confirmPassword !== password) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await updateUser({
        userName,
        email,
        password,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated successfully");
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
    }
  };

  useEffect(() => {
    setUserName(userInfo.userName);
    setEmail(userInfo.email);
  }, [userInfo.userName, userInfo.email]);

  return (
    <FormContainer>
      <h1> Update Profile</h1>

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

        <Button type="submit" variant="primary" className="mt-2">
          {isLoading ? "Updating ..." : "Update"}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ProfileScreen;
