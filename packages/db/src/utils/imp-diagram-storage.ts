// Copyright © Todd Agriscience, Inc. All rights reserved.

import { randomUUID } from 'node:crypto';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import {
  identifyImpDiagram,
  impDiagramNamePattern,
  MAX_IMP_DIAGRAM_BYTES,
} from './imp-diagram';

/** Explicit private-bucket configuration; no ambient credential/account discovery. */
export function impDiagramStorageConfig() {
  const bucket = process.env.IMP_DIAGRAM_BUCKET;
  const region = process.env.IMP_DIAGRAM_REGION;
  const accessKeyId = process.env.IMP_DIAGRAM_ACCESS_KEY_ID;
  const secretAccessKey = process.env.IMP_DIAGRAM_SECRET_ACCESS_KEY;
  const endpoint = process.env.IMP_DIAGRAM_ENDPOINT;
  const prefix = process.env.IMP_DIAGRAM_PREFIX ?? 'imp-diagrams';
  if (!bucket || !region || !accessKeyId || !secretAccessKey)
    throw new Error('IMP diagram storage is not configured.');
  if (
    !/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(bucket) ||
    !/^[a-zA-Z0-9/_-]+$/.test(prefix) ||
    prefix.includes('..') ||
    prefix.startsWith('/') ||
    prefix.endsWith('/')
  )
    throw new Error('Invalid IMP diagram bucket/prefix configuration.');
  if (endpoint) {
    const url = new URL(endpoint);
    const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    if (
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      (url.pathname !== '/' && url.pathname !== '') ||
      (url.protocol !== 'https:' && !(url.protocol === 'http:' && loopback))
    )
      throw new Error(
        'IMP diagram endpoint must use HTTPS (HTTP is allowed only on localhost).'
      );
  }
  return {
    bucket,
    prefix,
    client: new S3Client({
      region,
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: process.env.IMP_DIAGRAM_FORCE_PATH_STYLE === 'true',
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
      maxAttempts: 2,
    }),
  };
}

/** Stores a validated raster with a generated key in the configured private prefix. */
export async function putImpDiagram(bytes: Uint8Array): Promise<string> {
  const format = identifyImpDiagram(bytes);
  if (!format)
    throw new Error('Use a PNG, JPEG or WebP diagram no larger than 512 KiB.');
  const { bucket, prefix, client } = impDiagramStorageConfig();
  const name = `${randomUUID()}.${format.extension}`;
  try {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: `${prefix}/${name}`,
        Body: bytes,
        ContentType: format.contentType,
      }),
      { abortSignal: AbortSignal.timeout(10000) }
    );
    return name;
  } finally {
    client.destroy();
  }
}

/** Reads a bounded validated image; callers must authorize before fetching storage. */
export async function getImpDiagram(
  name: string
): Promise<{ bytes: Uint8Array; contentType: string }> {
  if (!impDiagramNamePattern.test(name))
    throw new Error('Invalid IMP diagram name.');
  const { bucket, prefix, client } = impDiagramStorageConfig();
  try {
    const object = await client.send(
      new GetObjectCommand({ Bucket: bucket, Key: `${prefix}/${name}` }),
      { abortSignal: AbortSignal.timeout(10000) }
    );
    if (
      !object.Body ||
      !object.ContentLength ||
      object.ContentLength > MAX_IMP_DIAGRAM_BYTES
    )
      throw new Error('Invalid IMP diagram size.');
    const bytes = await object.Body.transformToByteArray();
    const format = identifyImpDiagram(bytes);
    if (!format || name.split('.').at(-1) !== format.extension)
      throw new Error('Invalid IMP diagram format.');
    return { bytes, contentType: format.contentType };
  } finally {
    client.destroy();
  }
}
