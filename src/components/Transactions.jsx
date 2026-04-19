import { useEffect, useState } from "react";
import API from "../api";

function Transactions({ onLogout }) {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const res = await API.get("/transactions");
    setTransactions(res.data);
  };

  const addTransaction = async () => {
    const parsedAmount = parseFloat(amount);

    if (!description || isNaN(parsedAmount)) {
      alert("Invalid input");
      return;
    }

    await API.post("/transactions", {
      amount: parsedAmount,
      description,
    });

    setAmount("");
    setDescription("");
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

      <input
        type="text"
        inputMode="decimal"
        placeholder="Cantidad"
        value={amount}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*\.?\d{0,2}$/.test(value)) {
            setAmount(value);
          }
        }}
      />

      <input
        type="text"
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={addTransaction}>Add</button>

      <ul className="transaction-list">
        {transactions.map((t) => (
          <li key={t.id} className="transaction-item">
            ${Number(t.amount).toFixed(2)} - {t.description}
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