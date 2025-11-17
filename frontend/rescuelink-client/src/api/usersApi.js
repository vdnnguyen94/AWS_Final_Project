import axiosClient from "./axiosClient";

const usersApi = {
  getAll: () => axiosClient.get("/api/users"),
  getById: (id) => axiosClient.get(`/api/users/${id}`),
  create: (data) => axiosClient.post("/api/users", data),
  update: (id, data) => axiosClient.put(`/api/users/${id}`, data),
  patch: (id, data) => axiosClient.patch(`/api/users/${id}`, data),
  delete: (id) => axiosClient.delete(`/api/users/${id}`),
};

export default usersApi;
