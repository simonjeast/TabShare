import { z } from "zod";

export const categories = [
  "Food",
  "Lodging",
  "Transport",
  "Activities",
  "Groceries",
  "Other",
];

export const groupInputSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Group name must be at least 3 characters.")
      .max(60),
    purpose: z
      .string()
      .trim()
      .min(12, "Purpose should explain the workspace clearly.")
      .max(220),
    memberNames: z
      .array(z.string().trim().min(2).max(40))
      .min(2, "Add at least 2 members.")
      .max(12),
  })
  .refine(
    (value) =>
      new Set(value.memberNames.map((member) => member.toLowerCase())).size ===
      value.memberNames.length,
    {
      message: "Member names must be unique.",
      path: ["memberNames"],
    },
  );

export const expenseInputSchema = z.object({
  groupSlug: z.string().trim().min(2),
  title: z
    .string()
    .trim()
    .min(3, "Expense title must be at least 3 characters.")
    .max(80),
  notes: z.string().trim().max(220).optional().default(""),
  category: z.enum(categories),
  amount: z.coerce
    .number()
    .finite()
    .min(0.01, "Enter at least $0.01.")
    .max(50000)
    .refine(
      (value) => Math.abs(value * 100 - Math.round(value * 100)) < 0.000001,
      "Use no more than two decimal places.",
    ),
  spentOn: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date.")
    .refine((value) => {
      const date = new Date(`${value}T12:00:00Z`);
      return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
      );
    }, "Provide a real calendar date."),
  payerMemberId: z.string().uuid("Choose who paid."),
  participantIds: z
    .array(z.string().uuid())
    .min(1, "Choose at least one participant.")
    .max(12)
    .refine(
      (ids) => new Set(ids).size === ids.length,
      "Choose each participant once.",
    ),
});

export function splitMemberInput(value) {
  const seen = new Set();

  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => {
      const normalized = item.toLowerCase();

      if (seen.has(normalized)) {
        return false;
      }

      seen.add(normalized);
      return true;
    });
}
