import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Transactions from "./components/Transactions";
import Users from "./components/Users";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/transactions" element={<Transactions/>} />
        <Route path="/users" element={<Users/>} />
      </Routes>
    </BrowserRouter>
  );
}