import { createExpense } from "@/lib/data";
import { isDatabaseConfigured } from "@/lib/db";
import { expenseInputSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request, { params }) {
  const { slug } = await params;

  if (!isDatabaseConfigured()) {
    return Response.json({ error: "Database is not configured." }, { status: 500 });
  }

  const payload = await request.json();
  const parsed = expenseInputSchema.safeParse({
    ...payload,
    groupSlug: slug
  });

  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "Invalid expense payload." }, { status: 400 });
  }

  try {
    const expense = await createExpense(parsed.data);
    return Response.json({ id: expense.id }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Unable to save the expense." }, { status: 500 });
  }
}

