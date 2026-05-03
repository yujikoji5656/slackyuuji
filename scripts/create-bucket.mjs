import { createClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

const { data, error } = await supabase.storage.createBucket("chat-images", {
  public: true,
});

if (error) {
  console.error("Failed:", error.message);
  process.exit(1);
}

console.log("Created:", data);
