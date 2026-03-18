// Copyright © Todd Agriscience, Inc. All rights reserved.

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { knowledgeArticle, seedProduct } from '../src/schema';
import { getEmbedding } from '../src/utils/get-embedding';

const EMBEDDING_DIMENSIONS = 3072;

const localDatabaseUrl =
  process.env.LOCAL_DATABASE_HOST &&
  process.env.LOCAL_DATABASE_PORT &&
  process.env.LOCAL_DATABASE_USER &&
  process.env.LOCAL_DATABASE_DATABASE
    ? `postgresql://${encodeURIComponent(process.env.LOCAL_DATABASE_USER)}:${encodeURIComponent(process.env.LOCAL_DATABASE_PASSWORD ?? '')}@${process.env.LOCAL_DATABASE_HOST}:${process.env.LOCAL_DATABASE_PORT}/${process.env.LOCAL_DATABASE_DATABASE}`
    : process.env.DATABASE_URL;

/**
 * Creates a deterministic fallback embedding so local product creation still
 * works when an embeddings API key is unavailable.
 */
function createDeterministicEmbedding(seedText: string): number[] {
  let seed = 0;

  for (let i = 0; i < seedText.length; i += 1) {
    seed = (seed * 31 + seedText.charCodeAt(i)) >>> 0;
  }

  const values = new Array<number>(EMBEDDING_DIMENSIONS);
  let state = seed || 1;

  for (let i = 0; i < EMBEDDING_DIMENSIONS; i += 1) {
    state = (1664525 * state + 1013904223) >>> 0;
    values[i] = state / 0xffffffff;
  }

  return values;
}

/**
 * Reads `--key value` arguments from the current CLI invocation.
 */
function getCliArg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);

  if (index === -1) {
    return undefined;
  }

  return process.argv[index + 1];
}

/**
 * Parses a positive integer argument and throws on invalid input.
 */
function getRequiredIntegerArg(name: string): number {
  const value = Number(getCliArg(name));

  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`--${name} must be a non-negative integer.`);
  }

  return value;
}

async function createEmbedding(text: string): Promise<number[]> {
  if (!process.env.OPENAI_EMBEDDINGS_KEY) {
    return createDeterministicEmbedding(text);
  }

  return getEmbedding(text);
}

/** Adds a seed product to the local development database. */
async function addSeedProduct() {
  if (!localDatabaseUrl) {
    throw new Error(
      'Local database configuration is missing. Set LOCAL_DATABASE_* or DATABASE_URL.'
    );
  }

  const name = getCliArg('name')?.trim();
  const slug = getCliArg('slug')?.trim();
  const description = getCliArg('description')?.trim();
  const stock = getRequiredIntegerArg('stock');
  const priceInCents = getRequiredIntegerArg('price-in-cents');
  const unit = getCliArg('unit')?.trim() || 'lb';
  const imageUrl = getCliArg('image-url')?.trim();
  const advisorContactUrl =
    getCliArg('advisor-contact-url')?.trim() || '/contact';
  const impKnowledgeArticleId = getCliArg('imp-article-id')
    ? getRequiredIntegerArg('imp-article-id')
    : undefined;

  if (!name || !slug || !description) {
    throw new Error(
      'Missing required arguments. Expected --name, --slug, and --description.'
    );
  }

  const db = drizzle(localDatabaseUrl, { casing: 'snake_case' });
  const embedding = await createEmbedding(`${name} ${description}`);

  const existingProduct = await db
    .select({ id: seedProduct.id })
    .from(seedProduct)
    .where(eq(seedProduct.slug, slug))
    .limit(1);

  if (existingProduct.length > 0) {
    throw new Error(`A seed product with slug "${slug}" already exists.`);
  }

  if (impKnowledgeArticleId !== undefined) {
    const relatedImp = await db
      .select({ id: knowledgeArticle.id })
      .from(knowledgeArticle)
      .where(eq(knowledgeArticle.id, impKnowledgeArticleId))
      .limit(1);

    if (relatedImp.length === 0) {
      throw new Error(
        `No IMP article exists with id "${impKnowledgeArticleId}".`
      );
    }
  }

  const [insertedProduct] = await db
    .insert(seedProduct)
    .values({
      name,
      slug,
      description,
      stock,
      priceInCents,
      unit,
      imageUrl,
      advisorContactUrl,
      impKnowledgeArticleId,
      embedding,
    })
    .returning({
      id: seedProduct.id,
      slug: seedProduct.slug,
    });

  console.log(
    `Inserted seed product #${insertedProduct.id} (${insertedProduct.slug}).`
  );
}

addSeedProduct().catch((error) => {
  console.error('Failed to add seed product:', error);
  process.exit(1);
});
