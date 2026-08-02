import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_EMAIL = "l01048666065@gmail.com";

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const applyUser = (currentUser: User | null, currentSession: Session | null) => {
      setSession(currentSession);
      setUser(currentUser);
      setIsAdmin(currentUser?.email === ADMIN_EMAIL);
    };

    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        applyUser(data.session?.user ?? null, data.session);
      } catch (error) {
        console.error("Auth init error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      applyUser(newSession?.user ?? null, newSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    session,
    user,
    isAdmin,
    loading,
    signOut,
  };
};
