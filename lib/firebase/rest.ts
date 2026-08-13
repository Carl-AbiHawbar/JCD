import "server-only";

import { apiKey, projectId } from "./config";

/**
 * Minimal read-only Firestore client for server rendering.
 *
 * The browser SDK cannot run during SSR, and there is no Admin SDK in this
 * project, so public pages read through the REST API with the public web key.
 * Every request is therefore anonymous and subject to the same security rules
 * as a visitor — these helpers can only ever see documents the rules publish.
 */

const ROOT =
  `https://firestore.googleapis.com/v1/projects/${projectId}` +
  `/databases/(default)/documents`;

/** A dead or slow backend must never hang a page render. */
const TIMEOUT_MS = 6000;

type FirestoreValue = Record<string, unknown>;

/** Turns Firestore's tagged-union encoding into ordinary JavaScript. */
function decodeValue(value: FirestoreValue): unknown {
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return Number(value.doubleValue);
  if ("booleanValue" in value) return value.booleanValue;
  if ("timestampValue" in value) return value.timestampValue;
  if ("nullValue" in value) return null;
  if ("mapValue" in value) {
    const fields = (value.mapValue as { fields?: Record<string, FirestoreValue> })
      .fields;
    return decodeFields(fields ?? {});
  }
  if ("arrayValue" in value) {
    const values = (value.arrayValue as { values?: FirestoreValue[] }).values;
    return (values ?? []).map(decodeValue);
  }
  return null;
}

function decodeFields(fields: Record<string, FirestoreValue>) {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    out[key] = decodeValue(value);
  }
  return out;
}

type RunQueryRow = {
  document?: { name: string; fields?: Record<string, FirestoreValue> };
};

/**
 * Reads every published document from a collection, ordered by `sortOrder`.
 * Returns an empty array on any failure so a page can still render.
 */
export async function listPublished<T>(
  collectionId: string,
  limit = 50,
): Promise<(T & { id: string })[]> {
  const body = {
    structuredQuery: {
      from: [{ collectionId }],
      where: {
        fieldFilter: {
          field: { fieldPath: "status" },
          op: "EQUAL",
          value: { stringValue: "published" },
        },
      },
      orderBy: [
        { field: { fieldPath: "sortOrder" }, direction: "ASCENDING" },
      ],
      limit,
    },
  };

  try {
    const response = await fetch(`${ROOT}:runQuery?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      // Content is editable in the dashboard, so never serve a cached copy.
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `Firestore ${collectionId} query failed: ${response.status}`,
        (await response.text()).slice(0, 200),
      );
      return [];
    }

    const rows = (await response.json()) as RunQueryRow[];
    return rows
      .filter((row) => row.document)
      .map((row) => ({
        id: row.document!.name.split("/").pop() as string,
        ...(decodeFields(row.document!.fields ?? {}) as T),
      }));
  } catch (cause) {
    console.error(`Firestore ${collectionId} query error:`, cause);
    return [];
  }
}

/** Reads one document by path, or null if it is missing or unreadable. */
export async function getDocument<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${ROOT}/${path}?key=${apiKey}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!response.ok) return null;
    const doc = (await response.json()) as {
      fields?: Record<string, FirestoreValue>;
    };
    return decodeFields(doc.fields ?? {}) as T;
  } catch {
    return null;
  }
}
