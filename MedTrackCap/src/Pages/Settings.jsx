// Settings: configuración de zona horaria, alertas por email, etc.
// Esto terminará sincronizándose con el backend (perfil del usuario).

import Page from "./_Page";

export default function Settings() {
  return (
    <Page title="Settings">
      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
        }}
      >
        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
          <h3>Timezone</h3>
          <select style={{ padding: 8, borderRadius: 8, border: "1px solid #ccc", width: "100%" }}>
            <option>America/New_York</option>
            <option>America/Chicago</option>
            <option>America/Los_Angeles</option>
          </select>
        </div>

        <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
          <h3>Email Alerts</h3>
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="checkbox" /> Enable
          </label>
        </div>
      </div>
    </Page>
  );
}
