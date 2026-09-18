import { InputError } from "@/lib/errors";
import { readJson } from "@/lib/http";
import { createGroup } from "@/lib/data";
import { isDatabaseConfigured } from "@/lib/db";
import { groupInputSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request) {
  if (!isDatabaseConfigured()) {
    return Response.json(
      { error: "Service is temporarily unavailable." },
      { status: 503 },
    );
  }

  const body = await readJson(request);
  if (body.response) return body.response;
  const payload = body.data;
  const parsed = groupInputSchema.safeParse(payload);

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid group payload." },
      { status: 400 },
    );
  }

  try {
    const group = await createGroup(parsed.data);
    return Response.json({ slug: group.slug, id: group.id }, { status: 201 });
  } catch (error) {
    if (error instanceof InputError) return Response.json({ error: error.message }, { status: error.status });
    return Response.json(
      { error: "Unable to create the group." },
      { status: 503 },
    );
  }
}
