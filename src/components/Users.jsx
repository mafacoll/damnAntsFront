import { useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({});
  const [userToDelete, setUserToDelete] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchUsers = () => {
    fetch("http://127.0.0.1:8000/users", {
      headers: {
        "user-id": currentUser.id
      }
    })
      .then(res => res.json())
      .then(data => setUsers(data));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🗑 DELETE
  const deleteUser = async (id) => {

    const res = await fetch(`http://127.0.0.1:8000/users/${id}`, {
      method: "DELETE",
      headers: {
        "user-id": currentUser.id
      }
    });

    const data = await res.json();
    console.log("DELETE RESPONSE:", res.status, data);

    fetchUsers();
  };

  // ✏️ START EDIT
  const startEdit = (user) => {
    setEditingUser(user.id);
    setForm(user);
  };

  // ✏️ SAVE EDIT
  const saveEdit = async () => {
    await fetch(`http://127.0.0.1:8000/users/${editingUser}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "user-id": currentUser.id
      },
      body: JSON.stringify(form)
    });

    setEditingUser(null);
    fetchUsers();
  };

  return (
    <div>
      <h2>Users</h2>

      {users.map(user => (
        <div key={user.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>

          {editingUser === user.id ? (
            <>
              <input
                value={form.username || ""}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />

              <input
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <button onClick={saveEdit}>Guardar</button>
              <button onClick={() => setEditingUser(null)}>Cancelar</button>
            </>
          ) : (
            <>
              <p><b>{user.username}</b></p>
              <p>{user.email}</p>
              <p>{user.birth_date}</p>
              <p>{user.is_admin ? "Admin" : "User"}</p>

              <button onClick={() => startEdit(user)}>Editar</button>
              <button onClick={() => setUserToDelete(user.id)}>Eliminar</button>
              
            </>
          )}

        </div>
      ))}

      {userToDelete && (
        <ConfirmModal
          message="¿Seguro que quieres eliminar este usuario?"
          onConfirm={async () => {
           await deleteUser(userToDelete);
            setUserToDelete(null);
          }}
          onCancel={() => setUserToDelete(null)}
        />
      )}  
    </div>
  );
}