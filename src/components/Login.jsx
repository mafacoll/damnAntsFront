import { useState } from "react";
import API from "../api";

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPassword = (password) => {
  return /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/.test(password);
};


function Login({ onLogin, onSwitchToRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(username)) {
        alert("Enter a valid email");
        return;
    }   

    if (!isValidPassword(password)) {
        alert("Invalid password format");
        return;
    }  

    try {
      const res = await API.post("/login", {
        username,
        password,
      });

      localStorage.setItem("user", res.data.username);
      onLogin(res.data.role);
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>

      <p>
        Don’t have an account?{" "}
        <button onClick={onSwitchToRegister}>Sign Up</button>
      </p>
    </div>
  );
}

export default Login;