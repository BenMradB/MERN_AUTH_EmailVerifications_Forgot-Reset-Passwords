import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store.js";
import {
  HomeScreen,
  LoginScreen,
  ProfileScreen,
  RegisterScreen,
} from "./screens";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" index element={<HomeScreen />} />
      <Route path="login" index element={<LoginScreen />} />
      <Route path="register" index element={<RegisterScreen />} />
      <Route path="" element={<PrivateRoute />}>
        <Route path="profile" element={<ProfileScreen />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
