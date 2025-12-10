// Inventory: mostrará conteos actuales, umbrales de bajo stock y lógica de refill.
// Como demo, solo un texto explicando y un ejemplo visual.
// Inventory.jsx
import Page from "./_Page";
import SidebarNav from "../Components/SidebarNav";
import Card from "../Components/Card.jsx";

export default function Inventory() {
  return (
    <Page title="Inventory" sidebar={<SidebarNav />}>
      <Card>
        <p className="text-slate-700">
          Esta sección muestra tus medicamentos actuales y cuántas dosis quedan.
          Cuando el número cae por debajo del umbral, se mostrará una alerta de refill.
        </p>
       <ul className="mt-4 space-y-2">
  <li className="rounded-xl bg-white/90 p-3">
    <strong>Sertralina 50 mg</strong> — 8 tabletas restantes (alerta a 10)
  </li>
  <li className="rounded-xl bg-white/90 p-3">
    <strong>Ibuprofeno 400 mg</strong> — 24 tabletas restantes (sin alerta)
  </li>
</ul>
      </Card>
    </Page>
  );
}
