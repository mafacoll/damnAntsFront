import { useEffect, useState } from "react";

export default function Transactions() {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    description: "",
    date: "",
    amount: "",
    currency: "EUR",
    is_recurring: false
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  // ======================
  // 🔄 GET TRANSACTIONS
  // ======================
  const fetchTransactions = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/transactions", {
        headers: {
          "user-id": String(currentUser.id)
        }
      });

      const data = await res.json();
      console.log("DATA:", data);

      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("ERROR FETCH:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ======================
  // ➕ CREATE / UPDATE
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const url = editingId
        ? `http://127.0.0.1:8000/transactions/${editingId}`
        : "http://127.0.0.1:8000/transactions";

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "user-id": String(currentUser.id)
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.detail || "Error");
        return;
      }

      setMessage(editingId ? "Actualizada" : "Creada");

      setForm({
        description: "",
        date: "",
        amount: "",
        currency: "EUR",
        is_recurring: false
      });

      setEditingId(null);
      fetchTransactions();

    } catch (err) {
      console.error(err);
      setMessage("Error conexión");
    }
  };

  // ======================
  // ✏️ EDIT
  // ======================
  const handleEdit = (t) => {
    setForm({
      description: t.description,
      date: t.date,
      amount: t.amount,
      currency: t.currency,
      is_recurring: t.is_recurring
    });

    setEditingId(t.id);
  };

  // ======================
  // ❌ DELETE
  // ======================
  const handleDelete = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/transactions/${id}`, {
        method: "DELETE",
        headers: {
          "user-id": String(currentUser.id)
        }
      });

      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  // ======================
  // UI
  // ======================
  return (
    <div>
      <h2>Transactions</h2>

      {/* ======================
          🧾 FORMULARIO
      ====================== */}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Descripción"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="date"
          value={form.date}
          onChange={(e) =>
            setForm({ ...form, date: e.target.value })
          }
        />

        <input
          type="number"
          step="0.01"
          placeholder="Cantidad"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
        />

        <select
          value={form.currency}
          onChange={(e) =>
            setForm({ ...form, currency: e.target.value })
          }
        >
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={form.is_recurring}
            onChange={(e) =>
              setForm({ ...form, is_recurring: e.target.checked })
            }
          />
          Recurrente
        </label>

        <button type="submit">
          {editingId ? "Actualizar" : "Crear"}
        </button>
      </form>

      {message && <p>{message}</p>}

      {/* ======================
          📋 LISTA
      ====================== */}
      <h3>Lista de transacciones</h3>

      {transactions.length === 0 ? (
        <p>No hay transacciones</p>
      ) : (
        transactions.map((t) => (
          <div key={t.id} style={{ border: "1px solid gray", margin: 10, padding: 10 }}>
            <p><b>{t.description}</b></p>
            <p>{t.amount} {t.currency}</p>
            <p>{t.date}</p>

            <button onClick={() => handleEdit(t)}>Editar</button>
            <button onClick={() => handleDelete(t.id)}>Eliminar</button>
          </div>
        ))
      )}
    </div>
  );
}