"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { GROUPS, helpFor, prettify } from "@/lib/copy-schema";

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

/* ------------------------------------------------------------------ paths */

const parse = (path: string) => path.split(".");

function getAt(root: Json, path: string): Json {
  return parse(path).reduce<Json>((node, key) => {
    if (node === null || typeof node !== "object") return null;
    return (node as Record<string, Json>)[key] ?? null;
  }, root);
}

/** Immutably set `path` on `root`, cloning only the spine. */
function setAt(root: Json, path: string, value: Json): Json {
  const keys = parse(path);
  const walk = (node: Json, depth: number): Json => {
    const key = keys[depth];
    const isLast = depth === keys.length - 1;
    if (Array.isArray(node)) {
      const next = [...node];
      const i = Number(key);
      next[i] = isLast ? value : walk(node[i], depth + 1);
      return next;
    }
    const obj = { ...(node as Record<string, Json>) };
    obj[key] = isLast ? value : walk(obj[key], depth + 1);
    return obj;
  };
  return walk(root, 0);
}

interface Leaf {
  path: string;
  value: string | number | boolean;
  group: string;
}

/** Every editable leaf, in document order. */
function flatten(node: Json, prefix = "", group = ""): Leaf[] {
  if (node === null) return [];
  if (typeof node !== "object") {
    return [{ path: prefix, value: node, group }];
  }
  const entries = Array.isArray(node)
    ? node.map((v, i) => [String(i), v] as const)
    : Object.entries(node);
  return entries.flatMap(([key, value]) =>
    flatten(value as Json, prefix ? `${prefix}.${key}` : key, group || key)
  );
}

/* ----------------------------------------------------------------- fields */

function label(path: string) {
  const help = helpFor(path);
  if (help.label) return help.label;
  const last = parse(path).at(-1) ?? path;
  return /^\d+$/.test(last) ? `Item ${Number(last) + 1}` : prettify(last);
}

function Field({
  path,
  value,
  original,
  onChange,
}: {
  path: string;
  value: string | number | boolean;
  original: Json;
  onChange: (path: string, value: Json) => void;
}) {
  const help = helpFor(path);
  const dirty = value !== original;

  const shared =
    "w-full rounded-md border bg-[#14170F] px-3 py-2 font-mono text-[13px] text-[#F2F4EE] outline-none transition-colors focus:border-[#9BE07A] " +
    (dirty ? "border-[#DDBE5B]" : "border-[#2F352A]");

  if (typeof value === "boolean") {
    return (
      <label className="flex items-center gap-3 py-1">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(path, e.target.checked)}
          className="h-4 w-4 accent-[#9BE07A]"
        />
        <span className="text-[13px] text-[#F2F4EE]">{label(path)}</span>
        {dirty && <span className="text-[10px] text-[#DDBE5B]">changed</span>}
      </label>
    );
  }

  const multiline = help.multiline || (typeof value === "string" && value.length > 90);

  return (
    <div className="py-1">
      <div className="mb-1.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <span className="text-[13px] font-medium text-[#F2F4EE]">{label(path)}</span>
        {dirty && (
          <button
            type="button"
            onClick={() => onChange(path, original)}
            className="rounded-full border border-[#DDBE5B] px-2 py-0.5 font-mono text-[10px] text-[#DDBE5B] hover:bg-[#DDBE5B] hover:text-[#14170F]"
          >
            changed · undo
          </button>
        )}
        <code className="ml-auto font-mono text-[10px] text-[#6E7468]">{path}</code>
      </div>

      {help.hint && <p className="mb-1.5 text-[12px] leading-snug text-[#A5AA9E]">{help.hint}</p>}

      {typeof value === "number" ? (
        <input
          type="number"
          step="0.01"
          value={value}
          onChange={(e) => onChange(path, e.target.value === "" ? 0 : Number(e.target.value))}
          className={`${shared} max-w-[10rem]`}
        />
      ) : multiline ? (
        <>
          <textarea
            value={value}
            rows={Math.min(10, Math.ceil(String(value).length / 78) + 1)}
            onChange={(e) => onChange(path, e.target.value)}
            className={`${shared} resize-y leading-relaxed`}
          />
          <p className="mt-1 text-right font-mono text-[10px] text-[#6E7468]">
            {String(value).length} chars
          </p>
        </>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(path, e.target.value)}
          className={shared}
        />
      )}
    </div>
  );
}

