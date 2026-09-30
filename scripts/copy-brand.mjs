// Copies the brand assets from the gateway repository into public/brand/.
// The gateway repo is the single source of truth; never edit the copies.
// Location of the gateway: $YOON_APP_DIR (default ../yoon-app).
import { copyFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const yoonAppDir = resolve(process.env.YOON_APP_DIR ?? "../yoon-app");
const outDir = resolve("public/brand");

const files = ["logo.svg", "logo-dark.svg", "mark.svg", "icon.svg", "social-preview.png"];

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
      `[copy-brand] The website reads them from the gateway repository; set YOON_APP_DIR to its\n` +
      `[copy-brand] location (default ../yoon-app) and make sure it is checked out.\n\n` +
      String(missing?.message ?? missing),
  );
  process.exit(1);
}
console.log(
  `[copy-brand] Copied ${files.length} brand assets from ${yoonAppDir}/docs/assets into public/brand/`,
);
