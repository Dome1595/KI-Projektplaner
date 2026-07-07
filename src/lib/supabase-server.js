// =============================================================================
// Serverseitiger Supabase-Client (nur in Server Actions / Route Handlern
// verwenden – der service_role-Key darf nie ins Client-Bundle).
// Konfiguration über Umgebungsvariablen, siehe .env.example.
// =============================================================================

import { createClient } from '@supabase/supabase-js';

export function getServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
