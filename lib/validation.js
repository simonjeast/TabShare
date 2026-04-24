import { z } from "zod";

export const categories = ["Food", "Lodging", "Transport", "Activities", "Groceries", "Other"];

export const groupInputSchema = z.object({
  name: z.string().trim().min(3, "Group name must be at least 3 characters.").max(60),
  purpose: z.string().trim().min(12, "Purpose should explain the workspace clearly.").max(220),
  memberNames: z.array(z.string().trim().min(2).max(40)).min(2, "Add at least 2 members.").max(12)
}).refine(
  (value) => new Set(value.memberNames.map((member) => member.toLowerCase())).size === value.memberNames.length,
  {
    message: "Member names must be unique.",
    path: ["memberNames"]
  }
);

export const expenseInputSchema = z.object({
  groupSlug: z.string().trim().min(2),
  title: z.string().trim().min(3, "Expense title must be at least 3 characters.").max(80),
  notes: z.string().trim().max(220).optional().default(""),
  category: z.enum(categories),
  amount: z.coerce.number().positive("Amount must be greater than zero.").max(50000),
  spentOn: z.string().refine((value) => !Number.isNaN(Date.parse(value)), "Provide a valid date."),
  payerMemberId: z.string().uuid("Choose who paid."),
  participantIds: z.array(z.string().uuid()).min(1, "Choose at least one participant.")
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
