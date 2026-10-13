import { existsSync } from "node:fs";
import { z } from "zod";

if (existsSync(".env")) process.loadEnvFile(".env");

const emptyToUndefined = (v: unknown) => (typeof v === "string" && v.trim() === "" ? undefined : v);
const optionalString = z.preprocess(emptyToUndefined, z.string().optional());

const schema = z
  .object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().int().positive().default(4000),

    ADMIN_API_KEY: z.preprocess(emptyToUndefined, z.string().min(24, "ADMIN_API_KEY must be at least 24 characters").optional()),
    CORS_ORIGINS: z.string().default("http://localhost:3000"),

    STORAGE_DRIVER: z.enum(["r2", "file"]).default("file"),
    DATA_FILE: z.string().default("./data/pria-content.json"),
    ASSETS_DIR: z.string().default("./data/assets"),
    CACHE_TTL_SECONDS: z.coerce.number().int().min(0).default(30),

    R2_ACCOUNT_ID: optionalString,
    R2_ACCESS_KEY_ID: optionalString,
    R2_SECRET_ACCESS_KEY: optionalString,
    R2_BUCKET: optionalString,
    R2_OBJECT_KEY: z.string().default("content/pria-content.json"),

    FRONTEND_REVALIDATE_URL: z.preprocess(emptyToUndefined, z.url().optional()),
    REVALIDATE_SECRET: optionalString,
  })
  .superRefine((env, ctx) => {
    if (env.STORAGE_DRIVER === "r2") {
      for (const key of ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET"] as const) {
        if (!env[key]) ctx.addIssue({ code: "custom", path: [key], message: `${key} is required when STORAGE_DRIVER=r2` });
      }
    }
    if (env.FRONTEND_REVALIDATE_URL && !env.REVALIDATE_SECRET) {
      ctx.addIssue({
        code: "custom",
        path: ["REVALIDATE_SECRET"],
        message: "REVALIDATE_SECRET is required when FRONTEND_REVALIDATE_URL is set",
      });
    }
  });

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid environment configuration:");
  for (const issue of parsed.error.issues) console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
  process.exit(1);
}

export const env = parsed.data;

export const corsOrigins = env.CORS_ORIGINS.split(",")
  .map((o) => o.trim())
  .filter(Boolean);
