import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Transactions() {
  
  const { userId } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const targetUserId = userId || currentUser.id;
  const isAdminView = !!userId;

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
  const [filterDate, setFilterDate] = useState("");
  
  // GET TRANSACTIONS
  const fetchTransactions = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/transactions", {
        headers: {
          "user-id": String(targetUserId)
        }
      });

      const data = await res.json();

      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("ERROR FETCH:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // CREATE / UPDATE
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
          "user-id": String(targetUserId)
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

  // EDIT
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

  // DELETE
  const handleDelete = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/transactions/${id}`, {
        method: "DELETE",
        headers: {
          "user-id": String(targetUserId)
        }
      });

      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    if (!filterDate) return true;

    const txDate = new Date(t.date);
    const filter = new Date(filterDate);

    return (
      txDate.getMonth() === filter.getMonth() &&
      txDate.getFullYear() === filter.getFullYear()
    );  
  });

  const ingresos = filteredTransactions.filter(t => t.amount > 0);
  const gastos = filteredTransactions.filter(t => t.amount < 0);

  const getBalance = () => {
  let total = 0;

  filteredTransactions.forEach((t) => {
    total += Number(t.amount);
  });

  return total.toFixed(2);
};
  // UI
  return (
    <div>
      <h2>Transactions</h2>

      <h2>💸 Transactions</h2>

      <h3>
        Balance: 
        <span style={{ color: getBalance() >= 0 ? "lightgreen" : "red" }}>
          {getBalance()} €
        </span>
      </h3>

      {/* ======================
          FORMULARIO
      ====================== */}
      {!isAdminView && (
        <div>
        {/* FORMULARIO */}
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
        
        {/* 
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
          */}


        <button type="submit">
          {editingId ? "Actualizar" : "Crear"}
        </button>
      </form>
        </div>
      )}
      
    
      {message && <p>{message}</p>}
      
      <h3>Filtrar por mes</h3>

      <input
        type="month"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
      />  
      {/* ======================
          LISTA
      ====================== */}
      <h3>Ingresos</h3>

    {ingresos.length === 0 ? (
      <p>No hay ingresos</p>
    ) : (
      ingresos.map((t) => (
        <div key={t.id} style={{ border: "1px solid green", margin: 5, padding: 5 }}>
          <p><b>{t.description}</b></p>
          <p style={{ color: "green" }}>
            +{t.amount} {t.currency}
          </p>
          <p>{t.date}</p>
          {!isAdminView && (
             <button onClick={() => handleEdit(t)}>Editar</button>
          )}
          {!isAdminView && (
            <button onClick={() => handleDelete(t.id)}>Eliminar</button>
          )}
        </div>
      ))
    )}

      <h3>Gastos</h3>

    {gastos.length === 0 ? (
      <p>No hay gastos</p>
    ) : (
      gastos.map((t) => (
        <div key={t.id} style={{ border: "1px solid red", margin: 5, padding: 5 }}>
          <p><b>{t.description}</b></p>
          <p style={{ color: "red" }}>
            {t.amount} {t.currency}
          </p>
          <p>{t.date}</p>
          {!isAdminView && (
            <button onClick={() => handleEdit(t)}>Editar</button>
          )}
          {!isAdminView && (
            <button onClick={() => handleDelete(t.id)}>Eliminar</button>
          )}
        </div>
      ))
    )}
    </div>
  );
}