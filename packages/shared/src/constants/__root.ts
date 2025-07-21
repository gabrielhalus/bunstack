import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

let cachedRoot: string | undefined;

/**
 * Walks up from the compiled output (`packages/shared/dist/...`) to find
 * the monorepo root (where `.git` or a root `package.json` with `"private": true` exists).
 */
export const __root = (() => {
  if (cachedRoot)
    return cachedRoot;

  let current = dirname(fileURLToPath(import.meta.url));

  // Ensure we walk past `/packages/shared/dist/constants/__root.js` up to `/`
  for (let i = 0; i < 10; i++) {
    const git = join(current, ".git");
    const pkg = join(current, "package.json");

    if (existsSync(git))
      return (cachedRoot = current);

    if (existsSync(pkg)) {
      try {
        const json = JSON.parse(readFileSync(pkg, "utf8"));
        if (json.private === true)
          return (cachedRoot = current);
      } catch {}
    }

    const parent = dirname(current);
    if (parent === current)
      break;
    current = parent;
  }

  throw new Error("Monorepo root not found from shared package.");
})();
