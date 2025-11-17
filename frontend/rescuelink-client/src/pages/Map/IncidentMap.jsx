import { useEffect, useState, useMemo } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import incidentsApi from "../../api/incidentsApi";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 43.65107,
  lng: -79.347015,
};

function IncidentMap() {
  const [incidents, setIncidents] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

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

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div>
      <h2>Incident Map</h2>

      <div className="filter-bar">
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
          placeholder="Search by id, title, description..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="map-wrapper">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
        >
          {filteredIncidents.map((inc) =>
            inc.latitude && inc.longitude ? (
              <Marker
                key={inc.id}
                position={{ lat: inc.latitude, lng: inc.longitude }}
                title={inc.title}
              />
            ) : null
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

export default IncidentMap;
