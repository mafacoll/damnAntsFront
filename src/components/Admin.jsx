import { useEffect, useState } from "react";
import API from "../api";

function Admin({ onLogout }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch {
      alert("Not authorized");
    }
  };

  return (
    <div className="container">
      <h2>Admin Panel</h2>

      <button onClick={onLogout}>Logout</button>

      <ul className="transaction-list">
        {users.map((user, index) => (
         <li key={index} className="transaction-item">
           {user.name} ({user.email})
        </li>
  ))}
</ul>
    </div>
  );
}

export default Admin;