/**
 * Firebase web configuration.
 *
 * These values are public by design — Google documents the web API key as an
 * identifier, not a secret. All access control is enforced by the Firestore and
 * Storage security rules in this repository, never by hiding this config.
 *
 * They are inlined as defaults so a fresh deploy works without anyone having to
 * set environment variables first, which is where the previous stack kept
 * failing. Set NEXT_PUBLIC_FIREBASE_* to point a deployment at a different
 * project.
 */

export const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ??
    "AIzaSyDpY2QL9qDvM7Bl7PfgJw1GPxrcbK5U9_g",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "jcdorg-2f6c8.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "jcdorg-2f6c8",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    "jcdorg-2f6c8.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "383934956231",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ??
    "1:383934956231:web:09f82dd2532ade5ebef4e2",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "G-E8FDQZ4NPJ",
} as const;

export const projectId = firebaseConfig.projectId;
export const apiKey = firebaseConfig.apiKey;
