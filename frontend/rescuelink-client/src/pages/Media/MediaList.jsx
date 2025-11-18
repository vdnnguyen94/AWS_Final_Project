import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import mediaApi from "../../api/mediaApi";

function MediaList() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");

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

  const filteredMedia = useMemo(() => {
    if (!searchText.trim()) return media;

    const keyword = searchText.toLowerCase();
    return media.filter((m) => {
      const desc = (m.description || "").toLowerCase();
      const url = (m.url || "").toLowerCase();
      return (
        String(m.id).includes(keyword) ||
        String(m.incidentId).includes(keyword) ||
        desc.includes(keyword) ||
        url.includes(keyword)
      );
    });
  }, [media, searchText]);

  if (loading) return <p>Loading media...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Media</h2>

      <div className="filter-row">
        <div className="filter-left">
          <input
            type="text"
            placeholder="Search media by id, incident, description..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="filter-right">
          <button onClick={() => navigate("/media/upload")}>
            + Upload Media
          </button>
        </div>
      </div>

      {filteredMedia.length === 0 ? (
        <p>No media found.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Incident Id</th>
              <th>Description</th>
              <th>File</th>
              <th className="table-actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedia.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.incidentId}</td>
                <td>{m.description}</td>
                <td>
                  {m.url ? (
                    <a href={m.url} target="_blank" rel="noreferrer">
                      Open
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="table-actions-cell">
                  <div className="action-buttons">
                    <button
                      className="btn-pill btn-view"
                      onClick={() => navigate(`/media/${m.id}`)}
                    >
                      View
                    </button>
                    <button
                      className="btn-pill btn-edit"
                      onClick={() => navigate(`/media/${m.id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-pill btn-delete"
                      onClick={() => handleDelete(m.id)}
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

export default MediaList;
