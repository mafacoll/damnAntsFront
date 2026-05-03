import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Users from "./components/Users";
import Transactions from "./components/transactions";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/transactions" element={<Transactions/>} />
        <Route path="/users" element={<Users/>} />
        <Route path="/transactions/:userId" element={<Transactions />} />
      </Routes>
    </BrowserRouter>
  );
}