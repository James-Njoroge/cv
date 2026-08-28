import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Read/write endpoint for the copy studio.
 *
 * Writes straight to `content/site-copy.json` — the file the site reads — so
 * saving in the studio *is* the change. Hard-disabled outside `next dev`: this
 * is a local authoring tool, not a production CMS.
 *
 * Every response carries a `version` (a hash of the file). A PUT must quote the
 * version it was based on, so a stale tab — one left open while the file
 * changed underneath it, whether from another tab, an editor, or a dev-server
 * reload — gets a 409 instead of silently reverting the newer content.
 */
export const dynamic = "force-dynamic";

const COPY_PATH = path.join(process.cwd(), "content", "site-copy.json");
const BACKUP_PATH = path.join(process.cwd(), "content", ".site-copy.backup.json");

const DEV_ONLY = process.env.NODE_ENV !== "development";

const version = (contents: string) =>
  createHash("sha256").update(contents).digest("hex").slice(0, 16);

function forbidden() {
  return Response.json(
    { message: "The copy studio only runs in development (npm run dev)." },
    { status: 403 }
  );
}

export async function GET() {
  if (DEV_ONLY) return forbidden();

  const raw = await readFile(COPY_PATH, "utf8");
  return Response.json(
    { copy: JSON.parse(raw), version: version(raw) },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function PUT(request: Request) {
  if (DEV_ONLY) return forbidden();

  let body: { copy?: unknown; version?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Body was not valid JSON." }, { status: 400 });
  }

  const { copy, version: base } = body;

  if (typeof copy !== "object" || copy === null || Array.isArray(copy)) {
    return Response.json({ message: "Expected `copy` to be a JSON object." }, { status: 400 });
  }
  if (typeof base !== "string") {
    return Response.json({ message: "Missing `version`." }, { status: 400 });
  }

  const current = await readFile(COPY_PATH, "utf8");
  const currentVersion = version(current);

  if (base !== currentVersion) {
    return Response.json(
      {
        message:
          "This tab is out of date — the file changed since it loaded. Reload the studio to pick up the newer version. Nothing was overwritten.",
        version: currentVersion,
      },
      { status: 409 }
    );
  }

  // Keep one step of undo on disk before overwriting.
  await writeFile(BACKUP_PATH, current, "utf8");

  // Trailing newline keeps Prettier and git diffs happy.
  const next = `${JSON.stringify(copy, null, 2)}\n`;
  await writeFile(COPY_PATH, next, "utf8");

  return Response.json({
    message: "Saved to content/site-copy.json",
    version: version(next),
  });
}

/** Restore the previous save. */
export async function POST() {
  if (DEV_ONLY) return forbidden();

  let backup: string;
  try {
    backup = await readFile(BACKUP_PATH, "utf8");
  } catch {
    return Response.json({ message: "No previous version to restore." }, { status: 404 });
  }

  await writeFile(COPY_PATH, backup, "utf8");
  return Response.json({
    message: "Restored the previous save.",
    copy: JSON.parse(backup),
    version: version(backup),
  });
}
