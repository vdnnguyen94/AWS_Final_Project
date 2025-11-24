import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import incidentsApi from "../../api/incidentsApi";

function IncidentList() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filter state
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();

  const loadIncidents = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await incidentsApi.getAll();
      setIncidents(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load incidents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this incident?")) return;

    try {
      await incidentsApi.delete(id);
      setIncidents((prev) => prev.filter((inc) => inc.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };

  // Derived filtered list using useMemo for performance
  const filteredIncidents = useMemo(() => {
    let result = incidents;

    if (statusFilter !== "all") {
      result = result.filter(
        (inc) =>
          inc.status &&
          inc.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (searchText.trim()) {
      const keyword = searchText.toLowerCase();
      result = result.filter((inc) => {
        const title = (inc.title || "").toLowerCase();
        const description = (inc.description || "").toLowerCase();
        return (
          title.includes(keyword) ||
          description.includes(keyword) ||
          String(inc.id).includes(keyword)
        );
      });
    }

    return result;
  }, [incidents, statusFilter, searchText]);

  if (loading) return <p>Loading incidents...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Incidents</h2>

      <div className="filter-row">
        <div className="filter-left">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="Open">Open</option>
            <option value="InProgress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <input
            type="text"
            placeholder="Search incidents..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="filter-right">
          <button onClick={() => navigate("/incidents/new")}>
            + New Incident
          </button>
        </div>
      </div>

      {filteredIncidents.length === 0 ? (
        <p>No incidents found.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Title</th>
              <th>Status</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th className="table-actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIncidents.map((inc) => (
                <tr key={inc.incidentID || inc.IncidentID}> 
                <td>{inc.incidentID || inc.IncidentID}</td>
                <td>{inc.title}</td>
                <td>{inc.status}</td>
                <td>{inc.latitude}</td>
                <td>{inc.longitude}</td>
                <td className="table-actions-cell">
                  <div className="action-buttons">
                    <button
                      className="btn-pill btn-view"
                      onClick={() => navigate(`/incidents/${inc.id}`)}
                    >
                      View
                    </button>
                    <button
                      className="btn-pill btn-edit"
                      onClick={() => navigate(`/incidents/${inc.id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-pill btn-delete"
                      onClick={() => handleDelete(inc.id)}
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

export default IncidentList;
