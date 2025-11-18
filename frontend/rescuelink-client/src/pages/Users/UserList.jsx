import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import usersApi from "../../api/usersApi";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [roleFilter, setRoleFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await usersApi.getAll();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await usersApi.delete(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };

  const filteredUsers = useMemo(() => {
    let result = users;

    if (roleFilter !== "all") {
      result = result.filter(
        (u) =>
          u.role &&
          u.role.toLowerCase() === roleFilter.toLowerCase()
      );
    }

    if (searchText.trim()) {
      const keyword = searchText.toLowerCase();
      result = result.filter((u) => {
        const name = (u.name || "").toLowerCase();
        const email = (u.email || "").toLowerCase();
        return (
          String(u.id).includes(keyword) ||
          name.includes(keyword) ||
          email.includes(keyword)
        );
      });
    }

    return result;
  }, [users, roleFilter, searchText]);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Users</h2>

      <div className="filter-row">
        <div className="filter-left">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All roles</option>
            <option value="Admin">Admin</option>
            <option value="Responder">Responder</option>
            <option value="Dispatcher">Dispatcher</option>
          </select>

          <input
            type="text"
            placeholder="Search users..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="filter-right">
          <button onClick={() => navigate("/users/new")}>+ New User</button>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th className="table-actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td className="table-actions-cell">
                  <div className="action-buttons">
                    <button
                      className="btn-pill btn-view"
                      onClick={() => navigate(`/users/${u.id}`)}
                    >
                      View
                    </button>
                    <button
                      className="btn-pill btn-edit"
                      onClick={() => navigate(`/users/${u.id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-pill btn-delete"
                      onClick={() => handleDelete(u.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserList;
