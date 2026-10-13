import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { GetObjectCommand, HeadBucketCommand, PutObjectCommand, S3Client, S3ServiceException } from "@aws-sdk/client-s3";
import { env } from "./env.js";
import { contentSchema, emptyDocument, type ContentDocument } from "./schema.js";

export interface ContentStore {
  readonly driver: string;
  read(): Promise<ContentDocument>;
  write(doc: ContentDocument): Promise<void>;
  check(): Promise<void>;
}

function parse(raw: string, source: string): ContentDocument {
  const result = contentSchema.safeParse(JSON.parse(raw));
  if (!result.success) {
    throw new Error(`Stored content in ${source} is invalid: ${result.error.message}`);
  }
  return result.data;
}

/** Cloudflare R2 through its S3-compatible API. */
class R2Store implements ContentStore {
  readonly driver = "r2";
  private client = new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: env.R2_ACCESS_KEY_ID!, secretAccessKey: env.R2_SECRET_ACCESS_KEY! },
  });

  async read(): Promise<ContentDocument> {
    try {
      const res = await this.client.send(new GetObjectCommand({ Bucket: env.R2_BUCKET, Key: env.R2_OBJECT_KEY }));
      const body = await res.Body?.transformToString("utf-8");
      return body ? parse(body, `r2://${env.R2_BUCKET}/${env.R2_OBJECT_KEY}`) : emptyDocument();
    } catch (error) {
      if (error instanceof S3ServiceException && (error.name === "NoSuchKey" || error.$metadata.httpStatusCode === 404)) {
        return emptyDocument();
      }
      throw error;
    }
  }

  async write(doc: ContentDocument): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: env.R2_BUCKET,
        Key: env.R2_OBJECT_KEY,
        Body: JSON.stringify(doc, null, 2),
        ContentType: "application/json; charset=utf-8",
      }),
    );
  }

  async check(): Promise<void> {
    await this.client.send(new HeadBucketCommand({ Bucket: env.R2_BUCKET }));
  }
}

/** Local JSON file. Development only: Railway's filesystem is wiped on every deploy. */
class FileStore implements ContentStore {
  readonly driver = "file";
  private path = resolve(env.DATA_FILE);

  async read(): Promise<ContentDocument> {
    try {
      return parse(await readFile(this.path, "utf-8"), this.path);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return emptyDocument();
      throw error;
    }
  }

  async write(doc: ContentDocument): Promise<void> {
    await mkdir(dirname(this.path), { recursive: true });
    const tmp = `${this.path}.tmp`;
    await writeFile(tmp, JSON.stringify(doc, null, 2), "utf-8");
    await rename(tmp, this.path);
  }

  async check(): Promise<void> {
    await mkdir(dirname(this.path), { recursive: true });
  }
}

/** Short-lived in-memory cache in front of the store so public reads don't hit R2 every time. */
class CachedStore implements ContentStore {
  private cached?: { doc: ContentDocument; at: number };
  private queue: Promise<unknown> = Promise.resolve();

  constructor(private inner: ContentStore, private ttlMs: number) {}

  get driver() {
    return this.inner.driver;
  }

  async read(): Promise<ContentDocument> {
    if (this.cached && Date.now() - this.cached.at < this.ttlMs) return structuredClone(this.cached.doc);
    const doc = await this.inner.read();
    this.cached = { doc, at: Date.now() };
    return structuredClone(doc);
  }

  async write(doc: ContentDocument): Promise<void> {
    await this.inner.write(doc);
    this.cached = { doc: structuredClone(doc), at: Date.now() };
  }

  /** Serialises read-modify-write updates within this instance. */
  update(mutate: (doc: ContentDocument) => ContentDocument | void): Promise<ContentDocument> {
    const run = this.queue.then(async () => {
      this.cached = undefined;
      const doc = await this.read();
      const next = mutate(doc) ?? doc;
      next.updatedAt = new Date().toISOString();
      await this.write(next);
      return next;
    });
    this.queue = run.catch(() => undefined);
    return run;
  }

  check(): Promise<void> {
    return this.inner.check();
  }
}

export const store = new CachedStore(
  env.STORAGE_DRIVER === "r2" ? new R2Store() : new FileStore(),
  env.CACHE_TTL_SECONDS * 1000,
);
