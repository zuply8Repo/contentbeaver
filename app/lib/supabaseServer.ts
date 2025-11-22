import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client using the service role key.
// IMPORTANT: Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  // Fail fast on the server if env vars are missing so it's obvious in logs.
  throw new Error(
    "Supabase server env vars missing. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
  },
});


