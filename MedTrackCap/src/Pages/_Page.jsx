// src/Pages/_Page.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MobileTabs from "../Components/MobileTabs";

export default function Page({ title, children, sidebar = null }) {
  const navigate = useNavigate();
  const location = useLocation();

  const showLogout = location.pathname !== "/login";

  useEffect(() => {
    document.title = title
      ? `${title} · Medicine Tracker & Care Assistant`
      : "Medicine Tracker & Care Assistant";
  }, [title]);

  function handleLogout() {
    try {
      localStorage.removeItem("token");
    } catch {}
    navigate("/login", { replace: true });
  }

  return (
  <div className="min-h-screen w-full bg-gradient-to-br from-[#1E3A8A] to-[#0E9F6E]">
    
    {/* Contenedor interior — aquí sí podemos limitar el ancho */}
    <div className="min-h-screen w-full">
      {/* Header */}
      <header className="px-6 pt-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-sm">
              Medicine Tracker & Care Assistant
            </h1>
            {title && (
              <p className="mt-1 text-lg md:text-xl font-semibold text-white/90">
                {title}
              </p>
            )}
          </div>

          {showLogout && (
            <button
              type="button"
              onClick={handleLogout}
              className="bg-slate-900/80 hover:bg-slate-900 text-white px-4 py-2 rounded-full font-semibold shadow-sm transition"
            >
              ⏻ Logout
            </button>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="rounded-3xl bg-white/15 backdrop-blur-md ring-1 ring-white/25 p-6">
        {sidebar ? (
  <div className="flex flex-col md:flex-row gap-6">
    {/* Sidebar solo en desktop/tablet */}
    <aside className="hidden md:block md:w-1/4 lg:w-1/5">
      {sidebar}
    </aside>

    {/* Contenido ocupa todo en mobile y el resto en desktop */}
    <section className="flex-1">
      {children}
    </section>
  </div>
) : (
  <section>{children}</section>
)}


        </div>
      </main>
    </div>

    {/* Mobile Tabs */}
    <MobileTabs />
  </div>
);
}
