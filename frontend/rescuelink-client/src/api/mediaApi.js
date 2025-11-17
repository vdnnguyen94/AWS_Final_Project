/*import axiosClient from "./axiosClient";

const mediaApi = {
  getAll: () => axiosClient.get("/api/media"),
  getById: (id) => axiosClient.get(`/api/media/${id}`),

  // JSON-based create/update (if backend supports it)
  create: (data) => axiosClient.post("/api/media", data),
  update: (id, data) => axiosClient.put(`/api/media/${id}`, data),
  delete: (id) => axiosClient.delete(`/api/media/${id}`),

  // File upload using multipart/form-data
  uploadFile: (formData) =>
    axiosClient.post("/api/media/upload", formData, { // confirm with backend if the endpoint is '/api/media' or /api/media/upload'
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export default mediaApi;*/

/* ------------------- Mock mediaApi ------------------- */

import axiosClient from "./axiosClient";

const useMock = import.meta.env.VITE_USE_MOCK_API === "true";

let mockMedia = [
  {
    id: 1,
    incidentId: 1,
    description: "Photo of power outage area",
    url: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    incidentId: 2,
    description: "Flood video clip",
    url: "https://www.example.com/video.mp4",
  },
];

let mockNextId = 3;

const delay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), ms));

const mockMediaApi = {
  getAll: () => delay([...mockMedia]),
  getById: (id) => delay(mockMedia.find((m) => m.id === Number(id)) ?? null),

  create: (data) => {
    const newItem = {
      id: mockNextId++,
      incidentId: Number(data.incidentId),
      description: data.description ?? "",
      url: data.url ?? "https://via.placeholder.com/150",
    };
    mockMedia.push(newItem);
    return delay(newItem);
  },

  update: (id, data) => {
    const index = mockMedia.findIndex((m) => m.id === Number(id));
    if (index === -1) return delay(null);

    mockMedia[index] = {
      ...mockMedia[index],
      ...data,
      id: mockMedia[index].id,
    };
    return delay(mockMedia[index]);
  },

  delete: (id) => {
    mockMedia = mockMedia.filter((m) => m.id !== Number(id));
    return delay(null);
  },

  // Simulated file upload: we just store metadata and fake URL
  uploadFile: (formData) => {
    const incidentId = Number(formData.get("incidentId"));
    const description = formData.get("description") ?? "";
    const file = formData.get("file");

    const fakeUrl =
      typeof file === "object"
        ? `https://example.com/uploads/${file.name}`
        : "https://via.placeholder.com/150";

    const newItem = {
      id: mockNextId++,
      incidentId,
      description,
      url: fakeUrl,
    };

    mockMedia.push(newItem);
    return delay(newItem);
  },
};

// Real API implementation
const realMediaApi = {
  getAll: () => axiosClient.get("/api/media"),
  getById: (id) => axiosClient.get(`/api/media/${id}`),
  create: (data) => axiosClient.post("/api/media", data),
  update: (id, data) => axiosClient.put(`/api/media/${id}`, data),
  delete: (id) => axiosClient.delete(`/api/media/${id}`),
  uploadFile: (formData) =>
    axiosClient.post("/api/media", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

const mediaApi = useMock ? mockMediaApi : realMediaApi;

export default mediaApi;
