import { Header } from "./components";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <Header />
      <Container className="my-2">
        <ToastContainer theme="dark" />
        <Outlet />
      </Container>
    </>
  );
};

export default App;
