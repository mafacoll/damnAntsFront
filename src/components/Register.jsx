import { useState } from "react";
import API from "../api";

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPassword = (password) => {
  return /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/.test(password);
};


function Register({ onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

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

    if (!username || !password) {
      alert("Please fill all fields");
      return;
    }

    if (!name) {
      alert("Please enter your name");
      return;   
    }

    try {
      await API.post("/register", {
        username,
        password,
        name,
      });

      alert("Account created! You can now log in.");
      onSwitchToLogin();
    } catch (err) {
      alert(err.response?.data?.detail || "Error creating account");
    }
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <button type="submit">Create Account</button>
      </form>

      <p>
        Already have an account?{" "}
        <button onClick={onSwitchToLogin}>Login</button>
      </p>
    </div>
  );
}

export default Register;