// ===== Real mediaApi (for backend connection) =====
import axiosClient from "./axiosClient";

const mediaApi = {
  // GET /api/media
  getAll: () => axiosClient.get("/api/media"),

  // GET /api/media/{id}
  getById: (id) => axiosClient.get(`/api/media/${id}`),

  // POST /api/media
  // body: { incidentId, description, url } OR JSON, not FormData
  create: (data) => axiosClient.post("/api/media", data),

  // PUT /api/media/{id}
  // body: { incidentId, description, url }
  update: (id, data) => axiosClient.put(`/api/media/${id}`, data),

  // DELETE /api/media/{id}
  delete: (id) => axiosClient.delete(`/api/media/${id}`),

  // File upload (multipart/form-data)
  // FormData: incidentId, description, file
  uploadFile: (formData) =>
    axiosClient.post("/api/media", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export default mediaApi; 

/*/ ===== Mock mediaApi (For frontend testing) =====
const delay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), ms));

let mockMedia = [
  {
    id: 1,
    incidentId: 1,
    description: "Photo: Power outage area - transformer damage",
    url: "https://via.placeholder.com/320x220.png?text=Outage+Photo",
    uploadedAt: "2025-11-01T10:00:00Z",
  },
  {
    id: 2,
    incidentId: 2,
    description: "Video: Flood water rising rapidly",
    url: "https://www.example.com/video1.mp4",
    uploadedAt: "2025-11-02T14:30:00Z",
  },
  {
    id: 3,
    incidentId: 3,
    description: "Photo: Car collision on highway",
    url: "https://via.placeholder.com/320x220.png?text=Collision",
    uploadedAt: "2025-11-03T09:15:00Z",
  },
  {
    id: 4,
    incidentId: 4,
    description: "Photo: Subway track blockage",
    url: "https://via.placeholder.com/320x220.png?text=Subway+Issue",
    uploadedAt: "2025-11-04T11:45:00Z",
  },
  {
    id: 5,
    incidentId: 5,
    description: "Video: Industrial fire smoke observed",
    url: "https://www.example.com/video2.mp4",
    uploadedAt: "2025-11-05T16:20:00Z",
  },
  {
    id: 6,
    incidentId: 6,
    description: "Photo: Gas leak investigation team",
    url: "https://via.placeholder.com/320x220.png?text=Gas+Leak",
    uploadedAt: "2025-11-06T08:10:00Z",
  },
  {
    id: 7,
    incidentId: 7,
    description: "Photo: Road closure barrier",
    url: "https://via.placeholder.com/320x220.png?text=Road+Closure",
    uploadedAt: "2025-11-07T13:05:00Z",
  },
  {
    id: 8,
    incidentId: 8,
    description: "Photo: Traffic signal outage — technician on site",
    url: "https://via.placeholder.com/320x220.png?text=Traffic+Outage",
    uploadedAt: "2025-11-08T19:40:00Z",
  },
];

let mockNextId = 9;

const mediaApi = {
  getAll: () => delay([...mockMedia]),

  getById: (id) =>
    delay(mockMedia.find((m) => m.id === Number(id)) ?? null),

  create: (data) => {
    const incidentIdRaw = data.incidentId;
    const incidentIdStr =
      typeof incidentIdRaw === "string" ? incidentIdRaw.trim() : incidentIdRaw;

    const nowIso = new Date().toISOString();

    const newItem = {
      id: mockNextId++,
      incidentId:
        incidentIdStr !== undefined && incidentIdStr !== ""
          ? Number(incidentIdStr)
          : null,
      description: data.description ?? "",
      url: data.url ?? "https://via.placeholder.com/300x200.png?text=Media",
      uploadedAt: nowIso,
    };

    mockMedia.push(newItem);
    return delay(newItem);
  },

  update: (id, data) => {
    const index = mockMedia.findIndex((m) => m.id === Number(id));
    if (index === -1) return delay(null);

    const updated = {
      ...mockMedia[index],
      ...data,
    };

    if (data.incidentId !== undefined) {
      const str =
        typeof data.incidentId === "string"
          ? data.incidentId.trim()
          : data.incidentId;

      updated.incidentId =
        str !== "" && str !== null && str !== undefined
          ? Number(str)
          : null;
    }

    mockMedia[index] = updated;
    return delay(mockMedia[index]);
  },

  delete: (id) => {
    mockMedia = mockMedia.filter((m) => m.id !== Number(id));
    return delay(null);
  },

  uploadFile: (formData) => {
    const incidentIdRaw = formData.get("incidentId");
    const incidentIdStr =
      typeof incidentIdRaw === "string" ? incidentIdRaw.trim() : incidentIdRaw;

    const incidentId =
      incidentIdStr !== null && incidentIdStr !== ""
        ? Number(incidentIdStr)
        : null;

    const description = formData.get("description") ?? "";
    const file = formData.get("file");
    const nowIso = new Date().toISOString();

    const fakeUrl =
      file && typeof file === "object" && "name" in file
        ? `https://placehold.co/600x400/png?text=${encodeURIComponent(file.name)}`
        : "https://placehold.co/600x400/png?text=Uploaded+Media";

    const newItem = {
      id: mockNextId++,
      incidentId,
      description,
      url: fakeUrl,
      uploadedAt: nowIso,
    };

    mockMedia.push(newItem);
    return delay(newItem);
  },
};

export default mediaApi; */