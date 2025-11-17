import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usersApi from "../../api/usersApi";

function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [patching, setPatching] = useState(false);
  const [error, setError] = useState("");

  const loadUser = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await usersApi.getById(id);
      setUser(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [id]);

  const handleRoleChange = async (newRole) => {
    if (!user) return;
    setPatching(true);

    try {
      // PATCH only the role field
      await usersApi.patch(id, { role: newRole });
      setUser((prev) => ({ ...prev, role: newRole }));
    } catch (err) {
      console.error(err);
      alert("Role update failed.");
    } finally {
      setPatching(false);
    }
  };

  if (loading) return <p>Loading user...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return <p>No user found.</p>;

  return (
    <div>
      <h2>User Detail</h2>

      <p>
        <strong>Id:</strong> {user.id}
      </p>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>

      <div style={{ marginTop: "8px" }}>
        <span>Change role: </span>
        <button
          disabled={patching}
          onClick={() => handleRoleChange("Responder")}
        >
          Responder
        </button>{" "}
        <button
          disabled={patching}
          onClick={() => handleRoleChange("Dispatcher")}
        >
          Dispatcher
        </button>{" "}
        <button
          disabled={patching}
          onClick={() => handleRoleChange("Admin")}
        >
          Admin
        </button>
      </div>

      <div style={{ marginTop: "12px" }}>
        <button onClick={() => navigate(`/users/${id}/edit`)}>Edit</button>{" "}
        <button onClick={() => navigate("/users")}>Back to list</button>
      </div>
    </div>
  );
}

export default UserDetail;
