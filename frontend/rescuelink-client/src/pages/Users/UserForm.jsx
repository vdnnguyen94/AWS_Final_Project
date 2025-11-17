import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usersApi from "../../api/usersApi";

const emptyForm = {
  name: "",
  email: "",
  role: "Responder",
};

function UserForm({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === "edit";

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await usersApi.getById(id);
        const data = res.data;

        setForm({
          name: data.name ?? "",
          email: data.email ?? "",
          role: data.role ?? "Responder",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load user.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (isEdit) {
        await usersApi.update(id, form);
      } else {
        await usersApi.create(form);
      }
      navigate("/users");
    } catch (err) {
      console.error(err);
      setError("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading user...</p>;

  return (
    <div>
      <h2>{isEdit ? "Edit User" : "New User"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <div>
          <label>
            Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Role
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="Responder">Responder</option>
              <option value="Dispatcher">Dispatcher</option>
              <option value="Admin">Admin</option>
            </select>
          </label>
        </div>

        <div style={{ marginTop: "12px" }}>
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>{" "}
          <button
            type="button"
            onClick={() => navigate("/users")}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserForm;
