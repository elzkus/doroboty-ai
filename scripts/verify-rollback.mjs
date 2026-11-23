import { createHash } from "node:crypto";
import { cp, mkdtemp, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const distDir = new URL("../dist/", import.meta.url);
const modelFile = new URL("../src/features/prototype/model.ts", import.meta.url);

async function filesUnder(root, directory = root) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await filesUnder(root, path)));
    else if (entry.isFile()) files.push(relative(root, path));
    else throw new Error(`Unsupported artifact entry: ${relative(root, path)}`);
  }
  return files.sort();
}

async function digestTree(root) {
  const digest = createHash("sha256");
  const files = await filesUnder(root);
  if (files.length === 0) throw new Error("The release artifact is empty.");
  for (const file of files) {
    digest.update(file);
    digest.update("\0");
    digest.update(await readFile(join(root, file)));
    digest.update("\0");
  }
  return digest.digest("hex");
}

async function copyRelease(source, target) {
  await rm(target, { recursive: true, force: true });
  await cp(source, target, { recursive: true, errorOnExist: true });
}

const distPath = fileURLToPath(distDir);
await stat(join(distPath, "index.html"));
const modelSource = await readFile(modelFile, "utf8");
if (!/version:\s*z\.literal\(1\)/.test(modelSource)) {
  throw new Error(
    "The persisted-state schema is no longer version 1. Review data compatibility before enabling rollback.",
  );
}

const workspace = await mkdtemp(join(tmpdir(), "doroboty-rollback-"));
try {
  const releases = join(workspace, "releases");
  const knownGood = join(releases, "known-good");
  const candidate = join(releases, "candidate");
  const live = join(workspace, "live");
  const failed = join(workspace, "failed-candidate");
  const rollbackStage = join(workspace, "rollback-stage");

  await copyRelease(distPath, knownGood);
  const knownGoodDigest = await digestTree(knownGood);

  await copyRelease(distPath, candidate);
  await writeFile(
    join(candidate, "index.html"),
    "<!doctype html><title>simulated failed release</title>",
  );
  const candidateDigest = await digestTree(candidate);
  if (candidateDigest === knownGoodDigest) {
    throw new Error("The simulated candidate unexpectedly matches the known-good artifact.");
  }

  await copyRelease(candidate, live);
  if ((await digestTree(live)) !== candidateDigest) {
    throw new Error("The simulated candidate was not deployed intact.");
  }

  await copyRelease(knownGood, rollbackStage);
  if ((await digestTree(rollbackStage)) !== knownGoodDigest) {
    throw new Error("The staged rollback artifact does not match the recorded known-good digest.");
  }

  await rename(live, failed);
  try {
    await rename(rollbackStage, live);
  } catch (error) {
    await rename(failed, live);
    throw error;
  }

  const restoredDigest = await digestTree(live);
  if (restoredDigest !== knownGoodDigest) {
    throw new Error(
      "Rollback completed, but the live artifact differs from the known-good release.",
    );
  }
  if ((await readFile(join(live, "index.html"), "utf8")).length === 0) {
    throw new Error("The restored entry point is empty.");
  }

  console.log(
    `Rollback drill passed: simulated candidate ${candidateDigest.slice(0, 12)} was replaced by known-good artifact ${knownGoodDigest.slice(0, 12)}; persisted schema version 1 remains compatible.`,
  );
} finally {
  await rm(workspace, { recursive: true, force: true });
}
