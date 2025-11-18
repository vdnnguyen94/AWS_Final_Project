import { useEffect, useState, useMemo } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import incidentsApi from "../../api/incidentsApi";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 43.65107,
  lng: -79.347015,
};

const getMarkerIcon = (status) => {
  const base = "http://maps.google.com/mapfiles/ms/icons/";
  if (!status) return base + "blue-dot.png";

  const normalized = status.toLowerCase();
  if (normalized === "open") return base + "red-dot.png";
  if (normalized === "inprogress") return base + "yellow-dot.png";
  if (normalized === "resolved") return base + "green-dot.png";

  return base + "blue-dot.png";
};

function IncidentMap() {
  const [incidents, setIncidents] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [selectedIncident, setSelectedIncident] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await incidentsApi.getAll();
        setIncidents(res.data);
      } catch (err) {
        console.error("Failed to load incidents for map", err);
      }
    };

    fetchIncidents();
  }, []);

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

  const stats = useMemo(() => {
    const open = incidents.filter((i) => i.status === "Open").length;
    const inProgress = incidents.filter((i) => i.status === "InProgress").length;
    const resolved = incidents.filter((i) => i.status === "Resolved").length;
    return { open, inProgress, resolved };
  }, [incidents]);

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div>
      <h2>Incident Map</h2>

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
          <span style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "4px 10px", borderRadius: "999px" }}>
            Open: {stats.open}
          </span>

          <span style={{ backgroundColor: "#fef3c7", color: "#92400e", padding: "4px 10px", borderRadius: "999px" }}>
            In Progress: {stats.inProgress}
          </span>

          <span style={{ backgroundColor: "#dcfce7", color: "#166534", padding: "4px 10px", borderRadius: "999px" }}>
            Resolved: {stats.resolved}
          </span>
        </div>
      </div>

      <div className="map-wrapper">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={10}
          onClick={() => setSelectedIncident(null)}
        >
          {filteredIncidents.map((inc) =>
            inc.latitude && inc.longitude ? (
              <Marker
                key={inc.id}
                position={{ lat: inc.latitude, lng: inc.longitude }}
                title={inc.title}
                icon={getMarkerIcon(inc.status)}
                onClick={() => setSelectedIncident(inc)}
              />
            ) : null
          )}

          {selectedIncident && selectedIncident.latitude && selectedIncident.longitude && (
            <InfoWindow
              position={{
                lat: selectedIncident.latitude,
                lng: selectedIncident.longitude,
              }}
              onCloseClick={() => setSelectedIncident(null)}
            >
              <div style={{ maxWidth: "220px" }}>
                <strong>{selectedIncident.title}</strong>
                <div style={{ fontSize: "0.8rem", marginTop: "4px" }}>
                  <div>Status: {selectedIncident.status}</div>
                  {selectedIncident.description && (
                    <div style={{ marginTop: "4px" }}>
                      {selectedIncident.description}
                    </div>
                  )}
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

export default IncidentMap;
