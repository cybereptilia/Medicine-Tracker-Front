// Schedules: aquí definiremos (más adelante) la UI para elegir horas/frecuencias.
// Por ahora, dejamos un placeholder claro para que tu PM vea avance visual.

import Page from "./_Page";

export default function Schedules() {
  return (
    <Page title="Schedules">
      <p style={{ color: "#666" }}>
        Aquí irá el selector de horarios (time pickers), días de la semana y frecuencia por medicina.
        La idea es que la información se guarde y luego alimente el Dashboard.
      </p>
    </Page>
  );
}
