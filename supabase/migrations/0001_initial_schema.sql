-- =============================================================================
-- KI-Projektplaner – Initiales Datenbankschema
-- Quelle: PRD Kapitel 9.2 (Datenmodell) und 4.5 (Statusmodell)
-- Ziel: Supabase (PostgreSQL, EU-Region)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Enums (Statusmodell und verbindliche Begriffe aus PRD Kapitel 4)
-- ---------------------------------------------------------------------------

create type engagement_status as enum ('discovery', 'angebot', 'aktiv', 'pausiert', 'beendet');
create type langdock_status as enum ('nicht_gestartet', 'in_einrichtung', 'live');
create type contact_typ as enum ('entscheider', 'key_user', 'it', 'sonstig');
create type document_typ as enum (
  'rollenprofil',
  'firmenprofil',
  'team_kontext',
  'prioritaeten_ziele',
  'kommunikationsstil',
  'transkript',
  'sonstiges'
);
create type use_case_quelle as enum ('ki', 'manuell');
create type use_case_einordnung as enum ('skill', 'agent', 'workflow', 'anwendung');
create type use_case_status as enum ('idee', 'qualifiziert', 'konzipiert', 'in_umsetzung', 'live', 'verworfen');
create type hebel_label as enum ('hoch', 'mittel', 'gering');
create type reichweite_label as enum ('person', 'team', 'abteilung');
create type slot_status as enum ('geplant', 'in_umsetzung', 'umgesetzt', 'verschoben');
create type export_typ as enum (
  'roadmap_pdf',
  'roadmap_md',
  'quickwin_md',
  'monatsreview_pdf',
  'monatsreview_md',
  'arbeitsanweisung_md',
  'zip'
);
create type prompt_stufe as enum ('klassifikation', 'extraktion', 'qualifizierung', 'konzeption');

-- ---------------------------------------------------------------------------
-- Hilfsfunktion: updated_at automatisch pflegen
-- ---------------------------------------------------------------------------

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Interne Nutzer (MVP: alle gleichberechtigt, PRD 5.9)
-- Verknüpft mit Supabase Auth (Microsoft 365 SSO via Entra ID)
-- ---------------------------------------------------------------------------

create table app_users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  name text,
  entra_id text unique,
  aktiv boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Kunden & Engagements (PRD 5.1)
-- ---------------------------------------------------------------------------

create table customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  branche text,
  mitarbeiterzahl integer,
  logo_ref text,
  notizen text,
  -- Tool-Landschaft (PRD 5.1): { "plattform": "Langdock", "integrationen": ["Outlook", "ERP: XY", ...] }
  tool_landschaft jsonb not null default '{}'::jsonb,
  langdock_status langdock_status not null default 'nicht_gestartet',
  langdock_notizen text,
  archiviert_am timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_customers_updated_at before update on customers
for each row execute function set_updated_at();

create table contacts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers (id) on delete cascade,
  name text not null,
  rolle text,
  email text,
  typ contact_typ not null default 'sonstig',
  created_at timestamptz not null default now()
);

create index idx_contacts_customer on contacts (customer_id);

