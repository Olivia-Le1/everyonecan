const channel = supabase
  .channel("site_settings_changes")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "site_settings",
    },
    () => {
      loadSettings();
    }
  );

channel.subscribe();

return () => {
  supabase.removeChannel(channel);
};
