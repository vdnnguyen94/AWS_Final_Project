import { useState } from "react";
import { useNavigate } from "react-router-dom";
import mediaApi from "../../api/mediaApi";

function MediaUpload() {
  const navigate = useNavigate();

  const [incidentId, setIncidentId] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please choose a file.");
      return;
    }

    if (!incidentId.trim()) {
      alert("Please enter an incident id.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("incidentId", incidentId.trim());
      formData.append("description", description);
      formData.append("file", file); // backend should expect the field name 'file'

      await mediaApi.uploadFile(formData);
      navigate("/media");
    } catch (err) {
      console.error(err);
      setError("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="detail-card">
        <div className="detail-top-row">
          <div className="detail-section-title">
            <h2>Upload Media</h2>
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}

        <form onSubmit={handleSubmit} className="form-layout form-fullwidth">
          <div>
            <label>
              Incident Id
              <input
                value={incidentId}
                onChange={(e) => setIncidentId(e.target.value)}
                required
              />
            </label>
          </div>

          <div>
            <label>
              Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </label>
          </div>

          <div>
            <label>
              File
              <input
                type="file"
                onChange={handleFileChange}
                required
              />
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate("/media")}
              disabled={uploading}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MediaUpload;
