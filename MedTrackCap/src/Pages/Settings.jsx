// Settings.jsx
import Page from "./_Page";
import SidebarNav from "../Components/SidebarNav";
import Card from "../Components/Card.jsx";

export default function Settings() {
  return (
    <Page title="Settings" sidebar={<SidebarNav />}>
       <div className="max-w-xl lg:max-w-2xl mx-auto space-y-6">
        <Card title="Timezone">
          <select className="w-full rounded-xl border border-slate-300 px-3 py-2">
            <option>America/New_York</option>
            <option>America/Chicago</option>
            <option>America/Los_Angeles</option>
          </select>
        </Card>

        <Card title="Email Alerts">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 text-teal-600" /> Enable
          </label>
        </Card>
      </div>
    </Page>
  );
}
