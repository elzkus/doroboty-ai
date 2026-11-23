import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { lstat, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = join(root, "dist");
const manifestPath = join(dist, "release-manifest.json");
const manifestName = "release-manifest.json";
const storageSchemaVersion = 1;
const budgets = {
  initialGzipBytes: 256 * 1024,
  totalGzipBytes: 12 * 1024 * 1024,
  largestJavaScriptBytes: 512 * 1024,
};

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function filesUnder(directory, base = directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await filesUnder(path, base)));
    else if (entry.isFile()) files.push(relative(base, path));
    else throw new Error(`Unsupported artifact entry: ${relative(base, path)}`);
  }
  return files.sort();
}

async function artifactSnapshot() {
  await stat(join(dist, "index.html"));
  const files = (await filesUnder(dist)).filter((file) => file !== manifestName);
  if (files.length === 0) throw new Error("The release artifact is empty.");

  const tree = createHash("sha256");
  const records = [];
  for (const path of files) {
    const bytes = await readFile(join(dist, path));
    const record = {
      path,
      bytes: bytes.byteLength,
      gzipBytes: gzipSync(bytes, { level: 9 }).byteLength,
      sha256: sha256(bytes),
    };
    records.push(record);
    tree.update(path);
    tree.update("\0");
    tree.update(bytes);
    tree.update("\0");
  }

  const html = await readFile(join(dist, "index.html"), "utf8");
  const entrypoints = [...html.matchAll(/(?:src|href)="\.\/(assets\/[^"#?]+)"/g)].map(
    ([, path]) => path,
  );
  const entrypointSet = new Set(entrypoints);
  const initialGzipBytes = records
    .filter((record) => entrypointSet.has(record.path))
    .reduce((sum, record) => sum + record.gzipBytes, 0);
  const totalGzipBytes = records.reduce((sum, record) => sum + record.gzipBytes, 0);
  const largestJavaScriptBytes = Math.max(
    0,
    ...records.filter((record) => record.path.endsWith(".js")).map((record) => record.bytes),
  );

  return {
    sha256: tree.digest("hex"),
    files: records,
    entrypoints,
    measurements: { initialGzipBytes, totalGzipBytes, largestJavaScriptBytes },
  };
}

function git(args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

async function sourceSnapshot() {
  const names = execFileSync(
    "git",
    ["ls-files", "-z", "--cached", "--others", "--exclude-standard"],
    { cwd: root },
  )
    .toString("utf8")
    .split("\0")
    .filter(Boolean)
    .filter((path) => path !== "docs/production-readiness.html");
  const tree = createHash("sha256");
  for (const path of names.sort()) {
    const absolute = join(root, path);
    const metadata = await lstat(absolute);
    if (!metadata.isFile()) throw new Error(`Unsupported source entry: ${path}`);
    tree.update(path);
    tree.update("\0");
    tree.update(await readFile(absolute));
    tree.update("\0");
  }
  return {
    commit: git(["rev-parse", "HEAD"]),
    dirty: git(["status", "--porcelain", "--untracked-files=all"])
      .split("\n")
      .filter(Boolean)
      .some((line) => !line.endsWith(" docs/production-readiness.html")),
    treeSha256: tree.digest("hex"),
    packageLockSha256: sha256(await readFile(join(root, "package-lock.json"))),
  };
}

async function assertStorageSchema() {
  const model = await readFile(join(root, "src/features/prototype/model.ts"), "utf8");
  if (!new RegExp(`version:\\s*z\\.literal\\(${storageSchemaVersion}\\)`).test(model)) {
    throw new Error(
      `Expected persisted schema version ${storageSchemaVersion}. Review release and rollback compatibility.`,
    );
  }
}

function assertBudgets(measurements) {
  for (const [name, limit] of Object.entries(budgets)) {
    if (measurements[name] > limit) {
      throw new Error(
        `Release asset budget exceeded: ${name} is ${measurements[name]} bytes; limit is ${limit}.`,
      );
    }
  }
}

async function createManifest({ allowDirty }) {
  await assertStorageSchema();
  const source = await sourceSnapshot();
  if (source.dirty && !allowDirty) {
    throw new Error(
      "Refusing to prepare a publishable release from a dirty worktree. Commit or otherwise record the intended source first.",
    );
  }
  const artifact = await artifactSnapshot();
  assertBudgets(artifact.measurements);
  const manifest = {
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    source,
    artifact,
    compatibility: {
      storageKey: "doroboty.prototype.v1",
      storageSchemaVersion,
    },
    budgets,
    runtime: { node: process.version },
  };
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(
    `Release manifest created: ${artifact.files.length} files, artifact ${artifact.sha256.slice(0, 12)}, initial gzip ${artifact.measurements.initialGzipBytes} bytes.`,
  );
}

async function verifyManifest() {
  await assertStorageSchema();
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  if (manifest.schemaVersion !== 1) throw new Error("Unsupported release manifest version.");
  const [source, artifact] = await Promise.all([sourceSnapshot(), artifactSnapshot()]);
  for (const key of ["commit", "dirty", "treeSha256", "packageLockSha256"]) {
    if (manifest.source[key] !== source[key]) {
      throw new Error(`Release manifest source mismatch: ${key}.`);
    }
  }
  if (JSON.stringify(manifest.artifact) !== JSON.stringify(artifact)) {
    throw new Error("Release artifact bytes do not match the manifest.");
  }
  assertBudgets(artifact.measurements);
  console.log(
    `Release artifact verified: ${artifact.files.length} files, artifact ${artifact.sha256.slice(0, 12)}, storage schema ${storageSchemaVersion}.`,
  );
}

const command = process.argv[2];
if (command === "create") {
  await createManifest({ allowDirty: process.argv.includes("--allow-dirty") });
} else if (command === "verify") {
  await verifyManifest();
} else {
  throw new Error("Usage: release-artifact.mjs create [--allow-dirty] | verify");
}
