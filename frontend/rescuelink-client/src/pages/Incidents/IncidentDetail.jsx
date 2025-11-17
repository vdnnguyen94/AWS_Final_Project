import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import incidentsApi from "../../api/incidentsApi";

function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(false);
  const [patching, setPatching] = useState(false);
  const [error, setError] = useState("");

  const loadIncident = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await incidentsApi.getById(id);
      setIncident(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load incident.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncident();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    if (!incident) return;
    setPatching(true);

    try {
      await incidentsApi.patchStatus(id, newStatus);
      setIncident((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error(err);
      alert("Status update failed.");
    } finally {
      setPatching(false);
    }
  };

  if (loading) return <p>Loading incident...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!incident) return <p>No incident found.</p>;

  return (
    <div>
      <h2>Incident Detail</h2>

      <p>
        <strong>Id:</strong> {incident.id}
      </p>
      <p>
        <strong>Title:</strong> {incident.title}
      </p>
      <p>
        <strong>Description:</strong> {incident.description}</p>
      <p>
        <strong>Status:</strong> {incident.status}
      </p>
      <p>
        <strong>Latitude:</strong> {incident.latitude}
      </p>
      <p>
        <strong>Longitude:</strong> {incident.longitude}
      </p>

      <div style={{ marginTop: "8px" }}>
        <span>Change status: </span>
        <button
          disabled={patching}
          onClick={() => handleStatusChange("Open")}
        >
          Open
        </button>{" "}
        <button
          disabled={patching}
          onClick={() => handleStatusChange("InProgress")}
        >
          In Progress
        </button>{" "}
        <button
          disabled={patching}
          onClick={() => handleStatusChange("Resolved")}
        >
          Resolved
        </button>
      </div>

      <div style={{ marginTop: "12px" }}>
        <button onClick={() => navigate(`/incidents/${id}/edit`)}>
          Edit
        </button>{" "}
        <button onClick={() => navigate("/incidents")}>Back to list</button>
      </div>
    </div>
  );
}

export default IncidentDetail;
