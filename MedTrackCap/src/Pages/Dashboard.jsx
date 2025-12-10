// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Page from "./_Page";
import Card from "../Components/Card.jsx";
import SidebarNav from "../Components/SidebarNav";

export default function Dashboard() {
  const [meds, setMeds] = useState([]);

  useEffect(() => {
    fetch("/api/medications")
      .then((r) => r.json())
      .then(setMeds)
      .catch(() => setMeds([]));
  }, []);

  const soon = meds
    .filter((m) => m.nextRefillReminderISO)
    .sort(
      (a, b) =>
        new Date(a.nextRefillReminderISO) - new Date(b.nextRefillReminderISO)
    )
    .slice(0, 5);

  return (
    <Page title="Dashboard" sidebar={<SidebarNav />}>
      <div
        className="grid gap-4 md:gap-5"
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}
      >
        <Card title="Hoy">
          Lista de dosis pendientes y botones rápidos (Tomar / Saltar).
        </Card>

        <Card title="Próximos recordatorios">
          Lo que toca en las próximas 24 a 48 horas.
        </Card>

        <Card title="Actividad reciente">
          Dosis tomadas, olvidadas o que la persona decidió saltar.
        </Card>

        <Card title="Próximos refills" className="md:col-span-2 lg:col-span-3 mt-2">
          {soon.length === 0 ? (
            <p>No hay recordatorios de refill programados.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {soon.map((m) => (
                <li key={m.id} className="text-slate-800">
                  <span className="font-medium text-slate-900">{m.name}</span>{" "}
                  {" - "}
                  {new Date(m.nextRefillReminderISO).toLocaleDateString(
                    "es-PR",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Botón extra solo en desktop, porque en mobile ya está la tab "Add Meds" */}
      <div className="mt-8 hidden md:block">
        <Link
          to="/medications/new"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent"
        >
          <span className="text-lg">＋</span> Registrar medicamento
        </Link>
      </div>
    </Page>
  );
}
