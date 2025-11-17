/* import axiosClient from "./axiosClient";

const usersApi = {
  getAll: () => axiosClient.get("/api/users"),
  getById: (id) => axiosClient.get(`/api/users/${id}`),
  create: (data) => axiosClient.post("/api/users", data),
  update: (id, data) => axiosClient.put(`/api/users/${id}`, data),
  patch: (id, data) => axiosClient.patch(`/api/users/${id}`, data),
  delete: (id) => axiosClient.delete(`/api/users/${id}`),
};

export default usersApi; */

/* ------------------- Mock usersApi ------------------- */

import axiosClient from "./axiosClient";

const useMock = import.meta.env.VITE_USE_MOCK_API === "true";

let mockUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@email.com", role: "Responder" },
  { id: 2, name: "Bob Lee", email: "bob@email.com", role: "Dispatcher" },
  { id: 3, name: "Admin User", email: "admin@email.com", role: "Admin" },
];

let mockNextId = 4;

const delay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), ms));

const mockUsersApi = {
  getAll: () => delay([...mockUsers]),
  getById: (id) => delay(mockUsers.find((u) => u.id === Number(id)) ?? null),

  create: (data) => {
    const newUser = {
      id: mockNextId++,
      name: data.name,
      email: data.email,
      role: data.role ?? "Responder",
    };
    mockUsers.push(newUser);
    return delay(newUser);
  },

  update: (id, data) => {
    const index = mockUsers.findIndex((u) => u.id === Number(id));
    if (index === -1) return delay(null);

    mockUsers[index] = {
      ...mockUsers[index],
      ...data,
      id: mockUsers[index].id,
    };
    return delay(mockUsers[index]);
  },

  patch: (id, data) => {
    const index = mockUsers.findIndex((u) => u.id === Number(id));
    if (index === -1) return delay(null);

    mockUsers[index] = {
      ...mockUsers[index],
      ...data,
      id: mockUsers[index].id,
    };
    return delay(mockUsers[index]);
  },

  delete: (id) => {
    mockUsers = mockUsers.filter((u) => u.id !== Number(id));
    return delay(null);
  },
};

// Real API implementation
const realUsersApi = {
  getAll: () => axiosClient.get("/api/users"),
  getById: (id) => axiosClient.get(`/api/users/${id}`),
  create: (data) => axiosClient.post("/api/users", data),
  update: (id, data) => axiosClient.put(`/api/users/${id}`, data),
  patch: (id, data) => axiosClient.patch(`/api/users/${id}`, data),
  delete: (id) => axiosClient.delete(`/api/users/${id}`),
};

const usersApi = useMock ? mockUsersApi : realUsersApi;

export default usersApi;
