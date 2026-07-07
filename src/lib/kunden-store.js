'use client';

// project imports
import { KUNDEN_SEED } from 'data/kunden-seed';

// =============================================================================
// Datenschicht Kundenverwaltung – Mock-Provider (localStorage).
// Die Funktionssignaturen entsprechen dem späteren Supabase-Provider
// (Tabellen customers/contacts/engagements, supabase/migrations/0001):
// beim Umstieg wird nur diese Datei gegen die Supabase-Implementierung
// getauscht, die Views bleiben unverändert.
// =============================================================================

const STORAGE_KEY = 'kip.kunden.v1';

function readAll() {
  if (typeof window === 'undefined') return KUNDEN_SEED;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(KUNDEN_SEED));
      return KUNDEN_SEED;
    }
    return JSON.parse(raw);
  } catch {
    return KUNDEN_SEED;
  }
}

function writeAll(kunden) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(kunden));
}

export function listKunden() {
  return readAll();
}

export function getKunde(id) {
  return readAll().find((k) => k.id === id) || null;
}

export function createKunde(input) {
  const kunden = readAll();
  const kunde = {
    id: `k-${Date.now().toString(36)}`,
    name: input.name,
    branche: input.branche || null,
    mitarbeiterzahl: input.mitarbeiterzahl ? Number(input.mitarbeiterzahl) : null,
    notizen: input.notizen || null,
    tool_landschaft: {
      plattform: input.plattform || 'Langdock',
      integrationen: input.integrationen || []
    },
    langdock_status: input.langdock_status || 'nicht_gestartet',
    engagement: {
      status: input.engagement_status || 'discovery',
      retainer_eur: input.retainer_eur ? Number(input.retainer_eur) : null,
      laufzeit_monate: input.laufzeit_monate ? Number(input.laufzeit_monate) : null,
      slots_pro_monat: input.slots_pro_monat ? Number(input.slots_pro_monat) : 2,
      start_datum: input.start_datum || null
    },
    firmenprofil_vorhanden: false,
    contacts: input.ansprechpartner
      ? [
          {
            name: input.ansprechpartner,
            rolle: input.ansprechpartner_rolle || null,
            abteilung: input.ansprechpartner_abteilung || null,
            position: input.ansprechpartner_position || null,
            email: input.ansprechpartner_email || null,
            typ: 'entscheider',
            kontextprofil: { rollenprofil: false, team_kontext: false, prioritaeten_ziele: false, kommunikationsstil: false }
          }
        ]
      : []
  };
  writeAll([kunde, ...kunden]);
  return kunde;
}

// ---------------------------------------------------------------------------
// Anzeige-Hilfen (Labels & Chip-Farben gemäß PRD 4.5 / 5.1)
// ---------------------------------------------------------------------------

export const ENGAGEMENT_STATUS = {
  discovery: { label: 'Discovery', color: 'info' },
  angebot: { label: 'Angebot', color: 'warning' },
  aktiv: { label: 'Aktiv', color: 'success' },
  pausiert: { label: 'Pausiert', color: 'default' },
  beendet: { label: 'Beendet', color: 'error' }
};

export const LANGDOCK_STATUS = {
  nicht_gestartet: { label: 'Nicht gestartet', color: 'default' },
  in_einrichtung: { label: 'In Einrichtung', color: 'warning' },
  live: { label: 'Live', color: 'success' }
};

// Kontextprofile werden pro Mitarbeiter erstellt (PRD 4.1); nur das
// Firmenprofil ist firmenbezogen.
export const MITARBEITER_PROFIL_TYPEN = [
  { key: 'rollenprofil', label: 'Rollenprofil' },
  { key: 'team_kontext', label: 'Team-Kontext' },
  { key: 'prioritaeten_ziele', label: 'Prioritäten & Ziele' },
  { key: 'kommunikationsstil', label: 'Kommunikationsstil' }
];

export function kontextprofilStand(kunde) {
  const kontakte = kunde.contacts || [];
  let vorhanden = kunde.firmenprofil_vorhanden ? 1 : 0;
  let gesamt = 1;
  for (const c of kontakte) {
    gesamt += MITARBEITER_PROFIL_TYPEN.length;
    vorhanden += MITARBEITER_PROFIL_TYPEN.filter((t) => c.kontextprofil?.[t.key]).length;
  }
  return { vorhanden, gesamt };
}
