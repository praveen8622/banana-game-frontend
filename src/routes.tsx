import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
