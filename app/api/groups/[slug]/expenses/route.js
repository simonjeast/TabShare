import { InputError } from "@/lib/errors";
import { readJson } from "@/lib/http";
import { createExpense } from "@/lib/data";
import { isDatabaseConfigured } from "@/lib/db";
import { expenseInputSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request, { params }) {
  const { slug } = await params;

  if (!isDatabaseConfigured()) {
    return Response.json(
      { error: "Service is temporarily unavailable." },
      { status: 503 },
    );
  }

  const body = await readJson(request);
  if (body.response) return body.response;
  const payload = body.data;
  const parsed = expenseInputSchema.safeParse({
    ...payload,
    groupSlug: slug,
  });

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid expense payload." },
      { status: 400 },
    );
  }

  try {
    const expense = await createExpense(parsed.data);
    return Response.json({ id: expense.id }, { status: 201 });
  } catch (error) {
    if (error instanceof InputError)
      return Response.json({ error: error.message }, { status: error.status });
    return Response.json(
      { error: "Unable to save the expense." },
      { status: 503 },
    );
  }
}
