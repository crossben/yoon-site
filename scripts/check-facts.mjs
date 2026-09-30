// Fact-drift guard. Every factual claim on the website must still be backed by the
// gateway repository (website/PLAN.md §0 and §4). For each fact we assert that a key
// string still appears in its source file. When the repository changes and a fact no
// longer holds, this fails the build until website/content/facts.ts is updated.
// That is intended.
//
// Reads the gateway snapshot in gateway/ (scripts/gateway.mjs); `npm run sync:gateway` refreshes it.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { REQUIRED_STRINGS, SNAPSHOT_DIR } from "./gateway.mjs";

const yoonAppDir = SNAPSHOT_DIR;

const problems = [];

for (const [file, strings] of Object.entries(REQUIRED_STRINGS)) {
  let content;
  try {
    content = readFileSync(join(yoonAppDir, file), "utf8");
  } catch {
    problems.push(
      `  ${file}: cannot read it. Run \`npm run sync:gateway\` to refresh the snapshot in ${yoonAppDir}.`,
    );
    continue;
  }
  for (const s of strings) {
    if (!content.includes(s)) {
      problems.push(
        `  ${file}: expected to contain ${JSON.stringify(s.length > 72 ? s.slice(0, 69) + "..." : s)}`,
      );
    }
  }
}

if (problems.length > 0) {
  console.error(
    `\n[check-facts] The website makes claims the gateway repository no longer backs up:\n` +
      problems.join("\n") +
      `\n\n[check-facts] Update website/content/facts.ts (and the copy that cites it) to match the\n` +
      `[check-facts] sources in ${yoonAppDir}. Never edit the gateway repository from here.\n`,
  );
  process.exit(1);
}
console.log(
  `[check-facts] All ${Object.keys(REQUIRED_STRINGS).length} source files still back every claim on the site.`,
);
