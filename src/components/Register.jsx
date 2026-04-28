import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    birth_date: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password) =>
    /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/.test(password);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 🔥 VALIDACIONES FRONT
    if (!form.username || !form.email || !form.password || !form.birth_date) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (!isValidEmail(form.email)) {
      setError("Email inválido");
      return;
    }

    if (!isValidPassword(form.password)) {
      setError("Password débil (mín 8, 1 mayúscula, 1 símbolo)");
      return;
    }

    if (form.password.length > 72) {
      setError("Password demasiado larga");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          birth_date: form.birth_date
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Error al registrar");
        return;
      }

      setSuccess("Usuario registrado correctamente");

      // limpiar formulario
      setForm({
        username: "",
        email: "",
        password: "",
        birth_date: ""
      });

      // 🚀 REDIRECCIÓN A TRANSACTIONS
      setTimeout(() => {
        navigate("/transactions");
      }, 800);

    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="username"
          value={form.username}
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="password"
          value={form.password}
          onChange={handleChange}
        />

        <input
          name="birth_date"
          type="date"
          value={form.birth_date}
          onChange={handleChange}
        />

        <button type="submit">Register</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}