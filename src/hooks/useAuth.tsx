import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!user) {
    setIsAdmin(false);
    return;
  }

  setIsAdmin(user.email === "l01048666065@gmail.com");
}, [user]);
  const signOut = () => supabase.auth.signOut();

  return { session, user, isAdmin, loading, signOut };
};
