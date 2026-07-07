-- =============================================================================
-- Security-Härtung gemäß Supabase-Advisor (nach Einspielen von 0001)
-- 1) search_path der Trigger-Funktion fixieren (Lint 0011)
-- 2) RPC-Ausführung der RLS-Hilfsfunktion einschränken (Lints 0028/0029):
--    anon braucht sie nie; authenticated behält EXECUTE, da die
--    RLS-Policies die Funktion im Kontext des anfragenden Nutzers auswerten.
-- =============================================================================

alter function public.set_updated_at() set search_path = '';

revoke execute on function public.is_active_internal_user() from public;
revoke execute on function public.is_active_internal_user() from anon;
grant execute on function public.is_active_internal_user() to authenticated;
grant execute on function public.is_active_internal_user() to service_role;
