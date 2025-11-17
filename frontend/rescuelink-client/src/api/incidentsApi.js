/*import axiosClient from "./axiosClient";

const incidentsApi = {
  getAll: () => axiosClient.get("/api/incidents"),
  getById: (id) => axiosClient.get(`/api/incidents/${id}`),
  create: (data) => axiosClient.post("/api/incidents", data),
  update: (id, data) => axiosClient.put(`/api/incidents/${id}`, data),
  patchStatus: (id, status) =>
    axiosClient.patch(`/api/incidents/${id}`, { status }),
  delete: (id) => axiosClient.delete(`/api/incidents/${id}`),
};

export default incidentsApi;*/

/* ------------------- Mock incidentApi ------------------- */
import axiosClient from "./axiosClient";

const useMock = import.meta.env.VITE_USE_MOCK_API === "true";

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
];

let mockNextId = 3;

const delay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), ms));

const mockIncidentsApi = {
  getAll: () => delay([...mockIncidents]),
  getById: (id) =>
    delay(mockIncidents.find((i) => i.id === Number(id)) ?? null),

  create: (data) => {
    const newItem = {
      id: mockNextId++,
      title: data.title,
      description: data.description,
      status: data.status ?? "Open",
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
    };
    mockIncidents.push(newItem);
    return delay(newItem);
  },

  update: (id, data) => {
    const index = mockIncidents.findIndex((i) => i.id === Number(id));
    if (index === -1) return delay(null);

    mockIncidents[index] = {
      ...mockIncidents[index],
      ...data,
      id: mockIncidents[index].id,
    };
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

// Real API implementation (will be used when backend is ready)
const realIncidentsApi = {
  getAll: () => axiosClient.get("/api/incidents"),
  getById: (id) => axiosClient.get(`/api/incidents/${id}`),
  create: (data) => axiosClient.post("/api/incidents", data),
  update: (id, data) => axiosClient.put(`/api/incidents/${id}`, data),
  patchStatus: (id, status) =>
    axiosClient.patch(`/api/incidents/${id}`, { status }),
  delete: (id) => axiosClient.delete(`/api/incidents/${id}`),
};

const incidentsApi = useMock ? mockIncidentsApi : realIncidentsApi;

export default incidentsApi;
