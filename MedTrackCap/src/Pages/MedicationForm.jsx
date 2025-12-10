// src/Pages/MedicationForm.jsx
import React, { useState } from "react";
import Page from "./_Page";
import Card from "../Components/Card.jsx";
import SidebarNav from "../Components/SidebarNav";

/** Catálogo base para controles de selección rápida. */
const UNITS = ["mg", "mcg", "g", "mL", "drops", "puffs", "tabs", "caps", "units"];
const ROUTES = [
  "oral", "sublingual", "topical", "ophthalmic", "otic",
  "nasal", "inhalation", "subcutaneous", "intramuscular", "IV", "other"
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  { v: "01", label: "01" }, { v: "02", label: "02" }, { v: "03", label: "03" },
  { v: "04", label: "04" }, { v: "05", label: "05" }, { v: "06", label: "06" },
  { v: "07", label: "07" }, { v: "08", label: "08" }, { v: "09", label: "09" },
  { v: "10", label: "10" }, { v: "11", label: "11" }, { v: "12", label: "12" },
];

/** Estado inicial del formulario. */
const INITIAL_FORM = {
  name: "",
  dose: "",
  unit: "mg",
  route: "oral",
  asNeeded: false,
  startDate: "",
  endDate: "",
  lastRefillDate: "",
  refillRemindAfterDays: "",
  prescriber: "",
  pharmacy: "",
  refillThreshold: 20,
  quantityOnHand: "",
  notes: "",
};

/** Convierte mm/dd al ISO YYYY-mm-dd usando el año actual. */
function composeISOFromMMDD(mm, dd) {
  if (!mm || !dd) return "";
  const y = String(new Date().getFullYear());
  return `${y}-${mm}-${String(dd).padStart(2, "0")}`;
}

