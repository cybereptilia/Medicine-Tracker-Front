// Schedules: aquí definiremos (más adelante) la UI para elegir horas/frecuencias.
// Por ahora, dejamos un placeholder claro para que tu PM vea avance visual.

import Page from "./_Page";
import SidebarNav from "../Components/SidebarNav";

export default function Schedules() {
  return (
    <Page title="Schedules" sidebar={<SidebarNav />}>
    <div className="space-y-3">
  <div className="bg-white/90 rounded-xl p-4">
    <strong>Lunes a Viernes</strong> — Sertralina 50 mg @ 8:00 AM
  </div>
  <div className="bg-white/90 rounded-xl p-4">
    <strong>Todos los días</strong> — Ibuprofeno 400 mg @ 1:00 PM (si hay dolor)
  </div>
</div>
    </Page>
  );
}

