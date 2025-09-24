/* eslint-disable node/no-process-env */
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["production", "development", "test"]),
  HOSTNAME: z.string().min(1, "HOSTNAME is required"),
  VITE_API_URL: z.string().min(1, "VITE_API_URL is required"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
});

/**
 * Walk upward from __dirname to find the first file matching a string or RegExp.
 * Stops at filesystem root.
 */
function findEnvFile(filenameOrPattern: string | RegExp): string | undefined {
  let dir = __dirname;
  while (true) {
    const files = fs.readdirSync(dir);
    const candidate = files.find(file =>
      typeof filenameOrPattern === "string"
        ? file === filenameOrPattern
        : filenameOrPattern.test(file),
    );
    if (candidate)
      return path.join(dir, candidate);

    const parent = path.dirname(dir);
    if (parent === dir)
      break; // reached root
    dir = parent;
  }
  return undefined;
}

const envPath = process.env.NODE_ENV === "test" ? findEnvFile(".env.test") : findEnvFile(/^\.env(?!.*\.(test|example)$).*/);
dotenv.config({ path: envPath });

export type Env = z.infer<typeof envSchema>;

const env = envSchema.parse(process.env);
// eslint-disable-next-line no-console
console.log(`📦 Loaded env file: ${envPath ? path.basename(envPath) : "none"}`);

export default env;
