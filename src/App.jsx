import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Transactions from "./components/Transactions";
import Admin from "./components/Admin";

function App() {
  const [role, setRole] = useState(null);
  const [page, setPage] = useState("login"); // login or register

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user === "admin@example.com") setRole("admin");
    else if (user) setRole("user");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setRole(null);
    setPage("login");
  };

  if (!role) {
    if (page === "register") {
      return <Register onSwitchToLogin={() => setPage("login")} />;
    }

    return (
      <Login
        onLogin={setRole}
        onSwitchToRegister={() => setPage("register")}
      />
    );
  }

  if (role === "admin") {
    return <Admin onLogout={handleLogout} />;
  }

  return <Transactions onLogout={handleLogout} />;
}

export default App;