create table engagements (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers (id) on delete cascade,
  status engagement_status not null default 'discovery',
  retainer_eur numeric(8, 2) check (retainer_eur is null or retainer_eur >= 0),
  laufzeit_monate smallint check (laufzeit_monate in (6, 12)),
  start_datum date,
  ende_datum date,
  slots_pro_monat smallint not null default 2 check (slots_pro_monat between 1 and 3),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_engagements_customer on engagements (customer_id);

create trigger trg_engagements_updated_at before update on engagements
for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Dokumente: Kontextprofile & Transkripte, versioniert (PRD 5.2)
-- ---------------------------------------------------------------------------

create table documents (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers (id) on delete cascade,
  typ document_typ not null,
  contact_id uuid references contacts (id) on delete set null,
  -- Versionierung: neue Version verweist auf Vorgänger; genau eine aktuelle Version je Strang
  vorgaenger_id uuid references documents (id) on delete set null,
  version integer not null default 1 check (version >= 1),
  ist_aktuell boolean not null default true,
  dateiname text,
  storage_ref text,
  text_extrahiert text,
  -- Transkript-Metadaten (PRD 5.2): { "termindatum": "2026-07-01", "teilnehmer": [...], "terminart": "discovery" }
  metadaten jsonb not null default '{}'::jsonb,
  erstellt_von uuid references app_users (id),
  created_at timestamptz not null default now()
);

create index idx_documents_customer on documents (customer_id);
create index idx_documents_customer_aktuell on documents (customer_id, typ) where ist_aktuell;

-- ---------------------------------------------------------------------------
-- Analyse-Läufe (PRD 5.3 A, 7.4: Nachvollziehbarkeit)
-- ---------------------------------------------------------------------------

create table analysis_runs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers (id) on delete cascade,
  dokument_ids uuid[] not null default '{}',
  prompt_version text not null,
  modell_version text not null,
  gestartet_von uuid references app_users (id),
  gestartet_am timestamptz not null default now(),
  dauer_sekunden integer,
  roh_ergebnis jsonb,
  anzahl_uebernommen integer not null default 0,
  anzahl_verworfen integer not null default 0
);

create index idx_analysis_runs_customer on analysis_runs (customer_id);

-- ---------------------------------------------------------------------------
-- Use Cases: Karte, Belege, Qualifizierung, Arbeitsanweisung (PRD 5.3–5.5)
-- ---------------------------------------------------------------------------

create table use_cases (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers (id) on delete cascade,
  analysis_run_id uuid references analysis_runs (id) on delete set null,
  quelle use_case_quelle not null default 'manuell',
  titel text not null,
  -- Quick-Win-Karte (PRD 4.2): { "aufgabe", "problem", "ki_loesung", "tools_daten", "frequenz", "nutzen", "reflexionsfragen": [] }
  karte jsonb not null default '{}'::jsonb,
  einordnung use_case_einordnung not null default 'skill',
  -- Belege (PRD 7.4, Pflicht bei quelle = 'ki'): [ { "dokument_id", "zitat", "fundstelle" } ]
  belege jsonb not null default '[]'::jsonb,
  status use_case_status not null default 'idee',
  verworfen_begruendung text,
  -- Qualifizierung (PRD 5.3 B, 9 Abschnitte): je Abschnitt { "inhalt", "bestaetigt": bool }
  qualifizierung jsonb not null default '{}'::jsonb,
  -- Arbeitsanweisung (PRD 5.3 C, typspezifische Felder): je Feld { "inhalt", "bestaetigt": bool }
  arbeitsanweisung jsonb not null default '{}'::jsonb,
  -- Scoring (PRD 4.4)
  wochenhebel hebel_label,
  wochenhebel_min_pro_woche integer check (wochenhebel_min_pro_woche is null or wochenhebel_min_pro_woche >= 0),
  huerde hebel_label,
  reichweite reichweite_label,
  reichweite_personen integer check (reichweite_personen is null or reichweite_personen >= 1),
  vorschlags_rang integer,
  manueller_rang integer,
  rang_begruendung text,
  empfehlung boolean not null default false,
  verknuepfte_use_case_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Verworfen nur mit Begründung (PRD 4.5)
  constraint chk_verworfen_begruendung check (status <> 'verworfen' or verworfen_begruendung is not null)
);

create index idx_use_cases_customer on use_cases (customer_id);
create index idx_use_cases_customer_status on use_cases (customer_id, status);
-- Genau eine Empfehlung pro Kunde (PRD 4.4)
create unique index uq_use_cases_empfehlung on use_cases (customer_id) where empfehlung;

create trigger trg_use_cases_updated_at before update on use_cases
for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Roadmap-Slots (PRD 5.6)
-- ---------------------------------------------------------------------------

