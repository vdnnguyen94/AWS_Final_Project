import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import mediaApi from "../../api/mediaApi";

function MediaList() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadMedia = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await mediaApi.getAll();
      setMedia(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load media.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this media item?")) return;

    try {
      await mediaApi.delete(id);
      setMedia((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };

  if (loading) return <p>Loading media...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Media</h2>

      <button onClick={() => navigate("/media/upload")}>+ Upload Media</button>

      {media.length === 0 ? (
        <p>No media found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Incident Id</th>
              <th>Description</th>
              <th>Url</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {media.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.incidentId}</td>
                <td>{m.description}</td>
                <td>
                  <a href={m.url} target="_blank" rel="noreferrer">
                    Open
                  </a>
                </td>
                <td>
                  <button onClick={() => handleDelete(m.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MediaList;
