import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import incidentsApi from "../../api/incidentsApi";

const emptyForm = {
  title: "",
  description: "",
  status: "Open",
  latitude: "",
  longitude: "",
};

function IncidentForm({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === "edit";

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // when editing mode, load the current data
  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchIncident = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await incidentsApi.getById(id);
        const data = res.data;

        setForm({
          title: data.title ?? "",
          description: data.description ?? "",
          status: data.status ?? "Open",
          latitude: data.latitude ?? "",
          longitude: data.longitude ?? "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load incident.");
      } finally {
        setLoading(false);
      }
    };

    fetchIncident();
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

    // change the number field to 'number' (if backend is double/float)
    const payload = {
      ...form,
      latitude: form.latitude ? Number(form.latitude) : null,
      longitude: form.longitude ? Number(form.longitude) : null,
    };

    try {
      if (isEdit) {
        await incidentsApi.update(id, payload);
      } else {
        await incidentsApi.create(payload);
      }

      navigate("/incidents");
    } catch (err) {
      console.error(err);
      setError("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading incident...</p>;

  return (
    <div>
      <h2>{isEdit ? "Edit Incident" : "New Incident"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <div>
          <label>
            Title
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
            />
          </label>
        </div>

        <div>
          <label>
            Status
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Open">Open</option>
              <option value="InProgress">InProgress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </label>
        </div>

        <div>
          <label>
            Latitude
            <input
              name="latitude"
              type="number"
              step="0.000001"
              value={form.latitude}
              onChange={handleChange}
            />
          </label>
        </div>

        <div>
          <label>
            Longitude
            <input
              name="longitude"
              type="number"
              step="0.000001"
              value={form.longitude}
              onChange={handleChange}
            />
          </label>
        </div>

        <div style={{ marginTop: "12px" }}>
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>{" "}
          <button
            type="button"
            onClick={() => navigate("/incidents")}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default IncidentForm;
