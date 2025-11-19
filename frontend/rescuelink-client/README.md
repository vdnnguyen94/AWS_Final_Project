# 📘 RescueLink Frontend – README

A complete React (Vite) frontend application for the **RescueLink Disaster Reporting System**.
This frontend communicates with a REST API (or an internal Mock API) and provides UI screens for:

* **Incidents (CRUD + Patch Status)**
* **Users (CRUD + Patch Role)**
* **Media (Upload / Edit / Preview / Delete)**
* **Google Maps visualization for incident locations**

The UI demonstrates all REST operations (GET, POST, PUT, PATCH, DELETE) and supports switching between **Mock API** and **Real Backend API**.

---

## 🚀 1. Tech Stack

* **React 18 (Vite)**
* **React Router v6**
* **Axios** (API communication)
* **@react-google-maps/api** (Map integration)
* **CSS Modules / Basic Styling**
* **Mock API for local development**

---

## 📦 2. Install Dependencies

```bash
cd rescuelink-client
npm install
```

This installs:

* axios
* react-router-dom
* @react-google-maps/api
* Vite dependencies

---

## ⚙️ 3. Environment Variables

Create a file named:

```
rescuelink-client/.env.local
```

Add the following:

```bash
# Local ASP.NET API URL (example)
VITE_API_BASE_URL=https://localhost:7123

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE

# Toggle Mock API (true = use mock / false = real backend)
VITE_USE_MOCK_API=true
```

Notes:
* ⚠️ Must be `.env.local`
* ⚠️ All variables are accessed via `import.meta.env.*`
* **`VITE_USE_MOCK_API=true`** → all API calls use the internal mock backend
* **`VITE_USE_MOCK_API=false`** → uses your real ASP.NET backend

---

## ▶️ 4. Run the App
Start the development server:

```bash
npm run dev
```

Visit:

👉 **[http://localhost:5173](http://localhost:5173)**

---

## 📂 5. Frontend Folder Structure

```
src/
├── api/
│   ├── axiosClient.js
│   ├── incidentsApi.js
│   ├── usersApi.js
│   └── mediaApi.js
│
├── pages/
│   ├── Incidents/
│   │   ├── IncidentList.jsx
│   │   ├── IncidentDetail.jsx
│   │   └── IncidentForm.jsx
│   │
│   ├── Users/
│   │   ├── UserList.jsx
│   │   ├── UserDetail.jsx
│   │   └── UserForm.jsx
│   │
│   ├── Media/
│   │   ├── MediaList.jsx
│   │   ├── MediaUpload.jsx
│   │   ├── MediaDetail.jsx
│   │   └── MediaForm.jsx
│   │
│   └── Map/
│       └── IncidentMap.jsx
│
├── App.jsx
├── App.css
└── main.jsx
```

---

## 🔌 6. API Layer Overview

### ✔ Shared Axios Instance

`src/api/axiosClient.js`

```js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosClient.interceptors.request.use((config) => {
  config.headers["Accept"] = "application/json";
  config.headers["Content-Type"] = "application/json";
  return config;
});

export default axiosClient;
```

---

### ✔ Example API Wrapper (Incidents)

`src/api/incidentsApi.js`

```js
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
```

API wrappers for Users and Media follow the same pattern.

---

## 🖥️ 7. Frontend Features

### ✔ Incidents (Full CRUD + Search + Filters)

* View all incidents
* Filter by status (Open / InProgress / Resolved)
* Search by title/description/id
* Create incident
* Edit incident
* Delete incident
* PATCH status update
* Detail page for each incident

### ✔ Users (Full CRUD)

* List all users
* Add/edit users
* Delete users
* View details
* PATCH user role

### ✔ Media (Upload + List + Delete)

* Upload image or video
* Attach to a specific Incident
* View uploaded file URL
* Delete media

### ✔ Google Maps Integration

* Show incidents as map markers
* Filter/search incidents
* Click markers to view quick info

---

## 🗺️ 8. Google Maps Example

`src/pages/Map/IncidentMap.jsx`

```jsx
<GoogleMap
  mapContainerStyle={{ width: "100%", height: "500px" }}
  center={{ lat: 43.65107, lng: -79.347015 }}
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
```

---

## 🧪 9. How to Demo the Frontend

### **1) Incidents**

1. Create a new incident
2. Edit incident fields
3. Change status (PATCH)
4. Search “fire” or “flood”
5. Filter by status
6. Delete incident

### **2) Users**

1. Create user
2. Edit user email/role
3. Change role using PATCH
4. Delete user

### **3) Media**

1. Upload media
2. Show file URL
3. Delete media

### **4) Map**

1. Open map page
2. Show markers
3. Apply filter/search
4. Demonstrate dynamic marker updates

---

## 🛠️ 10. Build for Production

```bash
npm run build
```

Output:

```
dist/
```

---


## 🔧 Mock API (Temporary)

For development convenience, this project includes a small **in-memory Mock API** inside the `src/api` files.
When enabled, all API calls for **Incidents, Users, and Media** run entirely on the frontend without any backend.

Enable mock mode:

```bash
VITE_USE_MOCK_API=true
```

Disable mock mode (use real backend):

```bash
VITE_USE_MOCK_API=false
```

This mock layer is **temporary** and will be removed once the real backend API is fully ready.