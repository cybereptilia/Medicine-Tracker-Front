// Dashboard: tarjetas/resúmenes rápidos de la info más importante para el usuario.
// Aquí puedes mostrar dosis de hoy, recordatorios próximos y actividad reciente.

import Page from "./_Page";

export default function Dashboard() {
  return (
    <Page title="Dashboard">
      {/* Grid responsive simple: se acomoda a 1–3 columnas según el ancho */}
      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
        }}
      >
        <section style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
          <h2>Hoy</h2>
          <p style={{ color: "#666" }}>
            Lista de dosis pendientes + acciones rápidas (Tomar / Saltar).
          </p>
        </section>

        <section style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
          <h2>Próximos recordatorios</h2>
          <p style={{ color: "#666" }}>Vista de 24–48 horas.</p>
        </section>

        <section style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
          <h2>Actividad reciente</h2>
          <p style={{ color: "#666" }}>Tomadas / perdidas / saltadas.</p>
        </section>
      </div>
      <div className="p-4 bg-yellow-100 rounded-xl">
  Tailwind funcionando ✔
</div>

    </Page>
  );
}
