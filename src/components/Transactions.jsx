import { useEffect, useState } from "react";
import API from "../api";

function Transactions({ onLogout }) {
  const [transactions, setTransactions] = useState([]);

  const [form, setForm] = useState({
    amount: "",
    description: "",
    date: "",
    recurrent: false,
    currency: "EUR"
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const res = await API.get(`/transactions/${user.id}`);
    setTransactions(res.data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const addTransaction = async () => {
    const parsedAmount = parseFloat(form.amount);

    if (!form.description || isNaN(parsedAmount) || !form.date) {
      alert("Todos los campos obligatorios");
      return;
    }

    await API.post("/transactions", {
      amount: parsedAmount,
      title: form.description,     // 🔥 backend usa "title"
      date: form.date,
      recurrent: form.recurrent,
      currency: form.currency,
      user_id: user.id
    });

    setForm({
      amount: "",
      description: "",
      date: "",
      recurrent: false,
      currency: "EUR"
    });

    fetchTransactions();
  };

  const deleteTransaction = async (id) => {
    await API.delete(`/transactions/${id}`);
    fetchTransactions();
  };

  return (
    <div className="container">
      <h2>Transactions</h2>

      <button onClick={onLogout}>Logout</button>

      {/* FORM */}
      <input
        type="text"
        inputMode="decimal"
        placeholder="Cantidad"
        value={form.amount}
        name="amount"
          onChange={(e) => {
          const value = e.target.value;

        if (/^\d*\.?\d{0,2}$/.test(value)) {
          setForm({ ...form, amount: value });
        }
      }}
      />

      <input
        type="text"
        placeholder="Descripción"
        value={form.description}
        name="description"
        onChange={handleChange}
      />

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
      />

      <label>
        Recurrente
        <input
          type="checkbox"
          name="recurrent"
          checked={form.recurrent}
          onChange={handleChange}
        />
      </label>

      <input
        type="text"
        name="currency"
        value={form.currency}
        onChange={handleChange}
      />

      <button onClick={addTransaction}>Add</button>

      {/* LISTA */}
      <ul className="transaction-list">
        {transactions.map((t) => (
          <li key={t.id} className="transaction-item">
            {t.title} - {t.amount} {t.currency} - {t.date}{" "}
            {t.recurrent ? "🔁" : ""}

            <button onClick={() => deleteTransaction(t.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Transactions;