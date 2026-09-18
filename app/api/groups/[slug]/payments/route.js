import { recordPayment } from "@/lib/data";
import { paymentInputSchema } from "@/lib/validation";
import { readJson } from "@/lib/http";
import { InputError } from "@/lib/errors";
export async function POST(request, { params }) {
  const { slug } = await params;
  const body = await readJson(request);
  if (body.response) return body.response;
  const parsed = paymentInputSchema.safeParse({
    ...body.data,
    groupSlug: slug,
  });
  if (!parsed.success)
    return Response.json(
      { error: parsed.error.issues[0]?.message },
      { status: 400 },
    );
  try {
    return Response.json(await recordPayment(parsed.data), { status: 201 });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof InputError
            ? error.message
            : "Unable to record payment.",
      },
      { status: error instanceof InputError ? error.status : 503 },
    );
  }
}
