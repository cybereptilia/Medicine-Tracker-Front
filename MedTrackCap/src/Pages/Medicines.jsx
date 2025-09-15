// Medicines.jsx
import React from "react";
import Page from "./_Page";
import FieldHelp from "../Components/FieldHelp";
const LS_KEY = "medtracker.medicines";

//  Map your form field names ➜ the keys used in staticTips
// (so we don’t have to rename your state or change staticTips file)
const fieldKeyMap = {
  name: "medicationName",
  dose: "dosage",
  unit: "unit",          // optional tip — add to staticTips if you want
  prescriber: "prescriber", // optional tip — add to staticTips if you want
  notes: "notes"         // optional tip — add to staticTips if you want
};

export default function Medicines() {
  // 1) Local state hydrated from localStorage (with guards)
  const [items, setItems] = React.useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // 2) "Add" form state
  const [form, setForm] = React.useState({
    name: "",
    dose: "",
    unit: "pill",
    prescriber: "",
    notes: "",
  });

  // 2b) Visual search/filter state
  const [q, setQ] = React.useState("");

  // 3) Persistence: save on every items change
  React.useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items]);

  // 4) Generic change handler
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const addMedicine = (e) => {
    e.preventDefault();

    // minimal validations
    const name = form.name.trim();
    if (!name) return alert("El nombre es obligatorio.");
    if (!form.dose.trim() || Number.isNaN(Number(form.dose))) {
      return alert("La dosis debe ser un número.");
    }

    // avoid duplicates (case/trim-insensitive)
    const key = name.toLocaleLowerCase();
    const exists = items.some((m) => m.name.trim().toLocaleLowerCase() === key);
    if (exists) return alert("Ya existe una medicina con ese nombre.");

    const newItem = {
      id: (crypto?.randomUUID && crypto.randomUUID()) || String(Date.now()),
      name,
      dose: form.dose.trim(),
      unit: form.unit,
      prescriber: form.prescriber.trim(),
      notes: form.notes.trim(),
      createdAt: Date.now(),
    };

    setItems((prev) => [newItem, ...prev]);
    setForm({ name: "", dose: "", unit: "pill", prescriber: "", notes: "" });
  };

  const removeMedicine = (id) => {
    if (!window.confirm("¿Eliminar esta medicina?")) return;
    setItems((prev) => prev.filter((m) => m.id !== id));
  };

  const quickEdit = (m) => {
    // simple placeholder edit (until you add a modal/page)
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
    <Page title="Medicines">
      {/* Search + jump-to-form button */}
      <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre o prescriptor"
          style={{ padding: 8, borderRadius: 8, border: "1px solid #ccc", flex: 1, minWidth: 220 }}
        />
        <button
          onClick={() => document.getElementById("add-form")?.scrollIntoView({ behavior: "smooth" })}
          style={{ padding: "8px 12px", borderRadius: 8, background: "black", color: "white", border: 0 }}
        >
          + Add Medicine
        </button>
      </div>

      {/* Card list */}
      <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
        {filtered.length === 0 && (
          <div className="card">No hay resultados. Agrega medicinas o ajusta tu búsqueda.</div>
        )}
        {filtered.map((m) => (
          <article key={m.id} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
              <h3 style={{ margin: 0 }}>{m.name}</h3>
              <small style={{ color: "#64748b" }}>
                {m.dose} {m.unit}
              </small>
            </div>

            {m.prescriber && (
              <div style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Prescriber: {m.prescriber}</div>
            )}

            {m.notes && <p style={{ color: "#334155", fontSize: 14, marginTop: 8 }}>{m.notes}</p>}

            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <button
                onClick={() => quickEdit(m)}
                style={{ padding: "6px 10px", borderRadius: 8, background: "black", color: "white", border: 0 }}
              >
                Edit
              </button>
              <button
                onClick={() => removeMedicine(m.id)}
                style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ccc", background: "white" }}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Create form */}
      <form
        id="add-form"
        onSubmit={addMedicine}
        className="card"
        style={{ display: "grid", gap: 8, maxWidth: 720 }}
      >
        <h3 style={{ margin: 0 }}>Agregar medicina</h3>

        {/* NAME */}
        <label htmlFor="name" className="sr-only">Nombre</label>
        <input
          id="name"
          name="name"
          placeholder="Nombre (p. ej., Ibuprofeno)"
          value={form.name}
          onChange={onChange}
          style={{ padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
          aria-describedby="name-help"
          required
        />
        {/* ⬇️ FieldHelp shows static tip immediately; upgrades if AI returns */}
        <FieldHelp fieldKey={fieldKeyMap.name} id="name-help" />

        <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr" }}>
          {/* DOSE */}
          <label htmlFor="dose" className="sr-only">Dosis</label>
          <input
            id="dose"
            name="dose"
            type="number"
            min="0"
            step="0.01"
            placeholder="Dosis (número, p. ej., 200)"
            value={form.dose}
            onChange={onChange}
            style={{ padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
            inputMode="decimal"
            aria-describedby="dose-help"
            required
          />
          <FieldHelp fieldKey={fieldKeyMap.dose} id="dose-help" />

          {/* UNIT */}
          <label htmlFor="unit" className="sr-only">Unidad</label>
          <select
            id="unit"
            name="unit"
            value={form.unit}
            onChange={onChange}
            style={{ padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
            aria-describedby="unit-help"
          >
            <option value="pill">pill</option>
            <option value="mg">mg</option>
            <option value="ml">ml</option>
            <option value="caps">caps</option>
            <option value="drops">drops</option>
          </select>
          <FieldHelp fieldKey={fieldKeyMap.unit} id="unit-help" />
        </div>

        {/* PRESCRIBER */}
        <label htmlFor="prescriber" className="sr-only">Prescriber</label>
        <input
          id="prescriber"
          name="prescriber"
          placeholder="Prescriber (opcional)"
          value={form.prescriber}
          onChange={onChange}
          style={{ padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
          aria-describedby="prescriber-help"
        />
        <FieldHelp fieldKey={fieldKeyMap.prescriber} id="prescriber-help" />

        {/* NOTES */}
        <label htmlFor="notes" className="sr-only">Notas</label>
        <textarea
          id="notes"
          name="notes"
          placeholder="Notas (opcional)"
          value={form.notes}
          onChange={onChange}
          rows={3}
          style={{ padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
          aria-describedby="notes-help"
        />
        <FieldHelp fieldKey={fieldKeyMap.notes} id="notes-help" />

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="submit"
            style={{ padding: "8px 12px", borderRadius: 8, background: "black", color: "white", border: 0 }}
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => setForm({ name: "", dose: "", unit: "pill", prescriber: "", notes: "" })}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ccc", background: "white" }}
          >
            Limpiar
          </button>
        </div>
      </form>
    </Page>
  );
}