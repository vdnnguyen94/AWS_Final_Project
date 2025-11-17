import axiosClient from "./axiosClient";

const mediaApi = {
  getAll: () => axiosClient.get("/api/media"),
  getById: (id) => axiosClient.get(`/api/media/${id}`),

  create: (data) => axiosClient.post("/api/media", data),
  update: (id, data) => axiosClient.put(`/api/media/${id}`, data),
  delete: (id) => axiosClient.delete(`/api/media/${id}`),

  uploadFile: (formData) =>
    axiosClient.post("/api/media/upload", formData, { // confirm with backend if the endpoint is '/api/media' or /api/media/upload'
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export default mediaApi;
