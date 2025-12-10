export const seedUser = { id: "u1", name: "Rosaliz" };
export const seedMedications = [

    {
    id: "m1",
    name: "Sertraline",
    dose: "50",
    unit: "mg",
    route: "oral",
    asNeeded: false,
    startDate : new Date().toISOString().slice(0, 10),
    endDate: null, //it means its an ongoing medication
    prescriber: "Dr. Rivera",
    pharmacy: " CVS, San Juan",
    refillthreshold: "20",
    quantityOnHand: "28",
    notes: "Morning with food",
    lastRefillDate: "2025-09-01",
    refillRemindAfterDays: 30,
    nextRefillReminderISO: new Date("2025-10-01T00:00:00Z").toISOString(),

    },
    
    {id: "m2",
    name: "Albuterol",
    dose: 2,
    unit: "puffs",
    route: "inhalation",
    asNeeded: true,
    startDate: new Date().toISOString().slice(0,10),
    endDate: null,
    prescriber: "",
    pharmacy: "",
    refillThreshold: 20,
    quantityOnHand: 60,
    notes: "",
  },
];

export const seedSchedules = {
  // timeISO should be UTC ISO strings
  m1: [
    { timeISO: "2025-03-27T12:00:00Z", daysOfWeek: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"] },
    { timeISO: "2025-03-27T24:00:00Z", daysOfWeek: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"] },
  ],
  m2: [
    // PRN; keeping an example row here anyways
    { timeISO: "2025-03-27T14:00:00Z", daysOfWeek: ["Mon","Wed","Fri"] },
  ],
};



        

