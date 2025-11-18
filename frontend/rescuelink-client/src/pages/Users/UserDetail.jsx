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
      <div className="detail-card">
        <div className="detail-top-row">
          <div className="detail-section-title">
            <h2>User Detail</h2>
          </div>
          <div className="detail-actions detail-actions-right">
            <button onClick={() => navigate(`/users/${id}/edit`)}>
              Edit
            </button>
            <button onClick={() => navigate("/users")}>
              Back to list
            </button>
          </div>
        </div>

        <div className="detail-header">
          <div>
            <div className="detail-id">#{user.id}</div>
            <h3 className="detail-title">{user.name}</h3>
          </div>

          <span
            className={
              "status-chip " +
              (user.role === "Responder"
                ? "status-chip-open"
                : user.role === "Dispatcher"
                ? "status-chip-inprogress"
                : "status-chip-resolved")
            }
          >
            {user.role}
          </span>
        </div>

        <div className="detail-body">
          <div className="detail-row">
            <span className="detail-label">Email</span>
            <span className="detail-value">{user.email}</span>
          </div>
        </div>

        <div className="detail-status-section">
          <span className="detail-label">Change role</span>
          <div className="status-chip-group">
            <button
              type="button"
              disabled={patching}
              className={
                "status-chip status-chip-open" +
                (user.role === "Responder" ? " status-chip-active" : "")
              }
              onClick={() => handleRoleChange("Responder")}
            >
              Responder
            </button>
            <button
              type="button"
              disabled={patching}
              className={
                "status-chip status-chip-inprogress" +
                (user.role === "Dispatcher" ? " status-chip-active" : "")
              }
              onClick={() => handleRoleChange("Dispatcher")}
            >
              Dispatcher
            </button>
            <button
              type="button"
              disabled={patching}
              className={
                "status-chip status-chip-resolved" +
                (user.role === "Admin" ? " status-chip-active" : "")
              }
              onClick={() => handleRoleChange("Admin")}
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetail;