create table roadmap_slots (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid not null references engagements (id) on delete cascade,
  monat smallint not null check (monat between 1 and 12),
  slot_nr smallint not null check (slot_nr between 1 and 3),
  use_case_id uuid references use_cases (id) on delete set null,
  -- Sonderbelegung ohne Use Case, z. B. 'langdock_setup' (Monat 1, PRD 5.6)
  sondertyp text,
  status slot_status not null default 'geplant',
  -- Verschiebe-/Status-Historie: [ { "am", "von_monat", "nach_monat", "status", "durch" } ]
  historie jsonb not null default '[]'::jsonb,
  aktualisiert_von uuid references app_users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (engagement_id, monat, slot_nr),
  -- Slot ist entweder frei, mit Use Case belegt oder Sonderbelegung
  constraint chk_slot_belegung check (use_case_id is null or sondertyp is null)
);

create index idx_roadmap_slots_engagement on roadmap_slots (engagement_id);

create trigger trg_roadmap_slots_updated_at before update on roadmap_slots
for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Exporte (PRD 5.7, Export-Protokoll)
-- ---------------------------------------------------------------------------

create table exports (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers (id) on delete cascade,
  typ export_typ not null,
  datei_ref text,
  erstellt_von uuid references app_users (id),
  created_at timestamptz not null default now()
);

create index idx_exports_customer on exports (customer_id);

-- ---------------------------------------------------------------------------
-- Prompt-Versionen (PRD 5.9, 7.5: Methodik-Anpassung ohne Deployment)
-- ---------------------------------------------------------------------------

create table prompt_versions (
  id uuid primary key default gen_random_uuid(),
  stufe prompt_stufe not null,
  version text not null,
  inhalt text not null,
  aktiv boolean not null default false,
  created_at timestamptz not null default now(),
  unique (stufe, version)
);

-- Genau eine aktive Version je Stufe
create unique index uq_prompt_versions_aktiv on prompt_versions (stufe) where aktiv;

-- ---------------------------------------------------------------------------
-- Lösch-Protokoll (PRD 7.3 / US-014, ohne Personenbezug)
-- ---------------------------------------------------------------------------

create table deletion_log (
  id uuid primary key default gen_random_uuid(),
  kunde_name text not null,
  umfang jsonb not null default '{}'::jsonb, -- Zähler je Entität, keine Inhalte
  geloescht_von uuid references app_users (id),
  geloescht_am timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row-Level-Security
-- MVP: interne Anwendung – Zugriff ausschließlich für aktive interne Nutzer
-- (alle gleichberechtigt, PRD 3.1/5.9). Die Mandantentrennung je Kunde wirkt
-- auf Anwendungsebene (Prompts/Exporte); ein Kundenzugang existiert nicht.
-- ---------------------------------------------------------------------------

create or replace function is_active_internal_user()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from app_users u
    where u.id = auth.uid() and u.aktiv
  );
$$;

alter table app_users enable row level security;
alter table customers enable row level security;
alter table contacts enable row level security;
alter table engagements enable row level security;
alter table documents enable row level security;
alter table analysis_runs enable row level security;
alter table use_cases enable row level security;
alter table roadmap_slots enable row level security;
alter table exports enable row level security;
alter table prompt_versions enable row level security;
alter table deletion_log enable row level security;

-- app_users: eigenen Datensatz lesen; Verwaltung über Service-Role (Einladungs-Flow)
create policy app_users_select_self on app_users
  for select using (id = auth.uid());

-- Fachtabellen: Vollzugriff für aktive interne Nutzer
do $$
declare
  t text;
begin
  foreach t in array array[
    'customers', 'contacts', 'engagements', 'documents',
    'analysis_runs', 'use_cases', 'roadmap_slots', 'exports',
    'prompt_versions', 'deletion_log'
  ] loop
    execute format(
      'create policy %I_internal_all on %I for all using (is_active_internal_user()) with check (is_active_internal_user());',
      t, t
    );
  end loop;
end;
$$;
