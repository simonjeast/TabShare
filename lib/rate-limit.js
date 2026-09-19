import { InputError } from "./errors.js";
// A database-backed ceiling works across serverless instances and does not trust client-supplied IPs.
export async function consumeWriteLimit(sql, key, limit, windowSeconds) {
  const rows = await sql`
    insert into write_limits (key, window_start, count)
    values (${key}, now(), 1)
    on conflict (key) do update set
      count = case when write_limits.window_start < now() - (${windowSeconds} * interval '1 second') then 1 else write_limits.count + 1 end,
      window_start = case when write_limits.window_start < now() - (${windowSeconds} * interval '1 second') then now() else write_limits.window_start end
    returning count
  `;
  if (rows[0].count > limit)
    throw new InputError("Too many requests. Please try again later.", 429);
}
