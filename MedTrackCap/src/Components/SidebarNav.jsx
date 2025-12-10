import { NavLink } from "react-router-dom";

const base = "block rounded-xl px-4 py-2 text-sm font-medium transition";
const active = "bg-white/95 text-slate-900 shadow ring-1 ring-black/5";
const idle   = "text-white/90 hover:bg-white/10 hover:text-white";

export default function SidebarNav() {
  return (
    <nav className="rounded-2xl bg-white/10 backdrop-blur ring-1 ring-white/20 p-3 space-y-1">
      <Item to="/dashboard">Dashboard</Item>
      <Item to="/medications/new">Registrar medicamento</Item>
      <Item to="/schedules">Schedules</Item>
      <Item to="/inventory">Inventory</Item>
      <Item to="/settings">Settings</Item>
    </nav>
  );
}

function Item({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `${base} ${isActive ? active : idle}`}
      end
    >
      {children}
    </NavLink>
  );
}
