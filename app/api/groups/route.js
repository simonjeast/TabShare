import { createGroup } from "@/lib/data";
import { isDatabaseConfigured } from "@/lib/db";
import { groupInputSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request) {
  if (!isDatabaseConfigured()) {
    return Response.json({ error: "Database is not configured." }, { status: 500 });
  }

  const payload = await request.json();
  const parsed = groupInputSchema.safeParse(payload);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "Invalid group payload." }, { status: 400 });
  }

  try {
    const group = await createGroup(parsed.data);
    return Response.json({ slug: group.slug, id: group.id }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Unable to create the group." }, { status: 500 });
  }
}

