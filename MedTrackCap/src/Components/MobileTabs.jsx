// src/Components/MobileTabs.jsx
import React from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function MobileTabs() {
  const [hidden, setHidden] = React.useState(false);
  const lastYRef = React.useRef(0);
  const [isMobile, setIsMobile] = React.useState(true);
  const location = useLocation();

  // Detectar si es móvil según el ancho
  React.useEffect(() => {
    function handleResize() {
      if (typeof window === "undefined") return;
      setIsMobile(window.innerWidth < 768);
    }

    handleResize(); // correr una vez al montar
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Resetear visibilidad cuando cambias de pantalla
  React.useEffect(() => {
    setHidden(false);
  }, [location.pathname]);

  // Efecto de scroll para esconder/mostrar
  React.useEffect(() => {
    if (!isMobile) return; // aquí sí podemos condicionar dentro del efecto

    function onScroll() {
      const currentY = window.scrollY;
      const lastY = lastYRef.current;

      const goingDown = currentY > lastY + 10;
      const goingUp = currentY < lastY - 10;

      if (goingDown) {
        setHidden(true);
      } else if (goingUp) {
        setHidden(false);
      }

      lastYRef.current = currentY;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  // Si no es mobile, no renderizamos nada
  if (!isMobile) return null;

  const baseClasses =
    "fixed bottom-0 inset-x-0 z-40 bg-white shadow-[0_-4px_12px_rgba(15,23,42,0.25)]";

  return (
    <nav
      className={
        baseClasses +
        " transform transition-transform duration-200 " +
        (hidden ? "translate-y-full" : "translate-y-0")
      }
      aria-label="Navegación principal móvil"
    >
      <div className="flex justify-around items-center h-14 text-xs">
        <TabItem to="/dashboard" label="Today" icon="🏠" />
        <TabItem to="/medicines" label="My Meds" icon="💊" />
        <TabItem to="/medications/new" label="Add Meds" icon="➕" />
        <TabItem to="/settings" label="Settings" icon="⚙️" />
      </div>
    </nav>
  );
}

function TabItem({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        "flex flex-col items-center justify-center flex-1 h-full" +
        (isActive ? " text-blue-600" : " text-slate-500")
      }
    >
      <span>{icon}</span>
      <span className="mt-0.5">{label}</span>
    </NavLink>
  );
}
