import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    localStorage.setItem("user", JSON.stringify(data));

    if (!res.ok) {
      setError(data.detail);
      return;
    }

    // guardar usuario
    localStorage.setItem("user", JSON.stringify(data));

    if (data.is_admin) {
        navigate("/users");
      } else {
        navigate("/transactions");
      }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input name="username" onChange={handleChange} placeholder="username" />
        <input name="password" type="password" onChange={handleChange} placeholder="password" />
        <button type="submit">Login</button>
      </form>

      <p>
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}