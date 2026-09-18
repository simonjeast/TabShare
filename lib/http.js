export async function readJson(request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return {
      response: Response.json(
        { error: "Send a JSON request." },
        { status: 415 },
      ),
    };
  }
  const maxBytes = 16384;
  if (Number(request.headers.get("content-length")) > maxBytes)
    return {
      response: Response.json(
        { error: "Request is too large." },
        { status: 413 },
      ),
    };
  const reader = request.body?.getReader();
  if (!reader)
    return {
      response: Response.json(
        { error: "A JSON body is required." },
        { status: 400 },
      ),
    };
  let size = 0;
  const chunks = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        return {
          response: Response.json(
            { error: "Request is too large." },
            { status: 413 },
          ),
        };
      }
      chunks.push(value);
    }
    return { data: JSON.parse(Buffer.concat(chunks).toString("utf8")) };
  } catch {
    return {
      response: Response.json({ error: "Invalid JSON body." }, { status: 400 }),
    };
  }
}
