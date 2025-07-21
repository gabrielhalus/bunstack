import Sqlite from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { join } from "node:path";

import { __root } from "../constants/__root";
import env from "../lib/env";

import { schema } from "./schemas"

const queryClient = new Sqlite(join(__root, env.DATABASE_URL));

export const db = drizzle(queryClient, { schema });
