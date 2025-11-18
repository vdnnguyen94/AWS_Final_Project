import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import incidentsApi from "../../api/incidentsApi";

function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(false);
  const [patching, setPatching] = useState(false);
  const [error, setError] = useState("");

  // Google Maps loader
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script-detail",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

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

  const statusKey = (incident.status || "").toLowerCase();
  const hasLocation =
    incident.latitude !== null &&
    incident.latitude !== undefined &&
    incident.longitude !== null &&
    incident.longitude !== undefined;

  return (
    <div>
      <div className="detail-card">
        <div className="detail-top-row">
          <div className="detail-section-title">
            <h2>Incident Detail</h2>
          </div>
          <div className="detail-actions detail-actions-right">
            <button onClick={() => navigate(`/incidents/${id}/edit`)}>
              Edit
            </button>
            <button onClick={() => navigate("/incidents")}>
              Back to list
            </button>
          </div>
        </div>

        <div className="detail-header">
          <div>
            <div className="detail-id">#{incident.id}</div>
            <h3 className="detail-title">{incident.title}</h3>
          </div>

          <span className={`status-chip status-chip-${statusKey}`}>
            {incident.status}
          </span>
        </div>

        <div className="detail-body">
          <div className="detail-row">
            <span className="detail-label">Description</span>
            <span className="detail-value">
              {incident.description || "-"}
            </span>
          </div>

          <div className="detail-row two-column">
            <div>
              <span className="detail-label">Latitude</span>
              <span className="detail-value">
                {incident.latitude ?? "-"}
              </span>
            </div>
            <div>
              <span className="detail-label">Longitude</span>
              <span className="detail-value">
                {incident.longitude ?? "-"}
              </span>
            </div>
          </div>
        </div>

        {hasLocation && (
          <div className="detail-map-section">
            <span className="detail-label">Location</span>

            <div className="detail-map-wrapper">
              {!isLoaded ? (
                <p className="detail-map-loading">Loading map…</p>
              ) : (
                <GoogleMap
                  mapContainerStyle={{
                    width: "100%",
                    height: "260px",
                    borderRadius: "12px",
                  }}
                  center={{
                    lat: Number(incident.latitude),
                    lng: Number(incident.longitude),
                  }}
                  zoom={13}
                  options={{
                    streetViewControl: false,
                    mapTypeControl: true,
                    fullscreenControl: true,
                  }}
                >
                  <Marker
                    position={{
                      lat: Number(incident.latitude),
                      lng: Number(incident.longitude),
                    }}
                    title={incident.title}
                  />
                </GoogleMap>
              )}
            </div>
          </div>
        )}

        <div className="detail-status-section">
          <span className="detail-label">Change status</span>
          <div className="status-chip-group">
            <button
              type="button"
              disabled={patching}
              className={
                "status-chip status-chip-open" +
                (incident.status === "Open" ? " status-chip-active" : "")
              }
              onClick={() => handleStatusChange("Open")}
            >
              Open
            </button>
            <button
              type="button"
              disabled={patching}
              className={
                "status-chip status-chip-inprogress" +
                (incident.status === "InProgress" ? " status-chip-active" : "")
              }
              onClick={() => handleStatusChange("InProgress")}
            >
              In Progress
            </button>
            <button
              type="button"
              disabled={patching}
              className={
                "status-chip status-chip-resolved" +
                (incident.status === "Resolved" ? " status-chip-active" : "")
              }
              onClick={() => handleStatusChange("Resolved")}
            >
              Resolved
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncidentDetail;
