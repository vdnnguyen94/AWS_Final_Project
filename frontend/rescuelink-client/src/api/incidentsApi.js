// ===== Real incidentsApi (for backend connection) =====
import axiosClient from "./axiosClient";

const incidentsApi = {
  // GET /api/incidents
  getAll: () => axiosClient.get("/api/incidents"),

  // GET /api/incidents/{id}
  getById: (id) => axiosClient.get(`/api/incidents/${id}`),

  // POST /api/incidents
  create: (data) => axiosClient.post("/api/incidents", data),

  // PUT /api/incidents/{id}
  update: (id, data) => axiosClient.put(`/api/incidents/${id}`, data),

  // PATCH /api/incidents/{id}
  // body: { status: "Open" | "InProgress" | "Resolved" }
  patchStatus: (id, status) =>
    axiosClient.patch(`/api/incidents/${id}`, { status }),

  // DELETE /api/incidents/{id}
  delete: (id) => axiosClient.delete(`/api/incidents/${id}`),
};

export default incidentsApi;

/*/ ===== Mock incidentsApi (for frontend testing) =====

let mockIncidents = [
  {
    id: 1,
    title: "Power outage in downtown",
    description: "Major power outage affecting several blocks.",
    status: "Open",
    latitude: 43.6532,
    longitude: -79.3832,
  },
  {
    id: 2,
    title: "Flood near river",
    description: "Roads partially flooded, avoid the area.",
    status: "InProgress",
    latitude: 43.7001,
    longitude: -79.4163,
  },
  {
    id: 3,
    title: "Highway collision",
    description: "Multi-vehicle collision reported on Highway 401.",
    status: "Open",
    latitude: 43.7735,
    longitude: -79.3358,
  },
  {
    id: 4,
    title: "Subway service disruption",
    description: "Signal issue causing major delays on Line 1.",
    status: "Resolved",
    latitude: 43.7625,
    longitude: -79.4111,
  },
  {
    id: 5,
    title: "Industrial fire",
    description: "Smoke reported from an industrial area in Mississauga.",
    status: "InProgress",
    latitude: 43.606,
    longitude: -79.6505,
  },
  {
    id: 6,
    title: "Residential gas leak",
    description: "Gas smell reported in a residential building.",
    status: "Open",
    latitude: 43.688,
    longitude: -79.296,
  },
  {
    id: 7,
    title: "Road closure for event",
    description: "Downtown street closed due to a public event.",
    status: "Resolved",
    latitude: 43.647,
    longitude: -79.381,
  },
  {
    id: 8,
    title: "Traffic signal outage",
    description: "Traffic lights not working at major intersection.",
    status: "Open",
    latitude: 43.725,
    longitude: -79.452,
  },
];

let mockNextId = 9;

const delay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), ms));

const incidentsApi = {
  getAll: () => delay([...mockIncidents]),

  getById: (id) =>
    delay(mockIncidents.find((i) => i.id === Number(id)) ?? null),

  create: (data) => {
    const newItem = {
      id: mockNextId++,
      title: data.title,
      description: data.description,
      status: data.status ?? "Open",
      latitude:
        data.latitude !== undefined && data.latitude !== null
          ? Number(data.latitude)
          : null,
      longitude:
        data.longitude !== undefined && data.longitude !== null
          ? Number(data.longitude)
          : null,
    };

    mockIncidents.push(newItem);
    return delay(newItem);
  },

  update: (id, data) => {
    const index = mockIncidents.findIndex((i) => i.id === Number(id));
    if (index === -1) return delay(null);

    const updated = {
      ...mockIncidents[index],
      ...data,
    };

    if (data.latitude !== undefined) {
      updated.latitude =
        data.latitude !== null && data.latitude !== ""
          ? Number(data.latitude)
          : null;
    }
    if (data.longitude !== undefined) {
      updated.longitude =
        data.longitude !== null && data.longitude !== ""
          ? Number(data.longitude)
          : null;
    }

    mockIncidents[index] = updated;
    return delay(mockIncidents[index]);
  },

  patchStatus: (id, status) => {
    const index = mockIncidents.findIndex((i) => i.id === Number(id));
    if (index === -1) return delay(null);

    mockIncidents[index] = {
      ...mockIncidents[index],
      status,
    };
    return delay(mockIncidents[index]);
  },

  delete: (id) => {
    mockIncidents = mockIncidents.filter((i) => i.id !== Number(id));
    return delay(null);
  },
};

export default incidentsApi;
*/
