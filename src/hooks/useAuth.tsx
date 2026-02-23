import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

// Super admin email — this user is always granted admin access automatically
const SUPER_ADMIN_EMAIL = "jiveshpatil0@gmail.com";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdmin = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    setIsAdmin(!!data);
  };

  useEffect(() => {
    let isMounted = true;

    const ensureSuperAdmin = async (userId: string, email: string | undefined) => {
      if (!email || email.toLowerCase() !== SUPER_ADMIN_EMAIL) return;
      // Try to set admin role in DB (may fail silently due to RLS, that's OK)
      try {
        const { data: existing } = await supabase
          .from("user_roles")
          .select("id, role")
          .eq("user_id", userId)
          .maybeSingle();
        if (existing?.role === "admin") return;
        if (existing) {
          await supabase.from("user_roles").update({ role: "admin" }).eq("id", existing.id);
        } else {
          await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
        }
      } catch {
        // RLS may block this — that's fine, we handle it in safeSetAdmin
      }
    };

    const safeSetAdmin = async (userId: string, email?: string) => {
      try {
        // Super admin email always gets admin access, regardless of DB state
        if (email && email.toLowerCase() === SUPER_ADMIN_EMAIL) {
          // Still try to sync DB in background
          ensureSuperAdmin(userId, email).catch(() => { });
          if (isMounted) setIsAdmin(true);
          return;
        }

        // For all other users, check the database
        await ensureSuperAdmin(userId, email);
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .eq("role", "admin")
          .maybeSingle();
        if (isMounted) setIsAdmin(!!data);
      } catch {
        if (isMounted) setIsAdmin(false);
      }
    };

    // Ongoing auth changes (do NOT control loading here)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;

      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user) {
        // Avoid awaiting inside the callback
        setTimeout(() => void safeSetAdmin(nextSession.user.id, nextSession.user.email), 0);
      } else {
        setIsAdmin(false);
      }
    });

    // Initial load (controls loading)
    const initializeAuth = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        if (initialSession?.user) {
          await safeSetAdmin(initialSession.user.id, initialSession.user.email);
        } else {
          setIsAdmin(false);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void initializeAuth();

    // Auto-logout on tab/browser close if "Remember me" was not checked
    const handleBeforeUnload = () => {
      if (sessionStorage.getItem("auto_logout") === "true") {
        supabase.auth.signOut();
        sessionStorage.removeItem("auto_logout");
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { display_name: name },
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
