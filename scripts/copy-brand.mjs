// Copies the brand assets from the gateway repository into public/brand/.
// The gateway repo is the single source of truth; never edit the copies.
// Reads the gateway snapshot in gateway/ (scripts/gateway.mjs).
import { copyFileSync, mkdirSync } from "node:fs";
import { BRAND_FILES, SNAPSHOT_DIR } from "./gateway.mjs";
import { join, resolve } from "node:path";

const yoonAppDir = SNAPSHOT_DIR;
const outDir = resolve("public/brand");

const files = BRAND_FILES;

let missing;
try {
  mkdirSync(outDir, { recursive: true });
  for (const file of files) copyFileSync(join(yoonAppDir, "docs/assets", file), join(outDir, file));
} catch (error) {
  missing = error;
}
if (missing) {
  console.error(
    `\n[copy-brand] Could not copy brand assets from ${join(yoonAppDir, "docs/assets")}.\n` +
      `[copy-brand] They come from the gateway snapshot: run \`npm run sync:gateway\`.\n\n` +
      String(missing?.message ?? missing),
  );
  process.exit(1);
}
console.log(
  `[copy-brand] Copied ${files.length} brand assets from ${yoonAppDir}/docs/assets into public/brand/`,
);
