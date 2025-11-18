// ===== Real usersApi (for backend connection) =====
import axiosClient from "./axiosClient";

const usersApi = {
  // GET /api/users
  getAll: () => axiosClient.get("/api/users"),

  // GET /api/users/{id}
  getById: (id) => axiosClient.get(`/api/users/${id}`),

  // POST /api/users
  create: (data) => axiosClient.post("/api/users", data),

  // PUT /api/users/{id}
  update: (id, data) => axiosClient.put(`/api/users/${id}`, data),

  // PATCH /api/users/{id}
  // body example: { role: "Admin" }
  patch: (id, data) => axiosClient.patch(`/api/users/${id}`, data),

  // DELETE /api/users/{id}
  delete: (id) => axiosClient.delete(`/api/users/${id}`),
};

export default usersApi; 

/*/ ===== Mock usersApi (for frontend testing) =====
let mockUsers = [
  { id: 1, name: "Alice Johnson",  email: "alice@email.com",  role: "Responder" },
  { id: 2, name: "Bob Lee",        email: "bob@email.com",    role: "Dispatcher" },
  { id: 3, name: "Admin User",     email: "admin@email.com",  role: "Admin" },
  { id: 4, name: "Sarah Williams", email: "sarah@email.com",  role: "Responder" },
  { id: 5, name: "David Kim",      email: "david@email.com",  role: "Dispatcher" },
  { id: 6, name: "Michael Brown",  email: "michael@email.com",role: "Admin" },
  { id: 7, name: "Emma Davis",     email: "emma@email.com",   role: "Responder" },
  { id: 8, name: "Jason Clark",    email: "jason@email.com",  role: "Dispatcher" },
];

let mockNextId = 9;

const delay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), ms));

const usersApi = {
  getAll: () => delay([...mockUsers]),

  getById: (id) =>
    delay(mockUsers.find((u) => u.id === Number(id)) ?? null),

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

    const updated = {
      ...mockUsers[index],
      ...data,
      id: mockUsers[index].id, 
    };

    mockUsers[index] = updated;
    return delay(mockUsers[index]);
  },

  patch: (id, data) => {
    const index = mockUsers.findIndex((u) => u.id === Number(id));
    if (index === -1) return delay(null);

    const updated = {
      ...mockUsers[index],
      ...data,
      id: mockUsers[index].id, 
    };

    mockUsers[index] = updated;
    return delay(mockUsers[index]);
  },

  delete: (id) => {
    mockUsers = mockUsers.filter((u) => u.id !== Number(id));
    return delay(null);
  },
};

export default usersApi; */