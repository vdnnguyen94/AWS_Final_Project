import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import mediaApi from "../../api/mediaApi";

function MediaForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    incidentId: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMedia = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await mediaApi.getById(id);
        const data = res.data;

        setForm({
          incidentId: data.incidentId ?? "",
          description: data.description ?? "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load media item.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadMedia();
    }
  }, [id]);

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
      const payload = {
        description: form.description,
      };

      await mediaApi.update(id, payload);
      navigate(`/media/${id}`);
    } catch (err) {
      console.error(err);
      setError("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading media...</p>;

  return (
    <div>
      <div className="detail-card">
        <div className="detail-top-row">
          <div className="detail-section-title">
            <h2>Edit Media</h2>
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}

        <form onSubmit={handleSubmit} className="form-layout form-fullwidth">
          <div>
            <label>
              Incident Id
              <input
                name="incidentId"
                value={form.incidentId}
                readOnly
              />
            </label>
          </div>

          <div>
            <label>
              Description
              <textarea
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(`/media/${id}`)}
              disabled={saving}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MediaForm;
