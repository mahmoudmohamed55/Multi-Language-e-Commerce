import { Box } from "@mui/material";
import { Route, Routes } from "react-router";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Header2 from "./Components/Header/Header2";
import Footer from "./Components/Footer/Footer";
import Header1 from "./Components/Header/Header1";
import RequireBack from "./Context/Auth/Requireback";
import Cart from "./Pages/Cart";
import Orders from "./Pages/Orders";
import RequireAuth from "./Context/Auth/RequireAuth";
import AdminDashboard from "./Pages/AdminDashboard";
import Error404 from "./Pages/404";
import Forbidden from "./Pages/403";

function App() {
  return (
    <>
      <Header1 />
      <Header2 />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<RequireBack />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route element={<RequireAuth />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        <Route path="/403" element={<Forbidden />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