/** Recursively render an object/array subtree. */
function Node({
  path,
  value,
  original,
  onChange,
  onListChange,
  depth = 0,
}: {
  path: string;
  value: Json;
  original: Json;
  onChange: (path: string, value: Json) => void;
  onListChange: (path: string, next: Json[]) => void;
  depth?: number;
}) {
  if (value === null) return null;

  if (typeof value !== "object") {
    return <Field path={path} value={value} original={original} onChange={onChange} />;
  }

  if (Array.isArray(value)) {
    const primitives = value.every((v) => typeof v !== "object" || v === null);
    const help = helpFor(path);

    if (primitives) {
      return (
        <div className="py-1">
          <div className="mb-1.5 flex flex-wrap items-baseline gap-x-2.5">
            <span className="text-[13px] font-medium text-[#F2F4EE]">{label(path)}</span>
            <code className="ml-auto font-mono text-[10px] text-[#6E7468]">{path}</code>
          </div>
          {help.hint && (
            <p className="mb-1.5 text-[12px] leading-snug text-[#A5AA9E]">{help.hint}</p>
          )}
          <div className="flex flex-col gap-1.5">
            {value.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-5 shrink-0 pt-2.5 text-right font-mono text-[10px] text-[#6E7468]">
                  {i + 1}
                </span>
                {help.multiline || String(item).length > 90 ? (
                  <textarea
                    value={String(item)}
                    rows={Math.min(6, Math.ceil(String(item).length / 78) + 1)}
                    onChange={(e) => {
                      const next = [...value];
                      next[i] = e.target.value;
                      onListChange(path, next);
                    }}
                    className={`w-full resize-y rounded-md border bg-[#14170F] px-3 py-2 font-mono text-[13px] leading-relaxed text-[#F2F4EE] outline-none focus:border-[#9BE07A] ${
                      (original as Json[])?.[i] !== item ? "border-[#DDBE5B]" : "border-[#2F352A]"
                    }`}
                  />
                ) : (
                  <input
                    value={String(item)}
                    onChange={(e) => {
                      const next = [...value];
                      next[i] = e.target.value;
                      onListChange(path, next);
                    }}
                    className={`w-full rounded-md border bg-[#14170F] px-3 py-2 font-mono text-[13px] text-[#F2F4EE] outline-none focus:border-[#9BE07A] ${
                      (original as Json[])?.[i] !== item ? "border-[#DDBE5B]" : "border-[#2F352A]"
                    }`}
                  />
                )}
                <button
                  type="button"
                  title="Remove"
                  onClick={() =>
                    onListChange(
                      path,
                      value.filter((_, j) => j !== i)
                    )
                  }
                  className="mt-1 shrink-0 rounded-md border border-[#2F352A] px-2 py-1.5 font-mono text-[11px] text-[#A5AA9E] hover:border-[#E5484D] hover:text-[#E5484D]"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => onListChange(path, [...value, ""])}
              className="self-start rounded-md border border-dashed border-[#2F352A] px-3 py-1.5 font-mono text-[11px] text-[#A5AA9E] hover:border-[#9BE07A] hover:text-[#9BE07A]"
            >
              + add
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3">
        {value.map((item, i) => {
          const record = item as Record<string, Json>;
          const heading =
            record.org ?? record.name ?? record.title ?? record.label ?? `Item ${i + 1}`;
          return (
            <details
              key={i}
              open={depth === 0 && value.length <= 6}
              className="rounded-lg border border-[#2F352A] bg-[#1D211A]"
            >
              <summary className="cursor-pointer select-none px-4 py-3 font-mono text-[12px] text-[#9BE07A]">
                {String(heading)}
              </summary>
              <div className="flex flex-col gap-3 border-t border-[#2F352A] px-4 py-4">
                <Node
                  path={`${path}.${i}`}
                  value={item}
                  original={(original as Json[])?.[i] ?? null}
                  onChange={onChange}
                  onListChange={onListChange}
                  depth={depth + 1}
                />
              </div>
            </details>
          );
        })}
      </div>
    );
  }

  const entries = Object.entries(value);
  return (
    <div className={depth === 0 ? "flex flex-col gap-4" : "flex flex-col gap-3"}>
      {entries.map(([key, child]) => {
        const childPath = path ? `${path}.${key}` : key;
        const childOriginal =
          original && typeof original === "object" && !Array.isArray(original)
            ? (original as Record<string, Json>)[key]
            : null;
        // Arrays draw their own heading, so only plain objects get a fieldset.
        const isNestedObject = child !== null && typeof child === "object" && !Array.isArray(child);

        if (isNestedObject && depth > 0) {
          return (
            <fieldset key={key} className="rounded-lg border border-[#2F352A] px-4 pb-3 pt-2">
              <legend className="px-1.5 font-mono text-[11px] text-[#A5AA9E]">
                {prettify(key)}
              </legend>
              <Node
                path={childPath}
                value={child}
                original={childOriginal ?? null}
                onChange={onChange}
                onListChange={onListChange}
                depth={depth + 1}
              />
            </fieldset>
          );
        }

        return (
          <Node
            key={key}
            path={childPath}
            value={child}
            original={childOriginal ?? null}
            onChange={onChange}
            onListChange={onListChange}
            depth={depth + 1}
          />
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------------- studio */

export function StudioClient({
  initial,
  initialVersion,
}: {
  initial: Json;
  initialVersion: string;
}) {
  const [data, setData] = useState<Json>(initial);
  const [saved, setSaved] = useState<Json>(initial);
  // The file hash this tab is based on; a save that doesn't quote the current
  // one is rejected rather than allowed to clobber newer content.
  const [version, setVersion] = useState(initialVersion);
  const [stale, setStale] = useState(false);
  const [active, setActive] = useState(GROUPS[0].key);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onChange = useCallback((path: string, value: Json) => {
    setData((prev) => setAt(prev, path, value));
  }, []);
  const onListChange = useCallback((path: string, next: Json[]) => {
    setData((prev) => setAt(prev, path, next));
  }, []);

  const dirtyPaths = useMemo(() => {
    const now = flatten(data);
    const before = new Map(flatten(saved).map((l) => [l.path, l.value]));
    // A changed list length shows up as added/removed paths, which counts too.
    const changed = now.filter((l) => before.get(l.path) !== l.value);
    return changed.map((l) => l.path);
  }, [data, saved]);

  const dirtyByGroup = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const path of dirtyPaths) {
      const group = path.split(".")[0];
      counts[group] = (counts[group] ?? 0) + 1;
    }
    return counts;
  }, [dirtyPaths]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return flatten(data).filter(
      (leaf) =>
        leaf.path.toLowerCase().includes(q) ||
        String(leaf.value).toLowerCase().includes(q) ||
        label(leaf.path).toLowerCase().includes(q)
    );
  }, [query, data]);

  // Warn before losing edits on reload.
  useEffect(() => {
    if (dirtyPaths.length === 0) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirtyPaths.length]);

  const save = useCallback(async () => {
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/studio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ copy: data, version }),
      });
      const body = (await res.json()) as { message?: string; version?: string };
      if (res.status === 409) {
        setStale(true);
        throw new Error(body.message ?? "This tab is out of date.");
      }
      if (!res.ok) throw new Error(body.message ?? "Save failed.");
      setSaved(data);
      if (body.version) setVersion(body.version);
      setStatus(`${body.message} — the site has already picked it up.`);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }, [data, version]);

  // Cmd/Ctrl+S saves.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save]);

  const restore = async () => {
    if (!confirm("Restore the previous save? Anything unsaved here is lost.")) return;
    setBusy(true);
    const res = await fetch("/api/studio", { method: "POST" });
    const body = (await res.json()) as { message?: string; copy?: Json; version?: string };
    setStatus(body.message ?? null);
    if (res.ok && body.copy && body.version) {
      setData(body.copy);
      setSaved(body.copy);
      setVersion(body.version);
      setStale(false);
    }
    setBusy(false);
  };

  const group = GROUPS.find((g) => g.key === active) ?? GROUPS[0];

  return (
    <div className="min-h-screen bg-[#14170F] text-[#F2F4EE]">
      {/* header */}
      <header className="sticky top-0 z-10 border-b border-[#2F352A] bg-[#14170F]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-4 gap-y-3 px-6 py-4">
          <div>
            <h1 className="m-0 text-[15px] font-semibold">Copy studio</h1>
            <p className="m-0 font-mono text-[11px] text-[#6E7468]">content/site-copy.json</p>
          </div>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all text…"
            className="ml-2 w-56 rounded-md border border-[#2F352A] bg-[#1D211A] px-3 py-2 font-mono text-[12px] outline-none focus:border-[#9BE07A]"
          />

          <div className="ml-auto flex flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] text-[#A5AA9E]">
              {dirtyPaths.length === 0
                ? "no unsaved changes"
                : `${dirtyPaths.length} unsaved change${dirtyPaths.length === 1 ? "" : "s"}`}
            </span>
            <button
              type="button"
              onClick={() => setData(saved)}
              disabled={dirtyPaths.length === 0 || busy}
              className="rounded-full border border-[#2F352A] px-4 py-2 text-[12px] font-semibold disabled:opacity-40"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={restore}
              disabled={busy}
              className="rounded-full border border-[#2F352A] px-4 py-2 text-[12px] font-semibold disabled:opacity-40"
            >
              Undo last save
            </button>
            <button
              type="button"
              onClick={save}
              disabled={dirtyPaths.length === 0 || busy}
              className="rounded-full bg-[#9BE07A] px-5 py-2 text-[12px] font-semibold text-[#14170F] disabled:opacity-40"
            >
              {busy ? "Saving…" : "Save to file"}
            </button>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[11px] text-[#9BE07A] underline underline-offset-4"
            >
              open site ↗
            </a>
          </div>

          {status && (
            <p
              role="status"
              className={`basis-full font-mono text-[11px] ${stale ? "text-[#DDBE5B]" : "text-[#9BE07A]"}`}
            >
              {status}{" "}
              {stale && (
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="underline underline-offset-4"
                >
                  Reload now
                </button>
              )}
            </p>
          )}
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-6 py-8 lg:flex-row">
        {/* group nav */}
        <nav className="lg:sticky lg:top-[104px] lg:h-fit lg:w-64 lg:shrink-0">
          <ul className="m-0 flex list-none flex-wrap gap-1 p-0 lg:flex-col">
            {GROUPS.map((g) => (
              <li key={g.key}>
                <button
                  type="button"
                  onClick={() => {
                    setActive(g.key);
                    setQuery("");
                  }}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] ${
                    active === g.key && !query
                      ? "bg-[#1D211A] text-[#9BE07A]"
                      : "text-[#A5AA9E] hover:bg-[#1D211A]"
                  }`}
                >
                  {g.title}
                  {dirtyByGroup[g.key] ? (
                    <span className="ml-auto rounded-full bg-[#DDBE5B] px-1.5 font-mono text-[10px] text-[#14170F]">
                      {dirtyByGroup[g.key]}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* fields */}
        <main className="min-w-0 flex-1">
          {results ? (
            <>
              <h2 className="m-0 mb-1 text-[17px] font-semibold">
                {results.length} match{results.length === 1 ? "" : "es"}
              </h2>
              <p className="mb-6 text-[13px] text-[#A5AA9E]">
                Editing across every section. Clear the search to go back to groups.
              </p>
              <div className="flex flex-col gap-4">
                {results.map((leaf) => (
                  <Field
                    key={leaf.path}
                    path={leaf.path}
                    value={leaf.value}
                    original={getAt(saved, leaf.path)}
                    onChange={onChange}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className="m-0 mb-1 text-[17px] font-semibold">{group.title}</h2>
              <p className="mb-6 text-[13px] text-[#A5AA9E]">{group.blurb}</p>
              <Node
                path={group.key}
                value={getAt(data, group.key)}
                original={getAt(saved, group.key)}
                onChange={onChange}
                onListChange={onListChange}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
