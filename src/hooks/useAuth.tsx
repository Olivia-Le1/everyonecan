import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_EMAIL = "l01048666065@gmail.com";
const ADMIN_CHECK_FLAG = "admin_session_checked";

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
        const currentUser = data.session?.user ?? null;

        // 이 브라우저 세션(탭)에서 아직 어드민 체크를 안 했다면
        const alreadyChecked = sessionStorage.getItem(ADMIN_CHECK_FLAG);
        if (!alreadyChecked) {
          sessionStorage.setItem(ADMIN_CHECK_FLAG, "1");

          if (currentUser?.email === ADMIN_EMAIL) {
            // 어드민 계정이 자동으로 로그인된 상태면 강제 로그아웃
            await supabase.auth.signOut();
            applyUser(null, null);
            setLoading(false);
            return;
          }
        }

        applyUser(currentUser, data.session);
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
