import { getGroupSnapshot } from "@/lib/data";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  const { slug } = await params;
  const snapshot = await getGroupSnapshot(slug);

  if (!snapshot) {
    return Response.json({ error: "Group not found." }, { status: 404 });
  }

  return Response.json(snapshot);
}

