"use client";

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { resolveLoginIdentifier } from "./accounts";
import { db, firebaseAuth } from "./client";

/**
 * Admin session.
 *
 * Being signed in is not enough: the account must also have a document in the
 * `admins` collection. That collection is not writable by any client, so admin
 * rights can only be granted from the Firebase console — which is what the
 * Firestore rules key every privileged read and write off.
 */

type AuthState = {
  user: User | null;
  isAdmin: boolean;
  /** True until the first auth state resolves, so guards don't flash. */
  loading: boolean;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth(), async (next) => {
      setUser(next);
      if (!next) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db(), "admins", next.uid));
        setIsAdmin(snap.exists());
      } catch {
        // A rules denial here simply means "not an admin".
        setIsAdmin(false);
      }
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      isAdmin,
      loading,
      async signInWithPassword(email, password) {
        // The admin types a username; everyone else types their email.
        await signInWithEmailAndPassword(
          firebaseAuth(),
          resolveLoginIdentifier(email),
          password,
        );
      },
      async signInWithGoogle() {
        await signInWithPopup(firebaseAuth(), new GoogleAuthProvider());
      },
      async signOut() {
        await fbSignOut(firebaseAuth());
      },
    }),
    [user, isAdmin, loading],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside <AuthProvider>");
  return value;
}
