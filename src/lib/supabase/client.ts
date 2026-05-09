import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/config/env";

export function createClient() {
  if (!env.supabaseUrl || !env.supabasePublishableKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createBrowserClient(env.supabaseUrl, env.supabasePublishableKey);
}
