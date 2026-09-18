import { getGroupSnapshot } from "@/lib/data";
export const runtime = "nodejs";
export async function GET(_request, { params }) {
  const { slug } = await params;
  try {
    const snapshot = await getGroupSnapshot(slug);
    if (!snapshot)
      return Response.json({ error: "Group not found." }, { status: 404 });
    return Response.json(snapshot, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return Response.json(
      { error: "Unable to load this group right now." },
      { status: 503 },
    );
  }
}
