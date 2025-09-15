import { staticTips } from "./staticTips";

let failureCount = 0;
let offlineUntil = 0; // ms epoch

export async function getAssistantTip(fieldKey) {
  const now = Date.now();
  if (now < offlineUntil) return staticTips[fieldKey];

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 2000); // 2s timeout

  try {
    const res = await fetch("/api/assistant/tip", {
      method: "POST",
      signal: ctrl.signal,
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ fieldKey }) // no PHI
    });
    clearTimeout(t);
    if (!res.ok) throw new Error("bad status");
    const { tip } = await res.json();
    failureCount = 0;
    return tip || staticTips[fieldKey];
  } catch {
    clearTimeout(t);
    failureCount++;
    if (failureCount >= 3) offlineUntil = Date.now() + 5 * 60 * 1000; // 5 min
    return staticTips[fieldKey];
  }
}
