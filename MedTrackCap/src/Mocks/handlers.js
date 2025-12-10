import { http, HttpResponse, delay } from 'msw';
import { seedUser, seedMedications, seedSchedules } from "./seed";

let meds = [...seedMedications];

export const handlers = [
    //CRSF token simulation
    http.get("/api/crsf", () => HttpResponse.json({ token: "demo-crsf"})),


// Auth simulation
http.post("/api/auth/login", async ({ request }) => {
  const body = await request.json().catch(() => ({}));

  // I'll just ignore body and always return success
  return HttpResponse.json({
    token: "dev-token",
    user: {
      id: "u1",
      name: "Demo User",
      email: body?.email || "demo@example.com",
      roles: ["user"],
    },
  });
}),

//Auth simulation
http.post("/api/medications", async ({ request }) => {
  const body = await request.json();

  // valida mínimos
  const fieldErrors = {};
  if (!body?.name) fieldErrors.name = "Required";
  if (!body?.dose || Number(body.dose) <= 0) fieldErrors.dose = "Must be > 0";
  if (Object.keys(fieldErrors).length) {
    return HttpResponse.json({ fieldErrors }, { status: 400 });
  }

  // calcula próximo recordatorio
  let nextRefillReminderISO = null;
  if (body.lastRefillDate && Number(body.refillRemindAfterDays) > 0) {
    const [y, m, d] = body.lastRefillDate.split("-").map(Number);
    const base = new Date(y, m - 1, d);
    base.setDate(base.getDate() + Number(body.refillRemindAfterDays));
    nextRefillReminderISO = base.toISOString();
  }

  const created = { id: crypto.randomUUID?.() ?? `m${Date.now()}`, ...body, nextRefillReminderISO };
  meds = [created, ...meds]; // asegúrate de tener let meds = [...] arriba
  return HttpResponse.json(created, { status: 201 });
}),


    //Schedules
    http.get("/api/schedules", async ({request}) => {
    await delay(200);
    const url = new URL(request.url);
    const medId = url.searchParams.get("medId") || "m1";
     //@ts ignore

    return HttpResponse.json(seedSchedules[medId] ?? []);
}),
];


