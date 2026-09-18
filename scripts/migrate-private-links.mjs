import postgres from "postgres";
import { writeFile } from "node:fs/promises";
import { createGroupSlug, isPrivateGroupSlug } from "../lib/access.js";
const apply = process.argv.includes("--apply");
const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
if (!url) throw new Error("Set POSTGRES_URL or DATABASE_URL.");
const sql = postgres(url, { max: 1 });
try {
  const groups = await sql`select id, slug, name from groups`;
  const legacy = groups.filter((group) => !isPrivateGroupSlug(group.slug));
  console.log(`${legacy.length} legacy group links need replacement.`);
  if (!apply) {
    console.log(
      "Dry run only. Back up the database, then use --apply to rotate links.",
    );
  } else if (legacy.length) {
    const plan = legacy.map((group) => ({
      ...group,
      newSlug: createGroupSlug(),
    }));
    // Persist recovery information before changing links; never overwrite an existing report.
    const file = `private-link-migration-${Date.now()}.json`;
    await writeFile(file, JSON.stringify(plan, null, 2), {
      mode: 0o600,
      flag: "wx",
    });
    await sql.begin(async (tx) => {
      for (const group of plan) {
        const changed =
          await tx`update groups set slug=${group.newSlug} where id=${group.id} and slug=${group.slug} returning id`;
        if (changed.length !== 1)
          throw new Error(
            "Group changed during migration. Transaction rolled back.",
          );
      }
    });
    console.log(
      `Migration complete. Store ${file} securely and distribute new links only to the relevant group members.`,
    );
  }
} finally {
  await sql.end();
}
