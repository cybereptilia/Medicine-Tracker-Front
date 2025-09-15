// Inventory: mostrará conteos actuales, umbrales de bajo stock y lógica de refill.
// Como demo, solo un texto explicando y un ejemplo visual.

import Page from "./_Page";

export default function Inventory() {
  return (
    <Page title="Inventory">
      <p style={{ color: "#666" }}>
        Vista para controlar el inventario (píldoras restantes, umbral "low stock", recargas).
        Más adelante se conectará con el backend para actualizar la base de datos.
      </p>
      <div style={{ marginTop: 12, border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
        <strong>Ejemplo:</strong> Paracetamol — 8 píldoras restantes (umbral: 10) → mostrar alerta.
      </div>
    </Page>
  );
}
