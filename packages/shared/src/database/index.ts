import "dotenv/config";
import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";

import { env } from "@bunstack/shared/lib/env";

const client = new SQL(env.DATABASE_URL);
export const db = drizzle({ client });
