"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

import { firebaseConfig } from "./config";

/**
 * Browser-side Firebase handles.
 *
 * Next re-executes modules across navigations and HMR, so the app is only
 * initialised once — calling initializeApp twice throws.
 */
function app() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function firebaseAuth(): Auth {
  return getAuth(app());
}

export function db(): Firestore {
  return getFirestore(app());
}

export function storage(): FirebaseStorage {
  return getStorage(app());
}

/**
 * Analytics only exists in the browser and only where the environment supports
 * it, so this resolves to null rather than throwing during SSR.
 */
export async function analytics() {
  if (typeof window === "undefined") return null;
  const { getAnalytics, isSupported } = await import("firebase/analytics");
  return (await isSupported()) ? getAnalytics(app()) : null;
}
