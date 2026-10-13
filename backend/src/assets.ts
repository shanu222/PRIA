import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { Readable } from "node:stream";
import { GetObjectCommand, S3Client, S3ServiceException } from "@aws-sdk/client-s3";
import { env } from "./env.js";

/** Only these key prefixes are publicly readable; everything else in the bucket stays private. */
export const PUBLIC_ASSET_PREFIXES = ["drim/", "brand/"] as const;

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".json": "application/json; charset=utf-8",
};

export type Asset = {
  body: ReadableStream;
  contentType: string;
  contentLength?: number;
  etag?: string;
  lastModified?: Date;
};

export function isPublicAssetKey(key: string): boolean {
  if (!key || key.includes("..") || key.includes("\\") || key.startsWith("/")) return false;
  if (!/^[a-z0-9][a-z0-9/_.-]*$/i.test(key)) return false;
  return PUBLIC_ASSET_PREFIXES.some((p) => key.startsWith(p));
}

export function contentTypeFor(key: string): string {
  return CONTENT_TYPES[extname(key).toLowerCase()] ?? "application/octet-stream";
}

interface AssetSource {
  get(key: string, ifNoneMatch?: string): Promise<Asset | "not-modified" | null>;
}

class R2Assets implements AssetSource {
  private client = new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: env.R2_ACCESS_KEY_ID!, secretAccessKey: env.R2_SECRET_ACCESS_KEY! },
  });

  async get(key: string, ifNoneMatch?: string) {
    try {
      const res = await this.client.send(
        new GetObjectCommand({ Bucket: env.R2_BUCKET, Key: key, IfNoneMatch: ifNoneMatch }),
      );
      if (!res.Body) return null;
      return {
        body: res.Body.transformToWebStream(),
        contentType: res.ContentType && res.ContentType !== "application/octet-stream" ? res.ContentType : contentTypeFor(key),
        contentLength: res.ContentLength,
        etag: res.ETag,
        lastModified: res.LastModified,
      };
    } catch (error) {
      if (error instanceof S3ServiceException) {
        if (error.$metadata.httpStatusCode === 304) return "not-modified" as const;
        if (error.name === "NoSuchKey" || error.$metadata.httpStatusCode === 404) return null;
      }
      throw error;
    }
  }
}

/** Development fallback: serves files from ASSETS_DIR using the same keys as the bucket. */
class FileAssets implements AssetSource {
  private root = resolve(env.ASSETS_DIR);

  async get(key: string) {
    const path = resolve(this.root, key);
    if (!path.startsWith(this.root + sep)) return null;
    try {
      const info = await stat(path);
      if (!info.isFile()) return null;
      return {
        body: Readable.toWeb(createReadStream(path)) as ReadableStream,
        contentType: contentTypeFor(key),
        contentLength: info.size,
        lastModified: info.mtime,
      };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
  }
}

export const assets: AssetSource = env.STORAGE_DRIVER === "r2" ? new R2Assets() : new FileAssets();
