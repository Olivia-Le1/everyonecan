import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Settings = Record<string, string>;

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const { data } = await supabase
        .from("site_settings")
        .select("key, value");
      
      const map: Settings = {};
      (data ?? []).forEach((r: any) => (map[r.key] = r.value));
      setSettings(map);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();

    // 실시간 업데이트 구독
    const subscription = supabase
      .channel("site_settings_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings" },
        () => {
          loadSettings();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const t = (key: string, fallback = "") => settings[key] ?? fallback;

  return { settings, t, loading };
};
