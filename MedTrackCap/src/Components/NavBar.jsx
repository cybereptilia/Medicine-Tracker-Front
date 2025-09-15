import { NavLink, Link } from "react-router-dom";

export default function NavBar() {
  const item = ({ isActive }) =>
    "px-3 py-2 rounded-lg font-medium" + (isActive ? " bg-black text-white" : "");
  return (
    <header style={{ borderBottom: "1px solid #eee", background: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 12, display: "flex", gap: 8, alignItems: "center" }}>
        <Link to="/" style={{ fontWeight: 700, marginRight: 8 }}>MedTracker</Link>
        <NavLink to="/" end className={item}>Dashboard</NavLink>
        <NavLink to="/medicines" className={item}>Medicines</NavLink>
        <NavLink to="/schedules" className={item}>Schedules</NavLink>
        <NavLink to="/inventory" className={item}>Inventory</NavLink>
        <NavLink to="/settings" className={item}>Settings</NavLink>
        <div style={{ marginLeft: "auto" }}>
          <NavLink to="/login" className={item}>Login</NavLink>
        </div>
      </div>
    </header>
  );
}
