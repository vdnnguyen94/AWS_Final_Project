import { Routes, Route, NavLink } from "react-router-dom";
import "./App.css";

import IncidentList from "./pages/Incidents/IncidentList.jsx";
import IncidentDetail from "./pages/Incidents/IncidentDetail.jsx";
import IncidentForm from "./pages/Incidents/IncidentForm.jsx";

import UserList from "./pages/Users/UserList.jsx";
import UserForm from "./pages/Users/UserForm.jsx";
import UserDetail from "./pages/Users/UserDetail.jsx";

import MediaList from "./pages/Media/MediaList.jsx";
import MediaUpload from "./pages/Media/MediaUpload.jsx";

import IncidentMap from "./pages/Map/IncidentMap.jsx";

function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <h1>RescueLink</h1>
        <nav>
          <NavLink to="/incidents">Incidents</NavLink>
          <NavLink to="/users">Users</NavLink>
          <NavLink to="/media">Media</NavLink>
          <NavLink to="/map">Map</NavLink>
        </nav>
      </header>

      <main className="app-main">
        <div className="app-card">
          <Routes>
            {/* Default home */}
            <Route path="/" element={<IncidentList />} />

            {/* Incident routes */}
            <Route path="/incidents" element={<IncidentList />} />
            <Route path="/incidents/new" element={<IncidentForm mode="create" />} />
            <Route path="/incidents/:id" element={<IncidentDetail />} />
            <Route path="/incidents/:id/edit" element={<IncidentForm mode="edit" />} />

            {/* User routes */}
            <Route path="/users" element={<UserList />} />
            <Route path="/users/new" element={<UserForm mode="create" />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="/users/:id/edit" element={<UserForm mode="edit" />} />

            {/* Media routes */}
            <Route path="/media" element={<MediaList />} />
            <Route path="/media/upload" element={<MediaUpload />} />

            {/* Map */}
            <Route path="/map" element={<IncidentMap />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
