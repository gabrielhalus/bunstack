import Sqlite from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { join } from "node:path";

import { __root } from "../constants/__root";
import env from "../lib/env";

const sqlite = new Sqlite(join(__root, env.DATABASE_URL));
sqlite.exec("PRAGMA foreign_keys = ON");

export const db = drizzle(sqlite);
