import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const applySession = async (nextSession: Session | null) => {
      if (!active) return;

      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (!nextSession?.user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", nextSession.user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (error) throw error;
        if (active) setIsAdmin(data?.role === "admin");
      } catch (error) {
        console.error("Admin role check error:", error);
        if (active) setIsAdmin(false);
      } finally {
        if (active) setLoading(false);
      }
    };

    const initAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Auth init error:", error);
        await applySession(null);
        return;
      }
      await applySession(data.session);
    };

    void initAuth();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setLoading(true);
      void applySession(s);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = () => supabase.auth.signOut();

  return { session, user, isAdmin, loading, signOut };
};
