import { __root } from "@bunstack/shared/constants/__root";
import { env } from "@bunstack/shared/lib/env";
import Sqlite from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { join } from "node:path";

const sqlite = new Sqlite(join(__root, env.DATABASE_URL));
sqlite.run("PRAGMA foreign_keys = ON");

export const db = drizzle(sqlite);