/** Chips de selección simple. */
function OptionChips({ value, onChange, options }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={
              "whitespace-nowrap px-3 py-1 rounded-full border text-sm " +
              (active
                ? "bg-teal-50 border-teal-600 text-teal-700"
                : "border-slate-300 text-slate-700 hover:bg-slate-50")
            }
            aria-pressed={active}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default function MedicationForm() {
  const [form, setForm] = useState(() => ({ ...INITIAL_FORM }));
  const [rows, setRows] = useState([]);        // filas de horario
  const [errors, setErrors] = useState({});    // mensajes por campo
  const [status, setStatus] = useState("");    // feedback a usuario
  const [savedMeds, setSavedMeds] = useState([]);

  const [lastRefillMonth, setLastRefillMonth] = useState(
    form.lastRefillDate ? form.lastRefillDate.slice(5, 7) : ""
  );
  const [lastRefillDay, setLastRefillDay] = useState(
    form.lastRefillDate ? form.lastRefillDate.slice(8, 10) : ""
  );

  // cada vez que cambien, si hay ambos, actualizamos form.lastRefillDate
  function updateLastRefillISO(nextMonth, nextDay) {
    if (nextMonth && nextDay) {
      setField("lastRefillDate", composeISOFromMMDD(nextMonth, nextDay));
    } else {
      setField("lastRefillDate", ""); // aún incompleto
    }
  }

  /** Patchea un campo del formulario sin mutar el resto. */
  function setField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  // ----- Gestión de horario -----
  function addRow() {
    setRows((prev) => [...prev, { timeLocalHHMM: "", daysOfWeek: [] }]);
  }
  function updateRow(i, next) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? next : r)));
  }
  function removeRow(i) {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  }
  function toggleDay(i, day) {
    const r = rows[i];
    const has = r.daysOfWeek.includes(day);
    updateRow(i, {
      ...r,
      daysOfWeek: has ? r.daysOfWeek.filter((d) => d !== day) : [...r.daysOfWeek, day],
    });
  }

  /** Normaliza una hora local (HH:mm) a ISO UTC usando una fecha dada. */
  function localHHMMToUTCISO(dateYYYYMMDD, hhmm) {
    if (!dateYYYYMMDD || !hhmm) return null;
    const [h, m] = hhmm.split(":").map(Number);
    const [y, mo, d] = dateYYYYMMDD.split("-").map(Number);
    return new Date(y, mo - 1, d, h, m, 0).toISOString();
  }

  // ----- Validación & Submit -----
  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Requerido";
    const doseNum = Number(form.dose);
    if (!(doseNum > 0)) e.dose = "La dosis debe ser > 0";

    if (!form.asNeeded) {
      if (rows.length === 0) e.schedule = "Añade al menos una hora";
      rows.forEach((r, i) => {
        if (!r.timeLocalHHMM) e[`row-${i}-time`] = "Hora requerida";
        if (!r.daysOfWeek.length) e[`row-${i}-days`] = "Selecciona al menos un día";
      });
    }
    if (form.endDate && form.startDate && form.endDate < form.startDate) {
      e.endDate = "La fecha de fin debe ser posterior a la de inicio";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("");
    if (!validate()) return;

    const schedule = form.asNeeded
      ? []
      : rows.map((r) => ({
          timeISO: localHHMMToUTCISO(
            form.startDate || new Date().toISOString().slice(0, 10),
            r.timeLocalHHMM
          ),
          daysOfWeek: r.daysOfWeek,
        }));

    const payload = {
      name: form.name.trim(),
      dose: Number(form.dose),
      unit: form.unit,
      route: form.route,
      asNeeded: form.asNeeded,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
      prescriber: form.prescriber || "",
      pharmacy: form.pharmacy || "",
      quantityOnHand: form.quantityOnHand === "" ? 0 : Number(form.quantityOnHand),
      notes: form.notes || "",
      schedule,
      lastRefillDate: form.lastRefillDate || null,
      refillRemindAfterDays: form.refillRemindAfterDays
        ? Number(form.refillRemindAfterDays)
        : null,
    };

    try {
      setStatus("Guardando…");
      const res = await fetch("/api/medications", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        const saved = await res.json();
        setStatus("¡Guardado!");
        setForm(() => ({ ...INITIAL_FORM }));
        setRows([]);
        setSavedMeds((prev) => [saved, ...prev]);
      } else if (res.status === 400) {
        const data = await res.json();
        const fe = {};
        if (data.fieldErrors) {
          for (const [k, v] of Object.entries(data.fieldErrors)) fe[k] = v;
        }
        setErrors((prev) => ({ ...prev, ...fe }));
        setStatus("Corrige los campos marcados.");
      } else {
        setStatus("No se pudo guardar.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error de red.");
    }

    
  }

  // ----- UI helpers -----
  const inputCls =
    "w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500";
  const labelCls = "block text-sm font-medium text-slate-700 mb-1";

  // ----- Render -----
  return (
    <Page title="Registrar medicamento" sidebar={<SidebarNav />}>
      {/* Usamos un único <form> envolviendo todas las secciones sólidas (Cards) */}
      <form onSubmit={onSubmit} noValidate aria-describedby="form-status">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* DATOS BÁSICOS */}
          <Card title="Datos básicos">
            <p className="text-sm text-slate-500 mb-4">
              Completa los datos básicos y, si aplica, el horario de tomas.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="name" className={labelCls}>Nombre del medicamento</label>
                <input
                  id="name"
                  className={inputCls}
                  placeholder="Ej.: Sertralina"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p id="name-error" role="alert" className="mt-1 text-sm text-rose-600">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="dose" className={labelCls}>Dosis</label>
                <input
                  id="dose"
                  type="number"
                  className={inputCls}
                  placeholder="50"
                  value={form.dose}
                  onChange={(e) => setField("dose", e.target.value)}
                  aria-describedby={errors.dose ? "dose-error" : undefined}
                />
                {errors.dose && (
                  <p id="dose-error" role="alert" className="mt-1 text-sm text-rose-600">
                    {errors.dose}
                  </p>
                )}
              </div>

              <div>
                <label className={labelCls}>Unidad</label>
                <OptionChips value={form.unit} onChange={(v) => setField("unit", v)} options={UNITS} />
              </div>

              <div className="md:col-span-2">
                <label className={labelCls}>Vía</label>
                <OptionChips value={form.route} onChange={(v) => setField("route", v)} options={ROUTES} />
              </div>

              <label className="flex items-center gap-2 md:col-span-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-teal-600"
                  checked={form.asNeeded}
                  onChange={(e) => setField("asNeeded", e.target.checked)}
                />
                <span className="text-sm text-slate-700">Según necesidad (sin horario fijo)</span>
              </label>

              <div>
                <label htmlFor="startDate" className={labelCls}>Fecha de inicio</label>
                <input
                  id="startDate"
                  type="date"
                  className={inputCls}
                  value={form.startDate}
                  onChange={(e) => setField("startDate", e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="endDate" className={labelCls}>Fecha de fin (opcional)</label>
                <input
                  id="endDate"
                  type="date"
                  className={inputCls}
                  value={form.endDate}
                  onChange={(e) => setField("endDate", e.target.value)}
                  aria-describedby={errors.endDate ? "endDate-error" : undefined}
                />
                {errors.endDate && (
                  <p id="endDate-error" role="alert" className="mt-1 text-sm text-rose-600">
                    {errors.endDate}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* HORARIO */}
          {!form.asNeeded && (
            <Card title="Horario de tomas">
              {errors.schedule && (
                <p role="alert" className="mb-3 text-sm text-rose-600">{errors.schedule}</p>
              )}

              <div className="space-y-3">
                {rows.map((r, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor={`time-${i}`} className={labelCls}>Hora</label>
                        <input
                          id={`time-${i}`}
                          type="time"
                          className={inputCls}
                          value={r.timeLocalHHMM}
                          onChange={(e) => updateRow(i, { ...r, timeLocalHHMM: e.target.value })}
                          aria-describedby={errors[`row-${i}-time`] ? `row-${i}-time-error` : undefined}
                        />
                        {errors[`row-${i}-time`] && (
                          <p id={`row-${i}-time-error`} role="alert" className="mt-1 text-sm text-rose-600">
                            {errors[`row-${i}-time`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <span className={labelCls}>Días</span>
                        <div className="flex flex-wrap gap-2">
                          {DAYS.map((d) => {
                            const active = r.daysOfWeek.includes(d);
                            return (
                              <button
                                key={d}
                                type="button"
                                onClick={() => toggleDay(i, d)}
                                className={
                                  "px-3 py-1 rounded-full border text-sm " +
                                  (active
                                    ? "bg-teal-50 border-teal-500 text-teal-700"
                                    : "border-slate-300 text-slate-600 hover:bg-slate-50")
                                }
                                aria-pressed={active}
                              >
                                {d}
                              </button>
                            );
                          })}
                        </div>
                        {errors[`row-${i}-days`] && (
                          <p role="alert" className="mt-1 text-sm text-rose-600">
                            {errors[`row-${i}-days`]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => removeRow(i)}
                        className="text-sm text-slate-500 hover:text-rose-600 underline"
                      >
                        Quitar fila
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addRow}
                className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-50"
              >
                + Añadir hora
              </button>
            </Card>
          )}

          {/* DETALLES OPCIONALES */}
          <Card title="Detalles opcionales">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="prescriber" className={labelCls}>Médico</label>
                <input
                  id="prescriber"
                  className={inputCls}
                  value={form.prescriber}
                  onChange={(e) => setField("prescriber", e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="pharmacy" className={labelCls}>Farmacia</label>
                <input
                  id="pharmacy"
                  className={inputCls}
                  value={form.pharmacy}
                  onChange={(e) => setField("pharmacy", e.target.value)}
                />

                <div className="mt-4">
                  <label htmlFor="quantityOnHand" className={labelCls}>Cantidad disponible</label>
                  <input
                    id="quantityOnHand"
                    type="number"
                    className={inputCls}
                    value={form.quantityOnHand}
                    onChange={(e) => setField("quantityOnHand", e.target.value)}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {form.unit === "puffs"
                      ? "Ej.: 120 puffs restantes"
                      : form.unit === "drops"
                        ? "Ej.: 50 gotas restantes"
                        : "Ej.: 30 tabletas"}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* RECORDATORIO DE REFILL */}
          <Card title="Recordatorio de refill">
            <p className="text-xs text-slate-500 mb-3">
              ¿Cuándo fue tu último refill y cada cuántos días quieres que te avisemos?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
               <label className={labelCls}>Último refill (mm/dd)</label>
<div className="flex gap-2">
  <select
    aria-label="Mes"
    className={inputCls + " w-28"}
    value={lastRefillMonth}
    onChange={(e) => {
      const mm = e.target.value;
      setLastRefillMonth(mm);
      updateLastRefillISO(mm, lastRefillDay);
    }}
  >
    <option value="">mm</option>
    {MONTHS.map((m) => (
      <option key={m.v} value={m.v}>{m.label}</option>
    ))}
  </select>

  <select
    aria-label="Día"
    className={inputCls + " w-28"}
    value={lastRefillDay}
    onChange={(e) => {
      const dd = e.target.value;
      setLastRefillDay(dd);
      updateLastRefillISO(lastRefillMonth, dd);
    }}
  >
    <option value="">dd</option>
    {Array.from({ length: 31 }, (_, i) => {
      const d = String(i + 1).padStart(2, "0");
      return <option key={d} value={d}>{d}</option>;
    })}
  </select>
</div>

                <label htmlFor="refillRemindAfterDays" className={`${labelCls} mt-4`}>Avísame luego de (días)</label>
                <input
                  id="refillRemindAfterDays"
                  type="number"
                  inputMode="numeric"
                  className={inputCls + " appearance-none"}
                  placeholder="30"
                  value={form.refillRemindAfterDays}
                  onChange={(e) => setField("refillRemindAfterDays", e.target.value)}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Ej.: 30 días después del último refill.
                </p>
              </div>
            </div>
          </Card>

        <Card title="Notas">
  <label htmlFor="notes" className={labelCls}>
  <span className="sr-only">(campo opcional)</span>
  </label>
  <textarea
    id="notes"
    className={"min-h-[96px] " + inputCls}
    aria-describedby="notes-help"
    placeholder="Ej.: Tomar previo al almuerzo, o 'Si migraña ocurre, suspender y contactar al doctor'."
    value={form.notes}
    onChange={(e) => setField("notes", e.target.value)}
  />
</Card>


          {/* ACCIONES */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => {
                setForm(() => ({ ...INITIAL_FORM }));
                setRows([]);
                setErrors({});
                setStatus("");
              }}
              className="rounded-xl border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              Limpiar
            </button>
            <span className="text-sm text-slate-500" aria-live="polite" id="form-status">
              {status}
            </span>
          </div>

          {/* RESUMEN */}
          {savedMeds.length > 0 && (
            <Card title="Medicamentos guardados">
              <div className="space-y-3">
                {savedMeds.map((m) => (
                  <div key={m.id} className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                    <h3 className="font-semibold text-slate-900">{m.name}</h3>
                    <p className="text-sm text-slate-700">
                      {m.dose} {m.unit}, {m.route}
                    </p>
                    {m.nextRefillReminderISO && (
                      <p className="text-xs text-teal-700 mt-1">
                        Próximo recordatorio de refill:{" "}
                        {new Date(m.nextRefillReminderISO).toLocaleDateString("es-PR")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </form>
    </Page>
  );
}
  /** Reglas de validación básicas para el formulario. */ 