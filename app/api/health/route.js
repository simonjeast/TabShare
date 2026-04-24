import { getDatabaseHealth } from "@/lib/data";

export const runtime = "nodejs";

export async function GET() {
  const health = await getDatabaseHealth();

  return Response.json({
    status: health.ok ? "ok" : "error",
    checkedAt: new Date().toISOString(),
    ...health
  });
}

