import { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div>
      <h2>Lista de usuarios</h2>

      <ul>
        {users.map(u => (
          <li key={u.id}>
            {u.username} - {u.email} - {u.is_admin ? "ADMIN" : "USER"}
          </li>
        ))}
      </ul>
    </div>
  );
}