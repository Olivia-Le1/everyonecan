import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Settings = Record<string, string>;

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("key, value")
      .then(({ data }) => {
        const map: Settings = {};
        (data ?? []).forEach((r: any) => (map[r.key] = r.value));
        setSettings(map);
        setLoading(false);
      });
  }, []);

  const t = (key: string, fallback = "") => settings[key] ?? fallback;

  return { settings, t, loading };
};
