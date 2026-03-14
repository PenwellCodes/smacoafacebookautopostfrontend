import { NavLink, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ConnectFacebook from "./pages/ConnectFacebook";
import CreatePost from "./pages/CreatePost";

export default function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>FB Autoposter</h1>
        <nav>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/connect">Connect Facebook</NavLink>
          <NavLink to="/create">Create Post</NavLink>
        </nav>
      </aside>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/connect" element={<ConnectFacebook />} />
          <Route path="/create" element={<CreatePost />} />
        </Routes>
      </main>
    </div>
  );
}