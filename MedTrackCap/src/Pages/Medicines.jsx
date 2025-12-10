// src/Pages/Medicines.jsx
import React from "react";
import { Link } from "react-router-dom";
import Page from "./_Page";

const LS_KEY = "medtracker.medicines";

export default function Medicines() {
  // 1) Estado desde localStorage
  const [items, setItems] = React.useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // 2) Estado de búsqueda
  const [q, setQ] = React.useState("");

  // 3) Persistencia
  React.useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items]);

  const removeMedicine = (id) => {
    if (!window.confirm("¿Eliminar esta medicina?")) return;
    setItems((prev) => prev.filter((m) => m.id !== id));
  };

  const quickEdit = (m) => {
    const nextName = prompt("Editar nombre de la medicina:", m.name)?.trim();
    if (!nextName) return;
    setItems((prev) =>
      prev.map((x) => (x.id === m.id ? { ...x, name: nextName } : x)),
    );
  };

  const filtered = q
    ? items.filter((m) =>
        (m.name + " " + (m.prescriber || ""))
          .toLocaleLowerCase()
          .includes(q.toLocaleLowerCase()),
      )
    : items;

  return (
    <Page title="My Meds">
      {/* Buscador + botón "Add Meds" solo en desktop */}
      <div className="flex flex-col md:flex-row gap-3 mb-4 md:items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre o prescriptor"
          className="w-full md:flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm md:text-base"
        />

        <Link
          to="/medications/new"
          className="hidden md:inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <span className="text-lg">＋</span>
          Add meds
        </Link>
      </div>

      {/* Lista de tarjetas */}
      <div className="grid gap-3 mb-4">
        {filtered.length === 0 && (
          <div className="card text-slate-700">
            No hay resultados. Agrega medicinas desde "Add Meds" o ajusta tu búsqueda.
          </div>
        )}

        {filtered.map((m) => (
          <article key={m.id} className="card">
            <div className="flex justify-between gap-2 items-baseline">
              <h3 className="m-0 font-semibold text-slate-900">{m.name}</h3>
              <small className="text-slate-500">
                {m.dose} {m.unit}
              </small>
            </div>

            {m.prescriber && (
              <div className="text-slate-500 text-sm mt-1">
                Prescriber: {m.prescriber}
              </div>
            )}

            {m.notes && (
              <p className="text-slate-700 text-sm mt-2">{m.notes}</p>
            )}

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => quickEdit(m)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
              >
                Edit
              </button>
              <button
                onClick={() => removeMedicine(m.id)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-sm hover:bg-slate-50"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </Page>
  );
}
