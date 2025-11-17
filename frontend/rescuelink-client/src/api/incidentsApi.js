import axiosClient from "./axiosClient";

const incidentsApi = {
  getAll: () => axiosClient.get("/api/incidents"),
  getById: (id) => axiosClient.get(`/api/incidents/${id}`),
  create: (data) => axiosClient.post("/api/incidents", data),
  update: (id, data) => axiosClient.put(`/api/incidents/${id}`, data),
  patchStatus: (id, status) =>
    axiosClient.patch(`/api/incidents/${id}`, { status }),
  delete: (id) => axiosClient.delete(`/api/incidents/${id}`),
};

export default incidentsApi;
