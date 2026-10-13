/**
 * Uploads a local folder to the R2 bucket, keeping relative paths as object keys.
 *
 *   npx tsx scripts/upload-assets.ts <folder>
 *
 * Reads R2_* settings from the environment (or backend/.env). Only keys under the public
 * prefixes served by GET /assets/* are uploaded.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, relative, resolve, sep } from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { contentTypeFor, isPublicAssetKey } from "../src/assets.js";
import { env } from "../src/env.js";

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (entry.isFile()) yield path;
  }
}

async function main() {
  const folder = process.argv[2];
  if (!folder) throw new Error("Usage: tsx scripts/upload-assets.ts <folder>");
  if (!env.R2_ACCOUNT_ID || !env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY || !env.R2_BUCKET) {
    throw new Error("R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and R2_BUCKET must be set");
  }

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY },
  });

  const root = resolve(folder);
  let uploaded = 0;
  for await (const path of walk(root)) {
    const key = relative(root, path).split(sep).join("/");
    if (!isPublicAssetKey(key)) {
      console.warn(`skip   ${key} (not under a public prefix)`);
      continue;
    }
    const body = await readFile(path);
    await client.send(
      new PutObjectCommand({
        Bucket: env.R2_BUCKET,
        Key: key,
        Body: body,
        ContentType: contentTypeFor(key),
        CacheControl: "public, max-age=86400",
      }),
    );
    uploaded++;
    console.log(`upload ${key} (${(body.length / 1024).toFixed(0)} KB)`);
  }
  console.log(`Done: ${uploaded} objects uploaded to r2://${env.R2_BUCKET}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
