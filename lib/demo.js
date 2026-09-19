import { calculateDerivedState } from "./calculations";

export function getDemoSnapshot() {
  const members = ["Alex", "Jamie", "Sam"].map((name, i) => ({
    id: `demo-${i}`,
    name,
  }));
  const expenses = [
    {
      id: "demo-dinner",
      title: "Saturday dinner",
      category: "Food",
      amountCents: 15000,
      payerId: "demo-1",
      payerName: "Jamie",
      spentOn: "2026-09-12",
    },
    {
      id: "demo-travel",
      title: "Petrol & parking",
      category: "Transport",
      amountCents: 9000,
      payerId: "demo-2",
      payerName: "Sam",
      spentOn: "2026-09-11",
    },
    {
      id: "demo-stay",
      title: "Beach house",
      category: "Lodging",
      amountCents: 48000,
      payerId: "demo-0",
      payerName: "Alex",
      spentOn: "2026-09-11",
    },
  ].map((expense) => ({ ...expense, notes: "", participants: members }));
  return {
    group: {
      id: "demo",
      slug: "demo",
      name: "Coastal weekend",
      purpose: "A few days by the sea, with everything split three ways.",
      currency: "USD",
    },
    members,
    expenses,
    payments: [],
    ...calculateDerivedState(members, expenses),
  };
}
