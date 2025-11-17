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

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("incidentId", incidentId);
      formData.append("description", description);
      formData.append("file", file); // field name should match backend

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
      <h2>Upload Media</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
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
            <input type="file" onChange={handleFileChange} required />
          </label>
        </div>

        <div style={{ marginTop: "12px" }}>
          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </button>{" "}
          <button
            type="button"
            onClick={() => navigate("/media")}
            disabled={uploading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default MediaUpload;
